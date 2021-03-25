import firebase, { db } from '@/plugins/firebase'

export const listenRoomMessage = ({ commit, roomId }) => {
  const unsubscribe = db
    .collection('messages')
    .doc(roomId)
    .onSnapshot((doc) => {
      let data = {}
      if (doc.exists) {
        data = doc.data()
      }
      commit('set_room_message', data)
    })
  return unsubscribe
}

export const postMessage = ({ message, uid, roomId }) => {
  const postJson = {
    message,
    uid,
    created_at: firebase.firestore.FieldValue.serverTimestamp(),
  }

  const messageRef = db.collection('messages').doc(roomId)
  messageRef.set(postJson, { merge: true })
}

export const deleteMessage = (roomId) => {
  const messageRef = db.collection('messages').doc(roomId)
  messageRef.delete()
}
