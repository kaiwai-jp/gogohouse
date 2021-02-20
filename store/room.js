import { createNamespacedHelpers } from 'vuex'
import {
  createRoom,
  getRoom,
  listenMyRoomList,
  listenMemberRoomList,
  listenRoom,
} from '@/service/roomAPI'

export default {
  ...createNamespacedHelpers('room'),
  myRoomListUnsubscribe: null,
  memberRoomUnsubscribe: null,
  roomUnsubscribe: null,
  state() {
    return {
      room: {},
      myRoomList: [],
      memberRoomList: [],
    }
  },

  getters: {
    room: (state) => state.room,
    myRoomList: (state) => state.myRoomList,
    memberRoomList: (state) => state.memberRoomList,
  },
  mutations: {
    set_room(state, payload) {
      state.room = payload
    },
    reset_room(state) {
      state.room = {}
    },
    add_my_room_list(state, room) {
      state.myRoomList.push(room)
    },
    modify_my_room_list(state, room) {
      for (let i = 0; i < state.myRoomList.length; i++) {
        if (state.myRoomList[i] === room.id) {
          state.myRoomList.splice(i, 1, room)
        }
      }
    },
    remove_my_room_list(state, room) {
      state.myRoomList.delete(room.id)
    },
    reset_my_room_list(state) {
      state.myRoomList.splice(-state.myRoomList.length)
    },
    add_member_room_list(state, room) {
      state.memberRoomList.push(room)
    },
    modify_member_room_list(state, room) {
      for (let i = 0; i < state.memberRoomList.length; i++) {
        if (state.memberRoomList[i] === room.id) {
          state.memberRoomList.splice(i, 1, room)
        }
      }
    },
    remove_member_room_list(state, room) {
      state.memberRoomList.delete(room.id)
    },
    reset_member_room_list(state) {
      state.memberRoomList.splice(-state.memberRoomList.length)
    },
  },
  actions: {
    async CREATE_ROOM({ commit, rootState }, payload) {
      const { user } = rootState
      const { name, room_type } = payload

      const roomInfo = {
        name,
        creater_id: user.me.uid,
        owner_id: user.me.uid,
        members: [user.me.uid],
        room_type: room_type,
      }
      const roomId = await createRoom(roomInfo)
      return roomId
    },
    async GET_ROOM({ commit, state }, roomId) {
      const roomInfo = await getRoom(roomId)
      commit('set_room', roomInfo)
    },
    MY_ROOM_LIST_LISTENER({ commit, rootState }) {
      const { user } = rootState

      if (!this.myRoomListUnsubscribe) {
        commit('reset_my_room_list')
        this.myRoomListUnsubscribe = listenMyRoomList(commit, user.me.uid)
      }
    },
    END_MY_ROOM_LIST_LISTENER({ commit, state }) {
      if (this.myRoomListUnsubscribe) {
        this.myRoomListUnsubscribe()
        this.myRoomListUnsubscribe = null
        commit('reset_my_room_list')
      }
    },
    MEMBER_ROOM_LIST_LISTENER({ commit, rootState }) {
      const { user } = rootState

      if (!this.memberRoomUnsubscribe) {
        commit('reset_member_room_list')
        this.memberRoomUnsubscribe = listenMemberRoomList(commit, user.me.uid)
      }
    },
    END_MEMBER_ROOM_LIST_LISTENER({ commit, state }) {
      if (this.memberRoomUnsubscribe) {
        this.memberRoomUnsubscribe()
        this.memberRoomUnsubscribe = null
        commit('reset_member_room_list')
      }
    },
    ROOM_LISTENER({ commit }, roomId) {
      if (!this.roomUnsubscribe) {
        commit('reset_room')
        this.roomUnsubscribe = listenRoom(commit, roomId)
      }
    },
    END_ROOM_LISTENER({ commit }) {
      if (this.roomUnsubscribe) {
        this.roomUnsubscribe()
        this.roomUnsubscribe = null
        commit('reset_room')
      }
    },
  },
}
