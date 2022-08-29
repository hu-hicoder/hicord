import Peer, { SfuRoom } from 'skyway-js'
import type { Component } from 'solid-js'
import { createEffect, createSignal, For } from 'solid-js'
import LocalUserIcon from './LocalUserIcon'
import {
  localUserInfo,
  setLocalUserInfo,
  remoteUserInfos,
  RemoteUserInfo,
  setRemoteUserInfos,
  UserCoordinate,
} from '../utils/user'
import RemoteUserIcon from './RemoteUserIcon'
import { initRemoteAudio, setListener, setPanner } from '../utils/audio'

const KEY = import.meta.env.VITE_SKY_WAY_API_KEY
export const PEER = new Peer({ key: KEY as string })

const ROOM_X = 2048
const ROOM_Y = 2048

export const Room: Component<{ roomId: string }> = (props) => {
  // Local
  const [localStream, setLocalStream] = createSignal<MediaStream>()
  // Room
  const [room, setRoom] = createSignal<SfuRoom>()
  const [isStarted, setIsStarted] = createSignal(false)
  createEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setLocalStream(stream)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const onStart = () => {
    if (PEER && !PEER.open) {
      return
    }
    if (localStream() === undefined) {
      return
    }

    setIsStarted((prev) => !prev)

    setLocalUserInfo({
      stream: localStream(),
      peerId: PEER.id,
      x: ROOM_X / 2,
      y: ROOM_Y / 2,
      deg: 0,
    })
    setListener(localUserInfo())

    const tmpRoom = PEER.joinRoom<SfuRoom>(props.roomId, {
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
      const userInfo = {
        stream: stream,
        peerId: stream.peerId,
        x: ROOM_X / 2,
        y: ROOM_Y / 2,
        deg: 0,
      }
      const audioNodes = initRemoteAudio(userInfo)
      console.log('create remote user info')
      const remoteUserInfo: RemoteUserInfo = {
        ...userInfo,
        ...audioNodes,
      }
      setRemoteUserInfos((prev) => [...prev, remoteUserInfo])
    })
    tmpRoom.on('peerLeave', (peerId) => {
      setRemoteUserInfos((prev) => {
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
    // DataConnection
    PEER.on('connection', (dataConnection) => {
      dataConnection.on('data', (data) => {
        console.log(data)
        const userCoord = data as UserCoordinate
        setRemoteUserInfos((prev) => {
          return prev.map((remoteUserInfo) => {
            if (remoteUserInfo.peerId === dataConnection.remoteId) {
              // Coord
              remoteUserInfo.x = userCoord.x
              remoteUserInfo.y = userCoord.y
              remoteUserInfo.deg = userCoord.deg
              // Panner Node
              setPanner(remoteUserInfo)
            }
            return remoteUserInfo
          })
        })
      })
    })
  }

  const onEnd = () => {
    if (room()) {
      room().close()
      setRemoteUserInfos((prev) => {
        return prev.filter((userInfo) => {
          userInfo.stream.getTracks().forEach((track) => track.stop())
          return false
        })
      })
    }
    setLocalUserInfo()
    setIsStarted((prev) => !prev)
    console.log('=== あなたが退出しました ===\n')
  }

  return (
    <div>
      <div
        class="relative bg-orange-100"
        style={{ height: `${ROOM_X}px`, width: `${ROOM_Y}px` }}
      >
        {/* Remote User Icons */}
        <For each={remoteUserInfos()}>
          {(info) => <RemoteUserIcon info={info} />}
        </For>
        {/* Local User Icon */}
        {localUserInfo() ? <LocalUserIcon /> : null}
        {/* buttons */}
        <div class="sticky left-0 top-0 inline-flex">
          <button
            class="bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-700 disabled:opacity-60 rounded py-2 px-4 m-2"
            onClick={() => onStart()}
            disabled={isStarted()}
          >
            開始
          </button>
          <button
            class="bg-cyan-400 hover:bg-cyan-500 disabled:bg-cyan-700 disabled:opacity-60 rounded py-2 px-4 m-2"
            onClick={() => onEnd()}
            disabled={!isStarted()}
          >
            停止
          </button>
        </div>
      </div>
    </div>
  )
}
