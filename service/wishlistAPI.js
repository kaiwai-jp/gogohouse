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
  const func = functions.httpsCallable('addReservedWishList')
  return func({ screenName })
}
