import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import {
  offer,
  offered,
  listenConnectionOffered,
  clearOfferedDB,
} from '@/service/webrtcAPI'

export default {
  ...createNamespacedHelpers('webrtc'),
  state() {
    return {
      remoteStreamObj: {}, // connectionsId: remoteStream
      peerConnectionObj: {}, // connectionsId: peerConnection
      peerConnectionState: {}, // connectionsId: stateString
      localUserToConnId: {}, // localStreamの対応表 userId:connectionsId
      remoteUserToConnId: {}, //  remoteStreamの対応表 userId:connectionsId
      iceUnsubscribe: {}, // ice Candidateリスナーの解除用 connectionsId:unsubscribe
      unsubscribe: [], // offeredを終了するときに解除すべきunsubscribeの配列
      errReport: [], //  catchしたerr
      iceQueue: {}, // stableになるのを待つice candidate connectionId:[candidate,]
    }
  },

  getters: {
    remoteStreamObj: (state) => state.remoteStreamObj,
    peerConnectionObj: (state) => state.peerConnectionObj,
    userPeerConnectionState: (state) => {
      // uid: {'inbound'|'outbound', stateString}
      let retObject = {}

      for (let uid in state.localUserToConnId) {
        const connectionId = state.localUserToConnId[uid]
        const stateString = state.peerConnectionState[connectionId]
        if (!retObject[uid]) retObject[uid] = {}
        retObject[uid]['outbound'] = stateString
      }
      for (let uid in state.remoteUserToConnId) {
        const connectionId = state.remoteUserToConnId[uid]
        const stateString = state.peerConnectionState[connectionId]
        if (!retObject[uid]) retObject[uid] = {}
        retObject[uid]['inbound'] = stateString
      }
      return retObject
    },
    errReport: (state) => state.errReport,
  },

  mutations: {
    set_unsubscribe(state, unsubscribe) {
      state.unsubscribe.push(unsubscribe)
    },
    reset_unsubscribe(state) {
      state.unsubscribe.splice(-state.unsubscribe)
    },
    set_remote_stream(state, { connectionId, stream }) {
      Vue.set(state.remoteStreamObj, connectionId, stream)
    },
    remove_remote_stream(state, connectionId) {
      Vue.delete(state.remoteStreamObj, connectionId)
    },
    reset_remote_stream(state) {
      Object.keys(state.remoteStreamObj).forEach((key) => {
        Vue.delete(state.remoteStreamObj, key)
      })
    },
    set_ice_unsubscribe(state, { connectionId, iceUnsubscribe }) {
      Vue.set(state.iceUnsubscribe, connectionId, iceUnsubscribe)
    },
    remove_ice_unsubscribe(state, connectionId) {
      Vue.delete(state.iceUnsubscribe, connectionId)
    },
    set_local_user_to_conn_id(state, { uid, connectionId }) {
      Vue.set(state.localUserToConnId, uid, connectionId)
    },
    remove_local_user_to_conn_id(state, uid) {
      Vue.delete(state.localUserToConnId, uid)
    },
    set_remote_user_to_conn_id(state, { uid, connectionId }) {
      Vue.set(state.remoteUserToConnId, uid, connectionId)
    },
    remove_remote_user_to_conn_id(state, uid) {
      Vue.delete(state.remoteUserToConnId, uid)
    },
    set_peerconnection_obj(state, { connectionId, peerConnection }) {
      Vue.set(state.peerConnectionObj, connectionId, peerConnection)
    },
    remove_peerconnection_obj(state, connectionId) {
      Vue.delete(state.peerConnectionObj, connectionId)
    },
    set_peerconnection_state(state, { connectionId, stateString }) {
      Vue.set(state.peerConnectionState, connectionId, stateString)
    },
    remove_peerconnection_state(state, connectionId) {
      Vue.delete(state.peerConnectionState, connectionId)
    },
    set_err_report(state, err) {
      const now = new Date()
      const month = now.getMonth() + 1
      const date = now.getDate()
      const hour = getdoubleDigestNumer(now.getHours())
      const min = getdoubleDigestNumer(now.getMinutes())
      const sec = getdoubleDigestNumer(now.getSeconds())
      const nowString = month + '/' + date + ' ' + hour + ':' + min + ':' + sec

      state.errReport.push(nowString + ' ' + err.toString())

      function getdoubleDigestNumer(number) {
        return ('0' + number).slice(-2)
      }
    },
    reset_err_report(state) {
      state.errReport.splice(-state.errReport)
    },
    push_ice_candidate(state, { connectionId, candidate }) {
      if (!state.iceQueue[connectionId]) {
        state.iceQueue[connectionId] = []
      }
      state.iceQueue[connectionId].push(candidate)
    },
    pop_ice_candidate(state, { connectionId, index }) {
      state.iceQueue[connectionId].splice(index, 1)
    },
    reset_ice_candidate(state, connectionId) {
      delete state.iceQueue[connectionId]
    },
  },

  actions: {
    OFFER({ dispatch, commit, rootState }, { uid, localStream }) {
      const { user } = rootState
      offer(dispatch, commit, user.me.uid, uid, localStream)
    },
    OFFERED({ dispatch, commit }, { uid, connectionId }) {
      offered(dispatch, commit, uid, connectionId)
    },
    STATE_CHANGE({ commit }, { connectionId, stateString }) {
      commit('set_peerconnection_state', { connectionId, stateString })
    },
    CONNECTION_OFFERED_LISTENER({ dispatch, commit, rootState }) {
      const { user } = rootState

      const unsubscribe = listenConnectionOffered(dispatch, user.me.uid)
      commit('set_unsubscribe', unsubscribe)
    },
    END_CONNECTION_OFFERED_LISTENER({ commit, state }) {
      for (let i = 0; i < state.unsubscribe.length; i++) {
        if (typeof state.unsubscribe[i] === 'function') {
          state.unsubscribe[i]()
        }
        commit('reset_unsubscribe')
      }
    },
    ICE_UNSUBSCRIBE({ commit, state }, peerConnection) {
      let connectionId = null
      for (let key of Object.keys(state.peerConnectionObj)) {
        if (state.peerConnectionObj[key] == peerConnection) {
          connectionId = key
        }
      }
      if (connectionId === null) return

      if (typeof state.iceUnsubscribe[connectionId] === 'function') {
        state.iceUnsubscribe[connectionId]()
      }
      commit('remove_ice_unsubscribe', connectionId)
    },
    CONNECTION_FINISH({ commit, state }, connectionId) {
      /* リモートストリームの時はストリームを閉じてオブジェクトを削除 */
      if (state.remoteStreamObj[connectionId]) {
        state.remoteStreamObj[connectionId]
          .getTracks()
          .forEach((track) => track.stop())
        commit('remove_remote_stream', connectionId)
        for (let userId of Object.keys(state.remoteUserToConnId)) {
          if (state.remoteUserToConnId[userId] === connectionId) {
            commit('remove_remote_user_to_conn_id', userId)
          }
        }
        state.peerConnectionObj[connectionId].close()
        commit('reset_ice_candidate', connectionId)
        commit('remove_peerconnection_obj', connectionId)
        commit('remove_peerconnection_state', connectionId)
        /* ローカルストリームの時はオブジェクトを削除 */
      } else {
        for (let userId of Object.keys(state.localUserToConnId)) {
          if (state.localUserToConnId[userId] === connectionId) {
            commit('remove_local_user_to_conn_id', userId)
          }
        }
        state.peerConnectionObj[connectionId].close()
        commit('reset_ice_candidate', connectionId)
        commit('remove_peerconnection_obj', connectionId)
        commit('remove_peerconnection_state', connectionId)
      }
    },
    CONNECTION_FINISH_WITH_PEERCONNECTION({ dispatch, state }, peerConnection) {
      for (let connectionId of Object.keys(state.peerConnectionObj)) {
        if (state.peerConnectionObj[connectionId] == peerConnection) {
          dispatch('CONNECTION_FINISH', connectionId)
          return
        }
      }
    },
    CONNECTION_FINISH_WITH_UID({ dispatch, state }, partnerUid) {
      for (let userId of Object.keys(state.localUserToConnId)) {
        if (userId === partnerUid) {
          dispatch('CONNECTION_FINISH', state.localUserToConnId[userId])
          return
        }
      }
      for (let userId of Object.keys(state.remoteUserToConnId)) {
        if (userId === partnerUid) {
          dispatch('CONNECTION_FINISH', state.remoteUserToConnId[userId])
          return
        }
      }
    },
    CONNECTION_FINISH_ALL({ dispatch, commit, state }) {
      for (let connectionId of Object.keys(state.peerConnectionObj)) {
        dispatch('CONNECTION_FINISH', connectionId)
      }
      for (let connectionId of Object.keys(state.iceUnsubscribe)) {
        if (typeof state.iceUnsubscribe[connectionId] === 'function') {
          state.iceUnsubscribe[connectionId]()
          commit('remove_ice_unsubscribe', connectionId)
        }
      }
    },
    CONNECTION_END_FROM_ME({ dispatch, state }) {
      /* こちらからオファーしたコネクションを終了する */
      for (let key of Object.keys(state.peerConnectionObj)) {
        if (!state.remoteStreamObj[key]) {
          //offerEnd(key)
          dispatch('CONNECTION_FINISH', key)
        }
      }
    },
    CLEAR_OFFERED_DB({ rootState }) {
      const { user } = rootState
      clearOfferedDB(user.me.uid)
    },
    ICE_CANDIDATE({ commit, state }, { connectionId, peerConnection }) {
      if (!state.iceQueue[connectionId]) return
      const candidateArray = state.iceQueue[connectionId]
      for (let i = 0; i < candidateArray.length; i++) {
        peerConnection
          .addIceCandidate(candidateArray[i])
          .catch((err) => commit('set_err_report', err))
        commit('pop_ice_candidate', { connectionId, index: i })
      }
    },
  },
}
