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
  const connectionsRef = connRef.doc(connectionId)

  dispatch('STATE_CHANGE', { connectionId, stateString: 'offer' })

  /* WebRTC通信用のオブジェクトを作成 */
  const peerConnection = new RTCPeerConnection(configuration)

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })

  commit('set_peerconnection_obj', { connectionId, peerConnection })
  commit('set_local_user_to_conn_id', { uid: partnerUid, connectionId })

  /*--- 監視系---*/
  registerPeerConnectionListeners(dispatch, { connectionId, peerConnection })

  /* ICE Candidateが取れたらcandidate_offerサブコレクションに書き込み */
  const candidatesOfferCollection = connectionsRef.collection('candidate_offer')
  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      const json = event.candidate.toJSON()
      candidatesOfferCollection.add(json)
    }
  })

  /* ICE Candidateを監視*/
  const candidatesAnswerCollection = connectionsRef.collection(
    'candidate_answer'
  )
  const iceUnsubscribe = candidatesAnswerCollection.onSnapshot(function (
    snapshot
  ) {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        if (!change.doc.data().candidate) return
        const candidate = new RTCIceCandidate(change.doc.data())
        if (peerConnection.signalingState === 'stable') {
          peerConnection
            .addIceCandidate(candidate)
            .catch((err) => commit('set_err_report', err))
        } else {
          commit('push_ice_candidate', { connectionId, candidate })
        }
      }
    })
  })

  /* 相手からのAnswerを監視 */
  const unsubscribe = connectionsRef.onSnapshot(async (doc) => {
    const data = doc.data()
    if (data.answer) {
      const answer = new RTCSessionDescription(data.answer)
      /* AnswerをpeerConnectionにセット */
      try {
        await peerConnection.setRemoteDescription(answer)
      } catch (err) {
        commit('set_err_report', err)
      }
      unsubscribe()
    }
    commit('set_ice_unsubscribe', { connectionId, iceUnsubscribe })
  })
  /*--- 監視系ここまで---*/

  /* OfferをpeerConnectionにセット */
  const offer = await peerConnection.createOffer()
  await peerConnection
    .setLocalDescription(offer)
    .catch((err) => commit('set_err_report', err))

  /* offerのデータをconnectionsコレクションに書き込み */
  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    /* serverTimestampだとonSnapshotが2回発火するので */
    created_at: new Date(),
  }
  await connectionsRef.set(roomWithOffer)

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
  peerConnection.addEventListener('signalingstatechange', () => {
    if (peerConnection.signalingState === 'stable') {
      dispatch('ADD_ICE_CANDIDATE_QUEUED', { connectionId, peerConnection })
    }
  })
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

export const offered = async (dispatch, commit, partnerUid, connectionId) => {
  const connectionsRef = db.collection('connections').doc(connectionId)
  let peerConnection, remoteStream, iceUnsubscribe

  dispatch('STATE_CHANGE', { connectionId, stateString: 'offered' })

  const unsubscribe = connectionsRef.onSnapshot(async (doc) => {
    /* offerのデータを検知した */
    if (doc.data().offer && !doc.metadata.hasPendingWrites) {
      peerConnection = new RTCPeerConnection(configuration)
      commit('set_peerconnection_obj', { connectionId, peerConnection })
      commit('set_remote_user_to_conn_id', { uid: partnerUid, connectionId })

      /*--- 監視系---*/
      registerPeerConnectionListeners(dispatch, {
        connectionId,
        peerConnection,
      })

      /* ICE Candidateが取れたらcandidate_answerサブコレクションに書き込み */
      const candidatesAnswerCollection = connectionsRef.collection(
        'candidate_answer'
      )
      peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON()
          candidatesAnswerCollection.add(json)
        }
      })

      /* ICE Candidateを監視 */
      const candidatesOfferCollection = connectionsRef.collection(
        'candidate_offer'
      )
      iceUnsubscribe = candidatesOfferCollection.onSnapshot(function (
        snapshot
      ) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            if (!change.doc.data().candidate) return
            const candidate = new RTCIceCandidate(change.doc.data())
            peerConnection
              .addIceCandidate(candidate)
              .catch((err) => commit('set_err_report', err))
          }
        })
      })
      commit('set_ice_unsubscribe', { connectionId, iceUnsubscribe })
      /*--- 監視系ここまで---*/

      remoteStream = new MediaStream()
      /* 受信したストリームをリモートストリームに設定 */
      peerConnection.addEventListener('track', (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track)
        })
      })
      commit('set_remote_stream', { connectionId, stream: remoteStream })

      /* OfferとAnswerをpeerConnectionにセット */
      const offer = doc.data().offer
      try {
        await peerConnection.setRemoteDescription(offer)
      } catch (err) {
        commit('set_err_report', err)
        unsubscribe()
        return
      }
      const answer = await peerConnection.createAnswer()
      await peerConnection
        .setLocalDescription(answer)
        .catch((err) => commit('set_err_report', err))
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
