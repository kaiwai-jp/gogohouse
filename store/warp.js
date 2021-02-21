import { createNamespacedHelpers } from 'vuex'

export default {
  ...createNamespacedHelpers('warp'),
  state() {
    return {
      alertDialogObject: {},
    }
  },
  getters: {
    alertDialogObject: (state) => state.alertDialogObject,
  },
  mutations: {
    set_alert_dialog_object(state, payload) {
      state.alertDialogObject = payload
    },
    reset_alert_dialog_object(state) {
      state.alertDialogObject = {}
    },
  },
  actions: {
    PLAY_SILENT_MUSIC({ commit, state }) {},
    RESOLVE_ALERT_DIALOG({ commit, state }) {
      state.alertDialogObject.resolve()
      commit('reset_alert_dialog_object')
    },
    OPEN_ALERT_DIALOG({ commit, state }, message) {
      if (Object.keys(state.alertDialogObject).length > 0) return
      new Promise((resolve) => {
        commit('set_alert_dialog_object', { message, resolve })
      })
    },
  },
}
