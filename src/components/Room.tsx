import Peer, { SfuRoom } from 'skyway-js'
import React from 'react'
import { UserData } from 'utils/user'
import UserIcon from './UserIcon'

const KEY = process.env['REACT_APP_SKY_WAY_API_KEY']

export const Room: React.FC<{ roomId: string }> = ({ roomId }) => {
  const peer = React.useRef(new Peer({ key: KEY as string }))
  const [usersData, setUsersData] = React.useState<UserData[]>([])
  const [localStream, setLocalStream] = React.useState<MediaStream>()
  const [room, setRoom] = React.useState<SfuRoom>()
  const localVideoRef = React.useRef<HTMLVideoElement>(null)
  const [isStarted, setIsStarted] = React.useState(false)
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
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
        setUsersData((prev) => [
          ...prev,
          { stream: stream, peerId: stream.peerId },
        ])
      })
      tmpRoom.on('peerLeave', (peerId) => {
        setUsersData((prev) => {
          return prev.filter((userData) => {
            if (userData.peerId === peerId) {
              userData.stream.getTracks().forEach((track) => track.stop())
            }
            return userData.peerId !== peerId
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
      setUsersData((prev) => {
        return prev.filter((userData) => {
          userData.stream.getTracks().forEach((track) => track.stop())
          return false
        })
      })
    }
    setIsStarted((prev) => !prev)
  }
  const castVideo = () => {
    return usersData.map((userData) => {
      return <UserIcon data={userData} key={userData.peerId} />
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
      <video ref={localVideoRef} playsInline controls></video>
      {castVideo()}
    </div>
  )
}
