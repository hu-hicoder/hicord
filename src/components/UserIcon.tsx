import React from 'react'
import {UserInfo} from 'utils/user'

export const USER_ICON_WIDTH = 128
export const USER_ICON_HEIGHT = 128

const UserIcon = (props: { info: UserInfo }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.info.stream
      videoRef.current.play().catch((e) => console.log(e))
    }
  }, [props.info])
  return (
    <div className='absolute bg-blue-600 top-3 left-5' style={{ clipPath: 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%)', width:`${USER_ICON_WIDTH}px`, height:`${USER_ICON_HEIGHT}px`, top:`${props.info.y}px`, left:`${props.info.x}px`, transform: `rotate(${props.info.deg}deg)` }}>
      <video ref={videoRef} playsInline controls></video>
    </div>
  )
}

export default UserIcon