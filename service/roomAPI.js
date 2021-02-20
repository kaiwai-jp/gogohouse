import firebase, { db } from '@/plugins/firebase'

export const createRoom = (payload) => {
  return new Promise((resolve) => {
    const roomRef = db.collection('rooms')
    const roomId = roomRef.doc().id
    roomRef
      .doc(roomId)
      .set({
        ...payload,
        id: roomId,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => resolve(roomId))
  })
}

export const getRoom = async (roomId) => {
  const roomDoc = await db.collection('rooms').doc(roomId).get()
  if (roomDoc.exists) {
    const roomInfo = roomDoc.data()
    return roomInfo
  }
}

export const enterOpenRoom = async (roomId) => {
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('enterOpenRoom')
  return func({ roomId })
}

export const enterClosedRoom = async (roomId) => {
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('enterClosedRoom')
  return func({ roomId })
}

export const listenMyRoomList = (commit, uid) => {
  const unsubscribe = db
    .collection('rooms')
    .where('owner_id', '==', uid)
    //.orderBy('created_at', 'desc')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data()
        if (change.type === 'added') {
          commit('add_my_room_list', data)
        } else if (change.type === 'modified') {
          commit('modify_my_room_list', data)
        } else if (change.type === 'removed') {
          commit('remove_my_room_list', data)
        }
      })
    })
  return unsubscribe
}

export const listenMemberRoomList = (commit, uid) => {
  const unsubscribe = db
    .collection('rooms')
    .where('members', 'array-contains', uid)
    //.orderBy('created_at', 'desc')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data()
        if (change.type === 'added') {
          commit('add_member_room_list', data)
        } else if (change.type === 'modified') {
          commit('modify_member_room_list', data)
        } else if (change.type === 'removed') {
          commit('remove_member_room_list', data)
        }
      })
    })
  return unsubscribe
}

export const ban = async (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ ban: firebase.firestore.FieldValue.arrayUnion(uid) })
}

export const release = async (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ ban: firebase.firestore.FieldValue.arrayRemove(uid) })
}

export const deleteRoom = async (roomId) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.delete()
}

export const listenRoom = (commit, roomId) => {
  const unsubscribe = db
    .collection('rooms')
    .doc(roomId)
    .onSnapshot(async (doc) => {
      let room = {}
      if (doc.exists) {
        room = doc.data()
      }
      commit('set_room', room)
    })

  return unsubscribe
}
