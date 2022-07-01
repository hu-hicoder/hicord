import type { Component } from 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import { audioProcessing } from '../utils/audio'
import { UserInfo } from '../utils/user'
export const USER_ICON_X = 128
export const USER_ICON_Y = 128

const UserIcon: Component<{ info: UserInfo }> = ({ info }) => {
  let videoRef:HTMLVideoElement = null

  createEffect(() => {
      // Audio processing
      audioProcessing({
        stream: info.stream,
        peerId: info.peerId,
        x: 2048 / 2,
        y: 2048 / 2,
        deg: 0
      }, info)
      // Set stream to video element
      videoRef.srcObject = info.stream
      videoRef.play().catch((e) => console.log(e))
  }, [info])
  return (
    <div class='absolute bg-blue-600 top-3 left-5' style={{ clipPath: 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%)', height:`${USER_ICON_X}px`, width:`${USER_ICON_Y}px`, top:`${info.x}px`, left:`${info.y}px`, transform: `rotate(${info.deg}deg)` }}>
      <video ref={videoRef} playsinline controls></video>
    </div>
  )
}

export default UserIcon