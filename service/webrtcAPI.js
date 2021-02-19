import firebase, { db } from '@/plugins/firebase'

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun3.l.google.com:19302', 'stun:stun4.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
}

export const offer = async (
  dispatch,
  commit,
  myUid,
  partnerUid,
  localStream
) => {
  const connRef = db.collection('connections')
  const connectionId = connRef.doc().id
  dispatch('STATE_CHANGE', { connectionId, stateString: 'offer' })

  /* WebRTC通信用のオブジェクトを作成 */
  const peerConnection = new RTCPeerConnection(configuration)
  registerPeerConnectionListeners(dispatch, { connectionId, peerConnection })
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })
  const offer = await peerConnection.createOffer()
  /* offerのデータをconnectionsコレクションに書き込み */
  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  }
  const connectionsRef = connRef.doc(connectionId)
  connectionsRef.set(roomWithOffer)

  /* オファーの通知を相手のconnections_offeredサブコレクションに書き込み */
  const connectionsOfferedRef = db
    .collection('users')
    .doc(partnerUid)
    .collection('connections_offered')
    .doc(connectionId)
  const connectionsOfferedData = {
    from: myUid,
    data: 'mic',
  }
  await connectionsOfferedRef.set(connectionsOfferedData)
  commit('set_local_user_to_conn_id', { uid: partnerUid, connectionId })
  commit('set_peerconnection_obj', { connectionId, peerConnection })

  /* ICE Candidateを書き込み */
  const candidatesOfferCollection = connectionsRef.collection('candidate_offer')
  const candidatesAnswerCollection = connectionsRef.collection(
    'candidate_answer'
  )
  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      const json = event.candidate.toJSON()
      candidatesOfferCollection.add(json)
    }
  })
  /* OfferをpeerConnectionにセット */
  await peerConnection.setLocalDescription(offer)
  /* ICE Candidateを監視*/
  const iceUnsubscribe = candidatesAnswerCollection.onSnapshot(function (
    snapshot
  ) {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const candidate = new RTCIceCandidate(change.doc.data())
        peerConnection
          .addIceCandidate(candidate)
          .catch((err) => commit('set_err_report', err))
      }
    })
  })
  commit('set_ice_unsubscribe', { connectionId, iceUnsubscribe })

  /* 相手からのAnswerを監視 */
  const unsubscribe = connectionsRef.onSnapshot(async (doc) => {
    const data = doc.data()
    if (data.answer) {
      if (!peerConnection.currentRemoteDescription) {
        const answer = new RTCSessionDescription(data.answer)
        /* AnswerをpeerConnectionにセット */
        try {
          await peerConnection.setRemoteDescription(answer)
        } catch (err) {
          commit('set_err_report', err)
        }
      }
      unsubscribe()
    }
  })
  return { connectionId, peerConnection, iceUnsubscribe }
}

const registerPeerConnectionListeners = (
  dispatch,
  { connectionId, peerConnection }
) => {
  peerConnection.addEventListener('icegatheringstatechange', () => {})
  peerConnection.addEventListener('connectionstatechange', () => {
    dispatch('STATE_CHANGE', {
      connectionId,
      stateString: peerConnection.connectionState,
    })
    if (peerConnection.connectionState == 'connected') {
      dispatch('ICE_UNSUBSCRIBE', peerConnection)
    } else if (
      peerConnection.connectionState == 'failed' ||
      peerConnection.connectionState == 'closed'
    ) {
      dispatch('CONNECTION_FINISH_WITH_PEERCONNECTION', peerConnection)
    }
  })
  peerConnection.addEventListener('signalingstatechange', () => {})
  peerConnection.addEventListener('iceconnectionstatechange ', () => {})
}

export const listenConnectionOffered = (dispatch, uid) => {
  const unsubscribe = db
    .collection('users')
    .doc(uid)
    .collection('connections_offered')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const offeredData = change.doc.data()
        offeredData.id = change.doc.id
        if (change.type === 'added') {
          if (offeredData.data == 'mic' && offeredData.from) {
            dispatch('OFFERED', {
              uid: offeredData.from,
              connectionId: offeredData.id,
            })
          }
        }
      })
    })
  return unsubscribe
}

export const offered = async (dispatch, commit, connectionId) => {
  dispatch('STATE_CHANGE', { connectionId, stateString: 'offered' })
  const connectionsRef = db.collection('connections').doc(connectionId)
  let peerConnection, remoteStream, iceUnsubscribe
  const unsubscribe = connectionsRef.onSnapshot(async (doc) => {
    /* offerのデータを検知した */
    if (doc.data().offer && !doc.data().answer) {
      peerConnection = new RTCPeerConnection(configuration)
      commit('set_peerconnection_obj', { connectionId, peerConnection })
      registerPeerConnectionListeners(dispatch, {
        connectionId,
        peerConnection,
      })
      /* ICE Candidateを書き込み */
      const candidatesAnswerCollection = connectionsRef.collection(
        'candidate_answer'
      )
      const candidatesOfferCollection = connectionsRef.collection(
        'candidate_offer'
      )
      peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON()
          candidatesAnswerCollection.add(json)
        }
      })
      /* ICE Candidateを監視 */
      iceUnsubscribe = candidatesOfferCollection.onSnapshot(function (
        snapshot
      ) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data())
            peerConnection
              .addIceCandidate(candidate)
              .catch((err) => commit('set_err_report', err))
          }
        })
      })
      commit('set_ice_unsubscribe', { connectionId, iceUnsubscribe })

      remoteStream = new MediaStream()
      /* 受信したストリームをリモートストリームに設定 */
      peerConnection.addEventListener('track', (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track)
        })
      })
      commit('set_remote_stream', { connectionId, stream: remoteStream })
      // OfferとAnswerをpeerConnectionにセット
      const offer = doc.data().offer
      try {
        await peerConnection.setRemoteDescription(offer)
      } catch (err) {
        commit('set_err_report', err)
        unsubscribe()
        return
      }
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      }
      await connectionsRef.update(roomWithAnswer)
    }
    unsubscribe()
  })
}

export const clearOfferedDB = (myUid) => {
  const connectionsOfferedRef = db
    .collection('users')
    .doc(myUid)
    .collection('connections_offered')
  connectionsOfferedRef.get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const connectionsRef = db.collection('connections').doc(doc.id)
      connectionsRef.delete().catch()

      const connectionsCandidateOfferRef = connectionsRef.collection(
        'candidate_offer'
      )
      connectionsCandidateOfferRef.get().then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete()
        })
      })

      const connectionsCandidateAnswerRef = connectionsRef.collection(
        'candidate_answer'
      )
      connectionsCandidateAnswerRef.get().then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.delete()
        })
      })
      doc.ref.delete()
    })
  })
}

export const clearConnectionsDB = () => {
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('clearConnectionsDBAll')
  return func()
}
