<template>
  <div>
    <h2 class="subtitle mt-50">メンバー</h2>
    <div v-for="uid in room.members" :key="uid">
      <NamePlateMini :uid="uid" class="twitter_identity" />
      <button
        v-if="uid != me.uid"
        @click="clickReleaseMember(uid)"
        class="button--mini"
      >
        解除
      </button>
      <button
        v-if="uid != me.uid"
        @click="clickMicAssign(uid)"
        class="button--mini"
      >
        MIC
      </button>
    </div>

    <h2 class="subtitle mt-50">仮メンバー</h2>
    <div v-for="screenName in room.reserved_members" :key="screenName">
      <ReservedMemberNamePlateMini
        :screenName="screenName"
        class="twitter_identity"
      />
      <button
        @click="clickReleaseReservedMember(screenName)"
        class="button--mini"
      >
        解除
      </button>
    </div>

    <h2 class="subtitle mt-50">メンバー追加</h2>
    <div>
      <input
        class="room-name"
        v-model="addTwitter"
        placeholder="@Twitterアカウント"
      />
      <button @click="clickAddMemberByTwitter" class="button--mini">
        追加
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NamePlateMini from '@/components/NamePlateMini.vue'
import ReservedMemberNamePlateMini from '@/components/ReservedMemberNamePlateMini.vue'

import userMapper from '@/store/user'
import roomMapper from '@/store/room'
import {
  addMember,
  releaseMember,
  releaseReservedMember,
  addMemberByTwitter,
  micAssign,
  releaseMicAssign,
} from '@/service/roomAPI'

export type DataType = {
  addTwitter: String
}

export default Vue.extend({
  components: { NamePlateMini, ReservedMemberNamePlateMini },
  props: {
    roomId: { default: '', type: String },
  },
  data(): DataType {
    return {
      addTwitter: '',
    }
  },
  computed: {
    ...roomMapper.mapGetters(['room']),
    ...userMapper.mapGetters(['me']),
  },
  methods: {
    clickAddMember(uid: String) {
      addMember(this.roomId, uid)
    },
    clickReleaseMember(uid: String) {
      releaseMember(this.roomId, uid)
    },
    clickReleaseReservedMember(uid: String) {
      releaseReservedMember(this.roomId, uid)
    },
    clickAddMemberByTwitter() {
      const screenName = this.addTwitter.trim()
      if (!screenName.match(/@[0-9a-zA-Z_]{1,15}/)) {
        alert('@で始まるTwitterアカウントを入力してください')
        return
      }
      addMemberByTwitter(this.roomId, screenName)
        .then(() => {
          this.addTwitter = ''
        })
        .catch(() => {
          alert('Twitterユーザーが見つかりませんでした')
        })
    },
    clickMicAssign(uid: String) {
      micAssign(this.roomId, uid)
    },
    clickReleaseMicAssign(uid: String) {
      releaseMicAssign(this.roomId, uid)
    },
  },
})
</script>

<style lang="scss" scoped>
.twitter_identity {
  display: inline-block;
}

.room-name {
  color: $color3;
  height: 27px;
  margin-right: 10px;
}
</style>
