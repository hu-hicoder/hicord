/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { muteOtherTalkBox } from '../../utils/audio'
import { talkBoxIdFromUser } from '../../utils/boxes/talk'
import { RemoteUserInfo, setRemoteUserInfo } from '../../utils/user'
import UserIcon from './UserIcon'
import VisualizedAudio from './VisualizedAudio'

const RemoteUserIcon: Component<{ info: RemoteUserInfo }> = (props) => {
  let gainRef: HTMLInputElement | undefined
  let videoRef: HTMLVideoElement | undefined

  createEffect(() => {
    // Set stream to video element
    videoRef!.srcObject = props.info.stream
    videoRef!.play().catch((e) => console.log(e))
    videoRef!.playsInline = true
    videoRef!.muted = true
  })

  function changeGain(e: InputEvent & { currentTarget: HTMLInputElement }) {
    const value = e.currentTarget.value
    props.info.gainNode.gain.value = Number(value)
  }

  // current talk box
  createEffect(() => {
    const talkBoxId = talkBoxIdFromUser(props.info.x, props.info.y)
    if (props.info.talkBoxId !== talkBoxId) {
      setRemoteUserInfo({
        ...props.info,
        talkBoxId: talkBoxId,
      })
      muteOtherTalkBox()
    }
  })

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
          <VisualizedAudio analyser={props.info.analyser} />
        </div>
      </UserIcon>
      <video class="hidden" ref={videoRef} />
    </div>
  )
}

export default RemoteUserIcon
