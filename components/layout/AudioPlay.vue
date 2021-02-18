<template>
  <div>
    <audio ref="audioEl" autoplay />
    <button @click="clickPlay">play</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  audioContext: any
  output: any
}

export default Vue.extend({
  data(): DataType {
    return {
      audioContext: undefined, // doorの入室ボタンでnewされてdoorで利用される
      output: undefined,
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type == 'webrtc/set_remote_stream') {
        const { connectionId, stream } = mutation.payload
        // @ts-ignore
        const sleep = (waitSeconds, someFunction) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(someFunction(stream))
            }, waitSeconds * 1000)
          })
        }
        // @ts-ignore
        const outputAudio = (stream) => {
          console.log(stream)
          this.audioContext = new AudioContext()

          const sourceNode = this.audioContext.createMediaStreamSource(stream)
          sourceNode.connect(this.audioContext.destination)
          // @ts-ignore
          this.$refs.audioEl.srcObject = this.output.stream
        }
        sleep(5, outputAudio)
        stream.addEventListener('active', () => {
          //  firefoxで発火しない
        })
      }
    })
  },
  methods: {
    clickPlay() {
      this.audioContext = new AudioContext()
      this.output = this.audioContext.createMediaStreamDestination()

      /* キーンと音がします */
      const osc = this.audioContext.createOscillator()
      osc.frequency.value = 13000
      osc.connect(this.output)
      osc.start(0)

      // @ts-ignore
      this.$refs.audioEl.srcObject = this.output.stream
      // @ts-ignore
      this.$refs.audioEl.play()
    },
  },
})
</script>

<style lang="scss"></style>
