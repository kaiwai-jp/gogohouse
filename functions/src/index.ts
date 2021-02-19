import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const firestore = admin.firestore()

/**
 * Realtime Databaseを監視して、オンラインステータスの変更を検知、更新します.
 */
exports.onUserStatusChanged = functions
  .region('asia-northeast1')
  .database.ref('/status/{uid}')
  .onUpdate((change, context) => {
    const eventStatus = change.after.val()

    const beforeStatus = change.before.val()
    console.log(beforeStatus, eventStatus)

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
    const roomsRef = firestore.collection('rooms').doc(data.roomId)
    await roomsRef.get().then((doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'floor no found')
      }

      if (doc.data()!.room_type !== 'open') {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'this room is not open'
        )
      }
    })
    /*
    const roomsBansRef = firestore
      .collection('room_privates')
      .doc(data.roomId)
    await roomsBansRef.get().then((doc) => {
      if (doc.exists) {
        // TODO
        throw new functions.https.HttpsError(
          'unauthenticated',
          `${context.auth!.uid} is banned`
        )
      }
    })
*/
    // 入室処理
    return await firestore.collection('users').doc(context.auth!.uid).update({
      current_room: data.roomId,
    })
  })

/**
 * クローズドルームに入室するための処理を行います(open).
 * @params roomId
 */
exports.enterClosedRoom = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const uid = context.auth!.uid
    const roomsRef = firestore.collection('rooms').doc(data.roomId)
    await roomsRef.get().then((doc) => {
      if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'floor no found')
      }

      if (doc.data()!.room_type !== 'closed') {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'this room is not closed'
        )
      }

      if (!doc.data()!.members.includes(uid)) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'you are not member'
        )
      }
    })
    /*
    const roomsBansRef = firestore
      .collection('room_privates')
      .doc(data.roomId)
    await roomsBansRef.get().then((doc) => {
      if (doc.exists) {
        // TODO
        throw new functions.https.HttpsError(
          'unauthenticated',
          `${context.auth!.uid} is banned`
        )
      }
    })
*/
    // 入室処理
    return await firestore.collection('users').doc(context.auth!.uid).update({
      current_room: data.roomId,
    })
  })

/* 一定時間経過したconnectionsドキュメントを削除しまし */
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
          console.log(doc.id, '=>', (systemTime - dt) / 1000 + '秒前')

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
