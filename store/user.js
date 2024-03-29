import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import {
  twitterSignIn,
  getRedirectResult,
  onAuthChanged,
  signOut,
  getMydata,
  getUserData,
  listenRoomOnlineUsers,
  registConnectAndWhenDisconnect,
  online,
  unregistDisconnect,
  offline,
  setMicStatus,
  resetSignal,
} from '@/service/userAPI'

export default {
  ...createNamespacedHelpers('user'),
  state() {
    return {
      me: {},
      userDataCache: {},
      roomOnlineUsers: [],
      unsubscribe: null,
    }
  },

  getters: {
    me: (state) => state.me, //  1回ずつgetされるだけ
    isSignin: (state) => state.me && state.me.uid !== undefined,
    getUserData: (state) => (uid) => {
      if (state.userDataCache[uid]) {
        return state.userDataCache[uid].userData
      } else {
        return {}
      }
    },
    getUserName: (state) => (uid) => {
      if (state.userDataCache[uid]) {
        return state.userDataCache[uid].userData.name
      } else {
        return ''
      }
    },
    getUserIcon: (state) => (uid) => {
      if (state.userDataCache[uid]) {
        return state.userDataCache[uid].userData.icon
      } else {
        return ''
      }
    },
    roomOnlineUsers: (state) => state.roomOnlineUsers, // リアルタイムリスナー
    myData: (state) => {
      let userData = {}
      for (let i = 0; i < state.roomOnlineUsers.length; i++) {
        if (state.roomOnlineUsers[i].uid === state.me.uid) {
          userData = state.roomOnlineUsers[i]
        }
      }
      return userData
    },
    roomRemoteUsers: (state) => {
      let users = state.roomOnlineUsers.slice()
      for (let i = 0; i < state.roomOnlineUsers.length; i++) {
        if (state.roomOnlineUsers[i].uid === state.me.uid) {
          users.splice(i, 1)
        }
      }
      return users
    },
  },

  mutations: {
    set_user(state, payload) {
      state.me = payload
    },
    set_user_data_cache(state, userData) {
      const { uid, data } = userData
      Vue.set(state.userDataCache, uid, {
        userData: data,
        cached_time: new Date(),
      })
    },
    add_room_online_users(state, userData) {
      state.roomOnlineUsers.push(userData)
    },
    modify_room_online_users(state, userData) {
      for (let i = 0; i < state.roomOnlineUsers.length; i++) {
        if (state.roomOnlineUsers[i].uid == userData.uid) {
          state.roomOnlineUsers.splice(i, 1, userData)
          return
        }
      }
    },
    remove_room_online_users(state, userData) {
      if (userData.uid === state.me.uid) location.reload() // 追い出す
      for (let i = 0; i < state.roomOnlineUsers.length; i++) {
        if (state.roomOnlineUsers[i].uid == userData.uid) {
          state.roomOnlineUsers.splice(i, 1)
          return
        }
      }
    },
    reset_room_online_users(state) {
      state.roomOnlineUsers.splice(-state.roomOnlineUsers.length)
    },
    set_unsubscribe(state, payload) {
      state.unsubscribe = payload
    },
  },

  actions: {
    GET_REDIRECT_RESULT({ commit }) {
      return new Promise((resolve, reject) => {
        getRedirectResult()
          .then((myData) => {
            commit('set_user_data_cache', { uid: myData.uid, data: myData })
            commit('set_user', myData)
            resolve(myData.uid)
          })
          .catch((err) => reject(err))
      })
    },
    SIGN_IN_TWITTER({ state }) {
      const { me } = state
      if (me && me.uid) {
        offline(me.uid)
      }
      twitterSignIn()
    },
    GET_USER({ commit, state }, force) {
      if (!force && Object.keys(state.me).length > 0) return
      return new Promise((resolve, reject) => {
        onAuthChanged().then((userInfo) => {
          commit('set_user', userInfo)
          resolve(userInfo)
        })
      })
    },
    async SIGN_OUT({ commit, state }) {
      const { me } = state
      if (me.uid) {
        offline(me.uid)
      }
      await signOut()
      commit('set_user', {})
    },

    /* 必ずuserAPIのgetUserDataを呼ぶ前に呼ぶ */
    REF_USER_DATA({ commit, state }, payload) {
      const { uid } = payload
      if (!uid) return

      let span = 0
      let refresh_flag = false
      if (state.userDataCache[uid]) {
        span = new Date() - state.userDataCache[uid].cache_time
        refresh_flag = true
      }
      if (!state.userDataCache[uid] || span > 86400 * 1000) {
        getUserData({
          ...payload,
          force: refresh_flag,
        })
          .then((data) =>
            commit('set_user_data_cache', {
              uid,
              data,
            })
          )
          .catch((err) =>
            commit('set_user_data_cache', {
              uid,
              data: {},
            })
          )
      }
    },
    ROOM_ONLINE_USERS_LISTENER({ commit, state }, roomId) {
      if (!state.unsubscribe) {
        commit('reset_room_online_users')
        const unsubscribe = listenRoomOnlineUsers({ commit, roomId })
        commit('set_unsubscribe', unsubscribe)
      }
    },
    END_ROOM_ONLINE_USERS_LISTENER({ commit, state }) {
      if (state.unsubscribe) {
        state.unsubscribe()
        commit('set_unsubscribe', null)
        commit('reset_room_online_users')
      }
    },
    REGIST_CONNECT_AND_WHEN_DISCONNECT({ rootState }, roomId) {
      const { user } = rootState
      resetSignal(user.me.uid)
      registConnectAndWhenDisconnect(roomId, user.me.uid)
      online(user.me.uid)
    },
    UNREGIST_DISCONNECT_AND_OFFLINE({ rootState }) {
      const { user } = rootState
      resetSignal(user.me.uid)
      unregistDisconnect(user.me.uid)
      offline(user.me.uid)
    },
    SET_MIC_MUTE({ rootState }) {
      const { user } = rootState
      setMicStatus(user.me.uid, 'mute')
    },
    SET_MIC_ON({ rootState }) {
      const { user } = rootState
      setMicStatus(user.me.uid, 'on')
    },
    SET_MIC_OFF({ rootState }) {
      const { user } = rootState
      setMicStatus(user.me.uid, 'off')
    },
    async SET_MY_DATA({ rootState, commit }) {
      const { user } = rootState
      const payload = await getMydata(user.me.uid)
      commit('set_user', payload)
    },
  },
}
