import { createNamespacedHelpers } from 'vuex'

export default {
  ...createNamespacedHelpers('warp'),
  state() {
    return {
      alertDialogObject: {},
      leaveroomDialogObject: {},
    }
  },
  getters: {
    alertDialogObject: (state) => state.alertDialogObject,
    leaveroomDialogObject: (state) => state.leaveroomDialogObject,
  },
  mutations: {
    set_alert_dialog_object(state, payload) {
      state.alertDialogObject = payload
    },
    reset_alert_dialog_object(state) {
      state.alertDialogObject = {}
    },
    set_leaveroom_dialog_object(state, payload) {
      state.leaveroomDialogObject = payload
    },
    reset_leaveroom_dialog_object(state) {
      state.leaveroomDialogObject = {}
    },
  },
  actions: {
    PLAY_SILENT_MUSIC({ commit, state }) {},
    PLAY_WEBRTC_SOUND({ commit, state }) {},
    OPEN_ALERT_DIALOG({ commit, state }, message) {
      if (Object.keys(state.alertDialogObject).length > 0) return
      new Promise((resolve) => {
        commit('set_alert_dialog_object', { message, resolve })
      })
    },
    RESOLVE_ALERT_DIALOG({ commit, state }) {
      state.alertDialogObject.resolve()
      commit('reset_alert_dialog_object')
    },
    RESOLVE_LEAVEROOM_DIALOG({ commit, state }) {
      state.leaveroomDialogObject.resolve()
      state.leaveroomDialogObject.next()
      commit('reset_leaveroom_dialog_object')
    },
    REJECT_LEAVEROOM_DIALOG({ commit, state }) {
      state.leaveroomDialogObject.reject()
      state.leaveroomDialogObject.next(false)
      commit('reset_leaveroom_dialog_object')
    },
  },
}
