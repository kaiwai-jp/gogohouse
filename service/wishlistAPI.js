import firebase, { db } from '@/plugins/firebase'

export const addWishlistByTwitter = async (myUid, screenName) => {
  const userQuery = db.collection('users').where('twitter', '==', screenName)
  const querySnapshot = await userQuery.get()
  let alreadyExists = false
  querySnapshot.forEach((doc) => {
    alreadyExists = true
    const userData = doc.data()
    const uid = userData.uid

    const userPrivateRef = db.collection('user_privates').doc(myUid)
    userPrivateRef.update({
      wishlist: firebase.firestore.FieldValue.arrayUnion(uid),
    })
  })
  if (alreadyExists) return

  const functions = firebase.app().functions('asia-northeast1')
  const func = functions.httpsCallable('addReservedWishlist')
  return func({ screenName })
}

export const listenUserPrivates = ({ commit, myUid }) => {
  const unsubscribe = db
    .collection('user_privates')
    .doc(myUid)
    .onSnapshot((doc) => {
      let data = {}
      if (doc.exists) {
        data = doc.data()
      }
      commit('set_user_privates', data)
    })
  return unsubscribe
}

export const releaseWishlist = (myUid, uid) => {
  const userPrivatesRef = db.collection('user_privates').doc(myUid)
  userPrivatesRef.update({
    wishlist: firebase.firestore.FieldValue.arrayRemove(uid),
  })
}

export const releaseReservedWishlist = (myUid, uid) => {
  const userPrivatesRef = db.collection('user_privates').doc(myUid)
  userPrivatesRef.update({
    reserved_wishlist: firebase.firestore.FieldValue.arrayRemove(uid),
  })
}

export const releaseMatchlist = (myUid, uid) => {
  const userPrivatesRef = db.collection('user_privates').doc(myUid)
  userPrivatesRef.update({
    matchlist: firebase.firestore.FieldValue.arrayRemove(uid),
  })
}
