import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const firestore = admin.firestore()
const checkFriendShip = require('./twitterFriendShip')
const getTwitterUserData = require('./twitterUserData')

/**
 * Realtime Databaseを監視して、オンラインステータスの変更を検知、更新します.
 */
exports.onUserStatusChanged = functions
  .region('asia-northeast1')
  .database.ref('/status/{uid}')
  .onUpdate((change, context) => {
    const eventStatus = change.after.val()

    const beforeStatus = change.before.val()

    if (beforeStatus.last_changed > eventStatus.last_changed) {
      return null
    }

    /* Firestoreのusersコレクションを更新 */
    const userStatusFirestoreRef = firestore
      .collection('users')
      .doc(context.params.uid)

    let json
    if (eventStatus.status === 'offline') {
      json = {
        current_room: null,
        status: eventStatus.status,
        last_changed: new Date(eventStatus.last_changed),
      }
    } else {
      json = {
        status: eventStatus.status,
        last_changed: new Date(eventStatus.last_changed),
      }
    }
    userStatusFirestoreRef.update(json).catch((err) => console.log(err))

    return
  })

/**
 * オープンルームに入室するための処理を行います(open).
 * @params roomId
 */
exports.enterOpenRoom = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const uid = context.auth!.uid

    const roomsRef = firestore.collection('rooms').doc(data.roomId)
    await roomsRef.get().then((doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'room not found')
      }

      const room = doc.data()!
      if (room.room_type !== 'open') {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'this room is not open'
        )
      }

      if (room.ban && room.ban.indexOf(uid) >= 0) {
        throw new functions.https.HttpsError('unauthenticated', 'banned')
      }
    })

    // 入室処理
    return await firestore.collection('users').doc(uid).update({
      current_room: data.roomId,
    })
  })

/**
 * ソーシャルルームに入室するための処理を行います(social).
 * @params roomId
 */
exports.enterSocialRoom = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const uid = context.auth!.uid

    const roomsRef = firestore.collection('rooms').doc(data.roomId)
    await roomsRef.get().then(async (doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'room not found')
      }

      const room = doc.data()!
      if (room.room_type !== 'social') {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'this room is not social'
        )
      }

      if (room.owner_id === uid) return // 自分がオーナーの時

      if (room.ban && room.ban.indexOf(uid) >= 0) {
        throw new functions.https.HttpsError('unauthenticated', 'banned')
      }

      const owner_twitter_id = room.owner_twitter_id

      const userPrivatesRef = firestore.collection('user_privates').doc(uid)
      const userPrivateDoc = await userPrivatesRef.get()
      const userPrivateData = userPrivateDoc.data()!

      const isFriend = await checkFriendShip(
        userPrivateData.accessToken,
        userPrivateData.accessTokenSecret,
        owner_twitter_id
      )
      if (!isFriend) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'not follow and followed'
        )
      }
    })

    // 入室処理
    return await firestore.collection('users').doc(uid).update({
      current_room: data.roomId,
    })
  })

/**
 * クローズドルームに入室するための処理を行います(closed).
 * @params roomId
 */
exports.enterClosedRoom = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const uid = context.auth!.uid

    const roomsRef = firestore.collection('rooms').doc(data.roomId)
    await roomsRef.get().then((doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'room not found')
      }

      const room = doc.data()!
      if (room.room_type !== 'closed') {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'this room is not closed'
        )
      }

      if (room.members && !room.members.includes(uid)) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'you are not member'
        )
      }

      if (room.ban && room.ban.indexOf(uid) >= 0) {
        throw new functions.https.HttpsError('unauthenticated', 'banned')
      }
    })

    // 入室処理
    return await firestore.collection('users').doc(uid).update({
      current_room: data.roomId,
    })
  })

/* 一定時間経過したconnectionsドキュメントを削除します */
exports.clearConnectionsDBAll = functions
  .region('asia-northeast1')
  .https.onCall((data, context) => {
    const connectionsRef = firestore.collection('connections')
    connectionsRef
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const timestamp = doc.data().created_at
          const dt = timestamp.toDate().getTime()
          const systemTime = Date.now()

          if ((systemTime - dt) / 1000 <= 3600) return
          const connectionsCandidateOfferRef = connectionsRef
            .doc(doc.id)
            .collection('candidate_offer')
          connectionsCandidateOfferRef
            .get()
            .then((snapshot1) => {
              snapshot1.forEach((doc1) => {
                doc1.ref.delete().catch()
              })
            })
            .catch()

          const connectionsCandidateAnswerRef = connectionsRef
            .doc(doc.id)
            .collection('candidate_answer')
          connectionsCandidateAnswerRef
            .get()
            .then((snapshot2) => {
              snapshot2.forEach((doc2) => {
                doc2.ref.delete().catch()
              })
            })
            .catch()
          doc.ref.delete().catch()
        })
      })
      .catch()
  })

/**
 * ユーザーをルームからキックします。usersが対象ルームに居る場合のcurrent_roomをnullにします.
 * @params roomId, userId
 */
exports.kickUser = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const roomId = data.roomId
    const targetUid = data.userId
    const uid = context.auth!.uid

    const roomsRef = firestore.collection('rooms').doc(roomId)
    await roomsRef.get().then(async (doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'room not found')
      }
      const room = doc.data()!
      // オーナー以外のリクエストの時はエラー
      const roomOwnerId = room.owner_id

      if (uid !== roomOwnerId) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'not requested by room_owner'
        )
      }
      return
    })
    const usersRef = firestore.collection('users').doc(targetUid)
    await usersRef.get().then((doc) => {
      const user = doc.data()!
      // 今のフロアに居ないときはエラー
      if (user.current_room !== roomId) {
        throw new functions.https.HttpsError('not-found', 'not in room')
      }
      return
    })

    return firestore.collection('users').doc(targetUid).update({
      // 退室処理
      current_room: null,
    })
  })

/**
 * ユーザーをルームのメンバーに追加します。
 * @params roomId
 */
exports.addMeMembers = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const roomId = data.roomId
    const uid = context.auth!.uid

    const roomsRef = firestore.collection('rooms').doc(roomId)
    await roomsRef.get().then(async (doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'room not found')
      }
      const room = doc.data()!

      if (room.room_type === 'open' || room.room_type === 'social') {
        if (room.ban && room.ban.indexOf(uid) >= 0) {
          throw new functions.https.HttpsError('unauthenticated', 'banned')
        }
        return
      }

      if (room.room_type === 'closed') {
        if (room.ban && room.ban.indexOf(uid) >= 0) {
          throw new functions.https.HttpsError('unauthenticated', 'banned')
        }

        const usersRef = firestore.collection('users').doc(uid)
        await usersRef.get().then((userDoc) => {
          const user = userDoc.data()!
          if (user.current_room !== room.id || user.status !== 'online') {
            throw new functions.https.HttpsError(
              'unauthenticated',
              'room type is closed but user not in the room'
            )
          }
        })
        return
      }

      throw new functions.https.HttpsError(
        'unauthenticated',
        'room type not open or social or close'
      )
    })

    return roomsRef.update({
      members: admin.firestore.FieldValue.arrayUnion(uid),
    })
  })

/**
 * ユーザーをルームのメンバーから削除します。
 * @params roomId
 */
exports.removeMeMembers = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const roomId = data.roomId
    const uid = context.auth!.uid

    const roomsRef = firestore.collection('rooms').doc(roomId)
    await roomsRef.get().then(async (doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'room not found')
      }
    })

    return roomsRef.update({
      members: admin.firestore.FieldValue.arrayRemove(uid),
    })
  })

/**
 * Twitterのスクリーンネームでルームのreserved_member配列と、reservedコレクションに追加します
 * @params roomId
 */

exports.addReservedMembers = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const roomId = data.roomId
    const screenName = data.screenName
    const uid = context.auth!.uid

    const userPrivatesRef = firestore.collection('user_privates').doc(uid)
    const userPrivateDoc = await userPrivatesRef.get()
    const userPrivateData = userPrivateDoc.data()!

    const twitterUserData = await getTwitterUserData(
      userPrivateData.accessToken,
      userPrivateData.accessTokenSecret,
      screenName
    )

    const roomsRef = firestore.collection('rooms').doc(roomId)
    roomsRef
      .update({
        reserved_members: admin.firestore.FieldValue.arrayUnion(screenName),
      })
      .catch()
    const reservedUserRef = firestore
      .collection('reserved_users')
      .doc(screenName.substring(1))

    return reservedUserRef.set(twitterUserData, { merge: true })
  })

/**
 * usersドキュメントの作成を検知して、各ルームの予約メンバーからメンバーに昇格、reserved_usersを削除
 * @params roomId
 */

exports.userCreatedTrigger = functions
  .region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onCreate(async (snap, context) => {
    const twitterId = snap.data().twitter_id
    const uid = snap.data().uid

    const querySnapshot = await firestore
      .collection('reserved_users')
      .where('twitter_id', '==', twitterId)
      .get()

    let twitter: string = ''
    querySnapshot.forEach((doc) => {
      twitter = doc.data().twitter
    })

    if (!twitter) return

    const querySnapshot2 = await firestore
      .collection('rooms')
      .where('reserved_members', 'array-contains', twitter)
      .get()

    querySnapshot2.forEach((doc) => {
      const roomId = doc.data().id
      firestore
        .collection('rooms')
        .doc(roomId)
        .update({
          members: admin.firestore.FieldValue.arrayUnion(uid),
          reserved_members: admin.firestore.FieldValue.arrayRemove(twitter),
        })
        .catch()
    })

    firestore
      .collection('reserved_users')
      .doc(twitter.substring(1))
      .delete()
      .catch()
  })

/**
 * ユーザーに関連するデータを削除します
 * @params
 */

exports.withdrawal = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const uid = context.auth!.uid
    const batch = firestore.batch()

    await deleteRoom()
    await roomArrayRemove('members')
    await roomArrayRemove('mic_assign')
    deleteCollection('users')
    deleteCollection('user_privates')
    batch.commit().catch()

    async function deleteRoom() {
      const querySnapshot = await firestore
        .collection('rooms')
        .where('creater_id', '==', uid)
        .get()

      querySnapshot.forEach((doc) => {
        batch.delete(firestore.collection('rooms').doc(doc.id))
      })
    }

    async function roomArrayRemove(key: string) {
      const querySnapshot = await firestore
        .collection('rooms')
        .where(key, 'array-contains', uid)
        .get()

      querySnapshot.forEach((doc) => {
        batch.update(firestore.collection('rooms').doc(doc.id), {
          [key]: admin.firestore.FieldValue.arrayRemove(uid),
        })
      })
    }

    function deleteCollection(key: string) {
      batch.delete(firestore.collection(key).doc(uid))
    }
  })
