/* eslint-disable solid/prefer-for */
import Peer, { SfuRoom } from 'skyway-js'
import { Component, For, createEffect, createSignal } from 'solid-js'
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
import ChatBox from './boxes/ChatBox'
import { initRemoteAudio, setListener } from '../utils/audio'
import {
  sendLocalUserNameTo,
  sendLocalUserNameToAll,
} from '../utils/send/sendLocalUserName'
import {
  sendLocalUserAvatarTo,
  sendLocalUserAvatarToAll,
} from '../utils/send/sendLocalUserAvatar'
import {
  sendLocalUserCoordinateTo,
  sendLocalUserCoordinateToAll,
} from '../utils/send/sendLocalUserCoordinate'
import { setPeerOnConnection } from '../utils/setPeerOnConnection'
import { getRoomBoxInfos } from '../utils/box'
import { sendRoomBoxInfosTo } from '../utils/send/sendRoomBoxInfo'
import { sendChatInfosTo } from '../utils/send/sendChatInfo'
import { goToMyLocation } from '../utils/goToMyLocation'
import { sendLocalUserMutedTo, sendLocalUserMutedToAll } from '../utils/send/sendLocalUserMuted'

const KEY = import.meta.env.VITE_SKY_WAY_API_KEY
export const PEER = new Peer({ key: KEY as string })

const ROOM_X = 4096
const ROOM_Y = 4096

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
      userName: 'No Name', // TODO: 保存してある名前から参照する
      muted: true,
    })
    setListener(localUserInfo())

    const tmpRoom = PEER.joinRoom<SfuRoom>(props.roomId, {
      mode: 'sfu',
      stream: localStream(),
    })
    tmpRoom.once('open', () => {
      console.log('=== あなたが参加しました ===\n')
      goToMyLocation()
    })
    tmpRoom.on('peerJoin', (peerId) => {
      console.log(`=== ${peerId} が入室しました ===\n`)
      // Send data
      sendLocalUserNameTo(peerId)
      sendLocalUserCoordinateTo(peerId)
      sendLocalUserAvatarTo(peerId)
      sendLocalUserMutedTo(peerId)
      // Send Room data
      if (
        !remoteUserInfos().some(
          (element) => element.peerId.localeCompare(localUserInfo().peerId) > 0
        )
      ) {
        sendRoomBoxInfosTo(peerId)
        sendChatInfosTo(peerId)
      }
    })
    tmpRoom.on('stream', async (stream) => {
      const userInfo = {
        stream: stream,
        peerId: stream.peerId,
        x: ROOM_X / 2,
        y: ROOM_Y / 2,
        deg: 0,
        userName: 'No Name', // TODO:
        muted: true,
      }
      const audioNodes = initRemoteAudio(userInfo)
      console.log('create remote user info')
      const remoteUserInfo: RemoteUserInfo = {
        ...userInfo,
        ...audioNodes,
      }
      setRemoteUserInfos((prev) => [...prev, remoteUserInfo])
      // Send data
      sendLocalUserNameToAll()
      sendLocalUserCoordinateToAll()
      sendLocalUserAvatarToAll()
      sendLocalUserMutedToAll()
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

  return (
    <div>
      <div
        class="relative bg-main"
        style={{ height: `${ROOM_X}px`, width: `${ROOM_Y}px` }}
      >
        {/* Boxes */}
        <For each={getRoomBoxInfos()}>
          {(info) => <ChatBox chatBoxInfo={info} />}
        </For>
        {/* Remote User Icons */}
        {remoteUserInfos().map((info) => (
          <RemoteUserIcon info={info} />
        ))}
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
        </div>
        {/* Toolbar */}
        <UserToolbar />
        <MainToolbar />
        <ChatToolbar />
      </div>
    </div>
  )
}
