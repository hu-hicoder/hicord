import type { Component } from 'solid-js'
import { createEffect, onMount } from 'solid-js'
import UserIcon from './UserIcon'
import { RemoteUserInfo, UserInfo } from '../utils/user'

const RemoteUserIcon: Component<{ info: RemoteUserInfo }> = (props) => {
  // let videoRef: HTMLVideoElement
  let audio
  onMount(() => {
    console.log('pannerNode onMount')
    audio = new Audio().srcObject = props.info.stream
    audio.play()
    // Set stream to video element
    // videoRef.srcObject = props.info.stream
    // videoRef.play().catch((e) => console.log(e))
  })

  return (
    <UserIcon info={props.info as UserInfo}>
      <div>fjfdfa</div>
      {/* <video ref={videoRef} playsinline controls /> */}
    </UserIcon>
  )
}

export default RemoteUserIcon
