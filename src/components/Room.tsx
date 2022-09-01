import Peer, { SfuRoom } from 'skyway-js'
import type { Component } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import LocalUserIcon from './LocalUserIcon'
import {
  localUserInfo,
  setLocalUserInfo,
  remoteUserInfos,
  RemoteUserInfo,
  setRemoteUserInfos,
} from '../utils/user'
import RemoteUserIcon from './RemoteUserIcon'
import ChatToolbar from './ChatToolbar'
import MainToolbar from './MainToolbar'
import UserToolbar from './UserToolbar'
import { initRemoteAudio, setListener } from '../utils/audio'
import {
  sendLocalUserNameTo,
  sendLocalUserNameToAll,
} from '../utils/sendLocalUserName'
import { sendLocalUserAvatarTo } from '../utils/sendLocalUserAvatar'
import { sendLocalUserCoordinateToAll } from '../utils/sendLocalUserCoordinate'
import { setPeerOnConnection } from '../utils/setPeerOnConnection'

const KEY = import.meta.env.VITE_SKY_WAY_API_KEY
export const PEER = new Peer({ key: KEY as string })

const ROOM_X = 4096
const ROOM_Y = 4096

export const Room: Component<{ roomId: string }> = (props) => {
  let localUserNameElement: HTMLInputElement
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
      userName: localUserNameElement.value,
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
      sendLocalUserNameTo(peerId)
      sendLocalUserAvatarTo(peerId)
    })
    tmpRoom.on('stream', async (stream) => {
      const userInfo = {
        stream: stream,
        peerId: stream.peerId,
        x: ROOM_X / 2,
        y: ROOM_Y / 2,
        deg: 0,
        userName: 'No Name', // TODO:
      }
      const audioNodes = initRemoteAudio(userInfo)
      console.log('create remote user info')
      const remoteUserInfo: RemoteUserInfo = {
        ...userInfo,
        ...audioNodes,
      }
      setRemoteUserInfos((prev) => [...prev, remoteUserInfo])
      sendLocalUserNameToAll()
      sendLocalUserCoordinateToAll()
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
    setPeerOnConnection()
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

  const onClickRename = () => {
    console.log(`${localUserNameElement.value}に変える`) // TODO:
    if (localUserInfo().userName === localUserNameElement.value) {
      // TODO: 同じ場合disabledに
      console.info('今と同じ名前です')
      return
    }
    setLocalUserInfo((preInfo) => ({
      ...preInfo,
      userName: localUserNameElement.value,
    }))
    sendLocalUserNameToAll()
  }

  return (
    <div>
      <div
        class="relative bg-main"
        style={{ height: `${ROOM_X}px`, width: `${ROOM_Y}px` }}
      >
        {/* Remote User Icons */}
        {
          // TODO: more better
          // eslint-disable-next-line solid/prefer-for
          remoteUserInfos().map((info) => (
            <RemoteUserIcon info={info} />
          ))
        }
        {/* <For each={remoteUserInfos()}> かぜかうまくいかない
          {(info) => <RemoteUserIcon info={info} />}
        </For> */}
        {/* Local User Icon */}
        {localUserInfo() ? <LocalUserIcon /> : null}
        {/* buttons */}
        <div class="sticky left-0 top-0 inline-flex">
          <button
            class="btn btn-primary m-2"
            onClick={() => onStart()}
            disabled={isStarted()}
          >
            開始
          </button>
          <button
            class="btn btn-primary m-2"
            onClick={() => onEnd()}
            disabled={!isStarted()}
          >
            停止
          </button>
          <input
            type="text"
            ref={localUserNameElement}
            class="input input-bordered m-2"
            value="No Name"
          />
          {isStarted() ? (
            <button class="btn btn-primary m-2" onClick={() => onClickRename()}>
              rename
            </button>
          ) : undefined}
        </div>
        {/* Toolbar */}
        <UserToolbar />
        <MainToolbar />
        <ChatToolbar />
      </div>
    </div>
  )
}
