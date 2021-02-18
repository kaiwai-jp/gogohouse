import { createNamespacedHelpers } from 'vuex'

export default {
  ...createNamespacedHelpers('warp'),
  state() {
    return {}
  },
  actions: {
    PLAY_SILENT_MUSIC({ commit, state }) {},
  },
}
