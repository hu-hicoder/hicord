import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import UserIcon from './UserIcon'
import { RemoteUserInfo, UserInfo } from '../utils/user'

const RemoteUserIcon: Component<{ info: RemoteUserInfo }> = (props) => {
  let gainRef: HTMLInputElement
  let videoRef: HTMLVideoElement
  createEffect(() => {
    console.log('pannerNode onMount')
    // Set stream to video element
    videoRef.srcObject = props.info.stream
    videoRef.play().catch((e) => console.log(e))
    videoRef.muted = true
  })

  function changeGain(e: InputEvent & { currentTarget: HTMLInputElement }) {
    const value = e.currentTarget.value
    props.info.gainNode.gain.value = Number(value)
  }

  return (
    <UserIcon info={props.info as UserInfo}>
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
      <video ref={videoRef} controls />
    </UserIcon>
  )
}

export default RemoteUserIcon
