import { createNamespacedHelpers } from 'vuex'
import { listenRoomMessage, postMessage } from '@/service/messageAPI'

export default {
  ...createNamespacedHelpers('message'),

  state() {
    return {
      roomMessage: {},
      unsubscribe: null,
    }
  },

  getters: {
    roomMessage: (state) => state.roomMessage,
  },

  mutations: {
    set_room_message(state, payload) {
      state.roomMessage = payload
    },
    reset_room_message(state) {
      state.roomMessage = {}
    },
    set_unsubscribe(state, payload) {
      state.unsubscribe = payload
    },
  },

  actions: {
    ROOM_MESSAGE_LISTENER({ commit, state }, roomId) {
      if (!state.unsubscribe) {
        commit('reset_room_message')
        const unsubscribe = listenRoomMessage({ commit, roomId })
        commit('set_unsubscribe', unsubscribe)
      }
    },
    END_ROOM_MESSAGE_LISTENER({ commit, state }) {
      if (state.unsubscribe) {
        state.unsubscribe()
        commit('set_unsubscribe', null)
        commit('reset_room_message')
      }
    },
    POST_MESSAGE({ rootState }, { message, roomId }) {
      const { user } = rootState
      postMessage({ message, uid: user.me.uid, roomId })
    },
  },
}
