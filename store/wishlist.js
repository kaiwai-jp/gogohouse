import { createNamespacedHelpers } from 'vuex'
import { listenUserPrivates } from '@/service/wishlistAPI'

export default {
  ...createNamespacedHelpers('wishlist'),
  state() {
    return {
      userPrivates: {},
      unsubscribe: null,
    }
  },

  getters: {
    userPrivates: (state) => state.userPrivates,
  },

  mutations: {
    set_user_privates(state, payload) {
      state.userPrivates = payload
    },
    set_unsubscribe(state, payload) {
      state.unsubscribe = payload
    },
    reset_user_privates(state) {
      state.userPrivates = {}
    },
  },

  actions: {
    USER_PRIVATES_LISTENER({ commit, state, rootState }) {
      const { user } = rootState

      if (!state.unsubscribe) {
        commit('reset_user_privates')
        const unsubscribe = listenUserPrivates({ commit, myUid: user.me.uid })
        commit('set_unsubscribe', unsubscribe)
      }
    },
    END_USER_PRIVATES_LISTENER({ commit, state }) {
      if (state.unsubscribe) {
        state.unsubscribe()
        commit('set_unsubscribe', null)
        commit('reset_user_privates')
      }
    },
  },
}
