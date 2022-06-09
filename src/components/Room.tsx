import Peer, { SfuRoom } from 'skyway-js'
import React from 'react'
import { UserInfo } from 'utils/user'
import UserIcon, { USER_ICON_WIDTH, USER_ICON_HEIGHT } from './UserIcon'

const KEY = process.env['REACT_APP_SKY_WAY_API_KEY']
const ROOM_WIDTH = 2048
const ROOM_HEIGHT = 2048

export const Room: React.FC<{ roomId: string }> = ({ roomId }) => {
  const peer = React.useRef(new Peer({ key: KEY as string }))
  const [usersInfo, setUsersInfo] = React.useState<UserInfo[]>([])
  // Local
  const [localStream, setLocalStream] = React.useState<MediaStream>()
  const [localUserInfo, setLocalUserInfo] = React.useState<UserInfo>()
  const [room, setRoom] = React.useState<SfuRoom>()
  const localVideoRef = React.useRef<HTMLVideoElement>(null)
  const [isStarted, setIsStarted] = React.useState(false)
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
          localVideoRef.current.play().catch((e) => console.log(e))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])
  const onStart = () => {
    if (peer.current) {
      if (!peer.current.open) {
        return
      }
      if (localStream === undefined) {
        return
      }
      setLocalUserInfo({
        stream: localStream,
        peerId: peer.current.id,
        x: ROOM_WIDTH / 2,
        y: ROOM_HEIGHT / 2,
        deg: 0
      })
      const tmpRoom = peer.current.joinRoom<SfuRoom>(roomId, {
        mode: 'sfu',
        stream: localStream,
      })
      tmpRoom.once('open', () => {
        console.log('=== あなたが参加しました ===\n')
      })
      tmpRoom.on('peerJoin', (peerId) => {
        console.log(`=== ${peerId} が入室しました ===\n`)
      })
      tmpRoom.on('stream', async (stream) => {
        setUsersInfo((prev) => [
          ...prev,
          {
            stream: stream,
            peerId: stream.peerId,
            x: Math.floor(Math.random() * ROOM_WIDTH - USER_ICON_WIDTH),
            y: Math.floor(Math.random() * ROOM_HEIGHT - USER_ICON_HEIGHT),
            deg: Math.floor(Math.random() * 359),
          },
        ])
      })
      tmpRoom.on('peerLeave', (peerId) => {
        setUsersInfo((prev) => {
          return prev.filter((userInfo) => {
            if (userInfo.peerId === peerId) {
              userInfo.stream.getTracks().forEach((track) => track.stop())
            }
            return userInfo.peerId !== peerId
          })
        })
        console.log(`=== ${peerId} が退出しました ===\n`)
      })
      setRoom(tmpRoom)
    }
    setIsStarted((prev) => !prev)
  }
  const onEnd = () => {
    if (room) {
      room.close()
      setUsersInfo((prev) => {
        return prev.filter((userInfo) => {
          userInfo.stream.getTracks().forEach((track) => track.stop())
          return false
        })
      })
    }
    setIsStarted((prev) => !prev)
  }
  const castVideo = () => {
    return usersInfo.map((userInfo) => {
      return <UserIcon info={userInfo} key={userInfo.peerId} />
    })
  }
  return (
    <div>
      <button onClick={() => onStart()} disabled={isStarted}>
        開始
      </button>
      <button onClick={() => onEnd()} disabled={!isStarted}>
        停止
      </button>
      <div className='relative bg-orange-100' style={{width:`${ROOM_WIDTH}px`, height:`${ROOM_HEIGHT}px`}}>
        {localUserInfo ? <UserIcon info={localUserInfo} /> : '' }
        {castVideo()}
      </div>
    </div>
  )
}
