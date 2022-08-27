import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { audioProcessing } from '../utils/audio'
import UserIcon from './UserIcon'
import { UserInfo } from '../utils/user'

const RemoteUserIcon: Component<{ info: UserInfo }> = (props) => {
  let videoRef: HTMLVideoElement

  createEffect(() => {
    // Audio processing
    audioProcessing(
      {
        stream: props.info.stream,
        peerId: props.info.peerId,
        x: 2048 / 2,
        y: 2048 / 2,
        deg: 0,
      },
      props.info
    )
    // Set stream to video element
    videoRef.srcObject = props.info.stream
    videoRef.play().catch((e) => console.log(e))
  })
  return (
    <UserIcon info={props.info}>
      <video ref={videoRef} playsinline controls />
    </UserIcon>
  )
}

export default RemoteUserIcon
