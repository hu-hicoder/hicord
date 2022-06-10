import React from 'react'
import {UserInfo} from 'utils/user'
import { audioProcessing } from 'utils/audio'
export const USER_ICON_X = 128
export const USER_ICON_Y = 128

const UserIcon = (props: { info: UserInfo }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (videoRef.current) {
      // Audio processing
      audioProcessing({
        stream: props.info.stream,
        peerId: props.info.peerId,
        x: 2048 / 2,
        y: 2048 / 2,
        deg: 0
      }, props.info)
      // Set stream to video element
      videoRef.current.srcObject = props.info.stream
      videoRef.current.play().catch((e) => console.log(e))
    }
  }, [props.info])
  return (
    <div className='absolute bg-blue-600 top-3 left-5' style={{ clipPath: 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%)', height:`${USER_ICON_X}px`, width:`${USER_ICON_Y}px`, top:`${props.info.x}px`, left:`${props.info.y}px`, transform: `rotate(${props.info.deg}deg)` }}>
      <video ref={videoRef} playsInline controls></video>
    </div>
  )
}

export default UserIcon