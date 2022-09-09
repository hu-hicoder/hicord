import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import UserIcon from './UserIcon'
import { RemoteUserInfo } from '../../utils/user'

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
      <UserIcon info={props.info} />
      <input
        ref={gainRef}
        type="range"
        id="volume"
        min="0"
        max="2"
        value="1"
        list="gain-vals"
        step="0.01"
        onInput={changeGain}
      />
      <video class="hidden" ref={videoRef} />
    </div>
  )
}

export default RemoteUserIcon
