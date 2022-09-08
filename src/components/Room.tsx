/* eslint-disable solid/prefer-for */
import Peer, { SfuRoom } from 'skyway-js'
import { Component, For } from 'solid-js'
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
import { BoxTypes, getRoomBoxInfos } from '../utils/box'
import { sendRoomBoxInfosTo } from '../utils/send/sendRoomBoxInfo'
import { sendChatInfosTo } from '../utils/send/sendChatInfo'
import { goToMyLocation } from '../utils/goToMyLocation'
import { setCall } from '../utils/setCall'
import { ChatBoxInfo } from '../utils/chat'
import ScreenBox from './boxes/ScreenBox'
import { ScreenBoxInfo } from '../utils/screen'

const KEY = import.meta.env.VITE_SKY_WAY_API_KEY
export const PEER = new Peer({ key: KEY as string })

const ROOM_X = 4096
const ROOM_Y = 4096

// Room
export const [isStarted, setIsStarted] = createSignal(false)
export const [room, setRoom] = createSignal<SfuRoom>()

export const Room: Component<{ roomId: string }> = (props) => {
  // Local
  const [localStream, setLocalStream] = createSignal<MediaStream>()

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

    setIsStarted(true)

    setLocalUserInfo({
      stream: localStream(),
      peerId: PEER.id,
      x: ROOM_X / 2,
      y: ROOM_Y / 2,
      deg: 0,
      userName: 'No Name', // TODO: 保存してある名前から参照する
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
    // Media Connection
    setCall()
    // DataConnection
    setPeerOnConnection()
  }

  return (
    <div>
      <div
        class="relative bg-main"
        style={{ height: `${ROOM_X}px`, width: `${ROOM_Y}px` }}
      >
        {/* Boxes */}
        <For each={getRoomBoxInfos()}>
          {(info) => {
            switch (info.boxType) {
              case BoxTypes.CHAT:
                return <ChatBox info={info as ChatBoxInfo} />
              case BoxTypes.SCREEN:
                return <ScreenBox info={info as ScreenBoxInfo} />
            }
          }}
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
        {isStarted() ? null : (
          <div
            class="mx-auto sm:w-3/4 md:w-2/4 fixed inset-0 flex items-center"
            id="signin-success-message"
          >
            <div class="py-4 flex items-center justify-center w-full">
              <button
                class="py-6 px-10 bg-sky-600 rounded-full text-2xl font-bold text-sky-50"
                onClick={() => onStart()}
              >
                開始
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <UserToolbar />
        <MainToolbar />
        <ChatToolbar />
      </div>
    </div>
  )
}
