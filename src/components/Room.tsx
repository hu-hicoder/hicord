import Peer, { SfuRoom } from 'skyway-js'
import type { Component } from 'solid-js';
import { createEffect, createSignal } from 'solid-js';
import { UserInfo } from '../utils/user'
import UserIcon from './UserIcon'

const KEY = import.meta.env.VITE_SKY_WAY_API_KEY
const ROOM_X = 2048
const ROOM_Y = 2048

export const Room: Component<{ roomId: string }> = ({ roomId }) => {
  // Local user
  let peer = new Peer({ key: KEY as string })
  const [localStream, setLocalStream] = createSignal<MediaStream>()
  const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
  const localVideoRef: HTMLVideoElement = null
  // Remote users
  const [usersInfo, setUsersInfo] = createSignal<UserInfo[]>([])
  // Room
  const [room, setRoom] = createSignal<SfuRoom>()
  const [isStarted, setIsStarted] = createSignal(false)
  createEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setLocalStream(stream)
        // Local video
          localVideoRef.srcObject = stream
          localVideoRef.play().catch((e) => console.log(e))
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])
  const onStart = () => {
    if (peer) {
      if (!peer.open) {
        return
      }
      if (localStream() === undefined) {
        return
      }
      setLocalUserInfo({
        stream: localStream(),
        peerId: peer.id,
        x: ROOM_X / 2,
        y: ROOM_Y / 2,
        deg: 0
      })
      const tmpRoom = peer.joinRoom<SfuRoom>(roomId, {
        mode: 'sfu',
        stream: localStream(),
      })
      tmpRoom.once('open', () => {
        console.log('=== あなたが参加しました ===\n')
      })
      tmpRoom.on('peerJoin', (peerId) => {
        console.log(`=== ${peerId} が入室しました ===\n`)
      })
      tmpRoom.on('stream', async (stream) => {
        const remoteUserInfo = {
          stream: stream,
          peerId: stream.peerId,
          x: Math.floor(Math.random() * 500) + ROOM_X / 2 - 250,
          y: Math.floor(Math.random() * 500) + ROOM_X / 2 - 250,
          deg: Math.floor(Math.random() * 359),
        }
        // if (localUserInfo) {
        //   audioProcessing(localUserInfo, remoteUserInfo)
        // }
        setUsersInfo((prev) => [
          ...prev,
          remoteUserInfo,
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
    if (room()) {
      room().close()
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
    return usersInfo().map((userInfo) => {
      return <UserIcon info={userInfo} />
    })
  }
  return (
    <div>
      <button onClick={() => onStart()} disabled={isStarted()}>
        開始
      </button>
      <button onClick={() => onEnd()} disabled={!isStarted()}>
        停止
      </button>
      <div class='relative bg-orange-100' style={{height:`${ROOM_X}px`, width:`${ROOM_Y}px`}}>
        {localUserInfo() ? '' : '' }
        {/* {localUserInfo ? <UserIcon info={localUserInfo} /> : '' } */}
        {castVideo()}
      </div>
    </div>
  )
}
