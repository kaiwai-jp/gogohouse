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

export const enterSocialRoom = async (roomId) => {
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('enterSocialRoom')
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

export const getUsersMyRoomList = async (uid) => {
  let roomList = []
  const userQuery = db.collection('rooms').where('owner_id', '==', uid)
  const querySnapshot = await userQuery.get()
  querySnapshot.forEach((doc) => {
    const roomData = doc.data()
    roomList.push(roomData)
  })
  return roomList
}

export const getUsersMemberRoomList = async (uid) => {
  let roomList = []
  const userQuery = db
    .collection('rooms')
    .where('members', 'array-contains', uid)
  const querySnapshot = await userQuery.get()
  querySnapshot.forEach((doc) => {
    const roomData = doc.data()
    roomList.push(roomData)
  })
  return roomList
}

export const ban = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ ban: firebase.firestore.FieldValue.arrayUnion(uid) })
}

export const releaseBan = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ ban: firebase.firestore.FieldValue.arrayRemove(uid) })
}

export const addMember = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ members: firebase.firestore.FieldValue.arrayUnion(uid) })
}

export const releaseMember = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ members: firebase.firestore.FieldValue.arrayRemove(uid) })
}

export const releaseReservedMember = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({
    reserved_members: firebase.firestore.FieldValue.arrayRemove(uid),
  })
}

export const micAssign = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ mic_assign: firebase.firestore.FieldValue.arrayUnion(uid) })
}

export const releaseMicAssign = (roomId, uid) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ mic_assign: firebase.firestore.FieldValue.arrayRemove(uid) })
}

export const deleteRoom = (roomId) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.delete()
}

export const listenRoom = (commit, roomId) => {
  const unsubscribe = db
    .collection('rooms')
    .doc(roomId)
    .onSnapshot(async (doc) => {
      let room = undefined
      if (doc.exists) {
        room = doc.data()
      }
      console.log(room)
      commit('set_room', room)
    })

  return unsubscribe
}

export const addMeMembers = (roomId) => {
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('addMeMembers')
  return func({ roomId })
}

export const removeMeMembers = (roomId) => {
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('removeMeMembers')
  return func({ roomId })
}

export const getRoomTargetUserIn = async (uid) => {
  let roomId = null
  const userDoc = await db.collection('users').doc(uid).get()
  if (userDoc.exists) {
    const userData = userDoc.data()
    roomId = userData.current_room
    if (!roomId || userData.status !== 'online') return {}
  }

  const roomDoc = await db.collection('rooms').doc(roomId).get()
  if (roomDoc.exists) {
    const roomData = roomDoc.data()
    return roomData
  }
}

export const addMemberByTwitter = async (roomId, screenName) => {
  const userQuery = db.collection('users').where('twitter', '==', screenName)
  const querySnapshot = await userQuery.get()
  let alreadyExists = false
  querySnapshot.forEach((doc) => {
    alreadyExists = true
    const userData = doc.data()
    const uid = userData.uid

    const roomRef = db.collection('rooms').doc(roomId)
    roomRef.update({ members: firebase.firestore.FieldValue.arrayUnion(uid) })
  })
  if (alreadyExists) return
  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('addReservedMembers')
  return func({ roomId, screenName })
}

export const updateMicEnable = (roomId, statusString) => {
  const roomRef = db.collection('rooms').doc(roomId)
  roomRef.update({ mic_enable: statusString })
}
