import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import UserIcon from './UserIcon'
import { RemoteUserInfo } from '../../utils/user'
import VisualizeAudio from './VisualizeAudio'

const RemoteUserIcon: Component<{ info: RemoteUserInfo }> = (props) => {
  let gainRef: HTMLInputElement
  let videoRef: HTMLVideoElement

  createEffect(() => {
    // TODO: ミュート中は送らないように
    if (props.info.muted) {
      props.info.stream.getAudioTracks().forEach((track) => {
        track.enabled = false
      })
    } else {
      props.info.stream.getAudioTracks().forEach((track) => {
        track.enabled = true
      })
    }
    // Set stream to video element
    videoRef.srcObject = props.info.stream
    videoRef.play().catch((e) => console.log(e))
    videoRef.playsInline = true
    videoRef.muted = true
  })

  function changeGain(e: InputEvent & { currentTarget: HTMLInputElement }) {
    const value = e.currentTarget.value
    props.info.gainNode.gain.value = Number(value)
  }

  return (
    <div>
      <UserIcon
        info={props.info}
        settings={
          <input
            ref={gainRef}
            class="range range-primary range-sm w-30"
            type="range"
            id="volume"
            min="0"
            max="2"
            value="1"
            list="gain-vals"
            step="0.01"
            onInput={changeGain}
          />
        }
      >
        <div class="flex justify-center text-center text-sm absolute w-40 -bottom-10 -right-12">
          <VisualizeAudio analyser={props.info.analyser} />
        </div>
      </UserIcon>
      <video class="hidden" ref={videoRef} />
    </div>
  )
}

export default RemoteUserIcon
