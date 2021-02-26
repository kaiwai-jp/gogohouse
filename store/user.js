import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import {
  twitterSignIn,
  onAuthChanged,
  signOut,
  getUserData,
  listenRoomOnlineUsers,
  registConnectAndWhenDisconnect,
  online,
  unregistDisconnect,
  offline,
  setMicStatus,
} from '@/service/userAPI'

export default {
  ...createNamespacedHelpers('user'),
  unsubscribe: null,
  state() {
    return {
      me: {},
      userDataCache: {},
      roomOnlineUsers: [],
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
  },

  actions: {
    SIGN_IN_TWITTER({ commit, state }) {
      const { me } = state
      if (me && me.uid) {
        offline(me.uid)
      }

      return new Promise((resolve, reject) => {
        twitterSignIn()
          .then((myData) => {
            commit('set_user_data_cache', { uid: myData.uid, data: myData })
            commit('set_user', myData)
            resolve(myData.uid)
          })
          .catch((err) => reject(err))
      })
    },
    GET_USER({ commit, state }) {
      if (Object.keys(state.me).length > 0) return
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
    ROOM_ONLINE_USERS_LISTENER({ commit }, roomId) {
      if (!this.unsubscribe) {
        commit('reset_room_online_users')
        this.unsubscribe = listenRoomOnlineUsers({ commit, roomId })
      }
    },
    END_ROOM_ONLINE_USERS_LISTENER({ commit }) {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
        commit('reset_room_online_users')
      }
    },
    REGIST_CONNECT_AND_WHEN_DISCONNECT({ rootState }, roomId) {
      const { user } = rootState
      registConnectAndWhenDisconnect(roomId, user.me.uid)
      online(user.me.uid)
    },
    UNREGIST_DISCONNECT_AND_OFFLINE({ rootState }) {
      const { user } = rootState
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
  },
}
