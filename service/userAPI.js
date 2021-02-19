import firebase, { db, auth } from '@/plugins/firebase'

let userDataCached = {}

export const twitterSignIn = () => {
  const provider = new firebase.auth.TwitterAuthProvider()

  return new Promise((resolve, reject) => {
    auth
      .signInWithPopup(provider)
      .then((userCredential) => {
        if (userCredential.user) {
          const uid = userCredential.user.uid
          const myName = userCredential.user.displayName
          const screenName = userCredential.additionalUserInfo.username
          const iconUrl = userCredential.user.photoURL
          const profile = userCredential.additionalUserInfo.profile.description
          const accessToken = userCredential.credential.accessToken
          const accessTokenSecret = userCredential.credential.secret

          const UserRef = db.collection('users').doc(uid)
          UserRef.get().then((doc) => {
            if (!doc.exists) {
              /* Firestoreにドキュメントを作成 */
              UserRef.set({
                uid,
                name: myName,
                twitter: '@' + screenName,
                icon: iconUrl,
                profile,
                mic_enable: true,
                status: 'offline',
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
              })
              /* RealtimeDatabaseにstatusとlast_changedを作成 */
              offline()
            } else {
              UserRef.update({
                name: myName,
                twitter: '@' + screenName,
                icon: iconUrl,
                profile,
              })
            }
            db.collection('user_privates').doc(uid).set({
              accessToken,
              accessTokenSecret,
            })
          })
          resolve(uid)
        }
      })
      .catch((err) => reject(err))
  })
}

export const onAuthChanged = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const UserRef = db.collection('users').doc(user.uid)
        UserRef.get().then((doc) => {
          const userInfo = doc.data()
          resolve(userInfo)
        })
      }
      unsubscribe()
    })
  })
}

export const signOut = () => {
  return new Promise((resolve, reject) => {
    auth.signOut().then(() => {
      resolve()
    })
  })
}

export const getUserData = ({ uid, force }) => {
  return new Promise((resolve, reject) => {
    if (force || !userDataCached[uid]) {
      userDataCached[uid] = true
      db.collection('users')
        .doc(uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data()
            resolve(data)
          }
          reject('data not found')
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}

export const listenRoomOnlineUsers = ({ commit, roomId }) => {
  const unsubscribe = db
    .collection('users')
    .where('current_room', '==', roomId)
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data()
        if (change.type === 'added') {
          commit('add_room_online_users', data)
        } else if (change.type === 'modified') {
          commit('modify_room_online_users', data)
        } else if (change.type === 'removed') {
          commit('remove_room_online_users', data)
        }
      })
    })
  return unsubscribe
}

export const registConnectAndWhenDisconnect = (roomId, myUid) => {
  const userStatusDatabaseRef = firebase.database().ref('/status/' + myUid)

  const isOfflineForDatabase = {
    room: null,
    status: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  }
  const isOnlineForDatabase = {
    room: roomId,
    status: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  }

  firebase
    .database()
    .ref('.info/connected')
    .on('value', (snapshot) => {
      if (snapshot.val() === false) {
        return
      }
      userStatusDatabaseRef
        .onDisconnect()
        .set(isOfflineForDatabase)
        .then(() => {
          userStatusDatabaseRef.set(isOnlineForDatabase)
        })
    })
}

export const online = (myUid) => {
  const userRef = db.collection('users').doc(myUid)
  userRef.update({ status: 'online' })
}

export const unregistDisconnect = (myUid) => {
  const userStatusDatabaseRef = firebase.database().ref('/status/' + myUid)
  userStatusDatabaseRef.onDisconnect().remove((err) => {
    if (err) console.log(err)
  })
}

export const offline = async (myUid) => {
  const userRef = db.collection('users').doc(myUid)
  await userRef.update({ current_room: '', status: 'offline' })

  const userStatusDatabaseRef = firebase.database().ref('/status/' + myUid)

  const isOfflineForDatabase = {
    current_room: '',
    status: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  }
  userStatusDatabaseRef.set(isOfflineForDatabase).then(() => {})
}