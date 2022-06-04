import React from 'react'
import {UserData} from 'utils/user'

const UserIcon = (props: { data: UserData }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.data.stream
      videoRef.current.play().catch((e) => console.log(e))
    }
  }, [props.data])
  return <video ref={videoRef} playsInline controls></video>
}

export default UserIcon