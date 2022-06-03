import Peer, { SfuRoom } from 'skyway-js'
import React from 'react'

const KEY = process.env['REACT_APP_SKY_WAY_API_KEY']

type VideoStream = {
  stream: MediaStream
  peerId: string
}

export const Room: React.FC<{ roomId: string }> = ({ roomId }) => {
  const peer = React.useRef(new Peer({ key: KEY as string }))
  const [remoteVideo, setRemoteVideo] = React.useState<VideoStream[]>([])
  const [localStream, setLocalStream] = React.useState<MediaStream>()
  const [room, setRoom] = React.useState<SfuRoom>()
  const localVideoRef = React.useRef<HTMLVideoElement>(null)
  const [isStarted, setIsStarted] = React.useState(false)
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
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
        setRemoteVideo((prev) => [
          ...prev,
          { stream: stream, peerId: stream.peerId },
        ])
      })
      tmpRoom.on('peerLeave', (peerId) => {
        setRemoteVideo((prev) => {
          return prev.filter((video) => {
            if (video.peerId === peerId) {
              video.stream.getTracks().forEach((track) => track.stop())
            }
            return video.peerId !== peerId
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
      setRemoteVideo((prev) => {
        return prev.filter((video) => {
          video.stream.getTracks().forEach((track) => track.stop())
          return false
        })
      })
    }
    setIsStarted((prev) => !prev)
  }
  const castVideo = () => {
    return remoteVideo.map((video) => {
      return <RemoteVideo video={video} key={video.peerId} />
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
      <video ref={localVideoRef} playsInline></video>
      {castVideo()}
    </div>
  )
}

const RemoteVideo = (props: { video: VideoStream }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.video.stream
      videoRef.current.play().catch((e) => console.log(e))
    }
  }, [props.video])
  return <video ref={videoRef} playsInline></video>
}
