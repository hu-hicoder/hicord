/* eslint-disable solid/prefer-for */
import Peer, { SfuRoom } from 'skyway-js'
import { Component, createEffect, createSignal, For } from 'solid-js'
import { audioCtx, initRemoteAudio, setAudioListener } from '../utils/audio'
import { BoxTypes, getRoomBoxInfos } from '../utils/boxes/box'
import { ChatBoxInfo } from '../utils/boxes/chat'
import { ImageBoxInfo } from '../utils/boxes/image'
import { ScreenBoxInfo } from '../utils/boxes/screen'
import { goToMyLocation } from '../utils/goToMyLocation'
import { receivedDataAction } from '../utils/receivedDataAction'
import { setRoom } from '../utils/room'
import { sendChatInfosTo } from '../utils/send/sendChatInfo'
import {
  sendLocalUserAvatarToAll,
  sendLocalUserAvatarTo,
  sendLocalUserOriginalAvatarTo,
  sendLocalUserOriginalAvatarToAll,
} from '../utils/send/sendLocalUserAvatar'
import {
  sendLocalUserCoordinateTo,
  sendLocalUserCoordinateToAll,
} from '../utils/send/sendLocalUserCoordinate'
import {
  sendLocalUserMutedTo,
  sendLocalUserMutedToAll,
} from '../utils/send/sendLocalUserMuted'
import {
  sendLocalUserNameTo,
  sendLocalUserNameToAll,
} from '../utils/send/sendLocalUserName'
import { sendRoomBoxInfosTo } from '../utils/send/sendRoomBoxInfo'
import { setCall } from '../utils/setCall'
import {
  defaultUserAvatar,
  localUserInfo,
  RemoteUserInfo,
  remoteUserInfos,
  setLocalUserInfo,
  setRemoteUserInfos,
} from '../utils/user'
import ChatBox from './boxes/ChatBox'
import ImageBox from './boxes/ImageBox'
import ScreenBox from './boxes/ScreenBox'
import ChatToolbar from './toolbars/ChatToolbar'
import MainToolbar from './toolbars/MainToolbar'
import UserToolbar from './toolbars/UserToolbar'
import LocalUserIcon from './userIcons/LocalUserIcon'
import RemoteUserIcon from './userIcons/RemoteUserIcon'

export const PEER = new Peer({
  key: import.meta.env.VITE_SKY_WAY_API_KEY as string,
}) // TODO: 保持したPeer IDから復元できるようにする？

const ROOM_X = 4096
const ROOM_Y = 4096

export const [isStarted, setIsStarted] = createSignal(false)

export const Room: Component<{ roomId: string }> = (props) => {
  // Local
  const [localStream, setLocalStream] = createSignal<MediaStream>()

  createEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          // TODO: ユーザーが選択できるように？
          echoCancellation: true,
          // echoCancellationType: 'system', // 使える？
          noiseSuppression: true,
        },
      })
      .then((stream) => {
        setLocalStream(stream)
      })
      .catch((e) => {
        console.log(e)
      })
  })

  const onStart = () => {
    if (PEER && !PEER.open) {
      return
    }
    const _localStream = localStream()
    if (_localStream === undefined) {
      return
    }

    setIsStarted(true)

    setLocalUserInfo({
      ...defaultUserAvatar,
      stream: _localStream,
      peerId: PEER.id,
      x: ROOM_X / 2,
      y: ROOM_Y / 2,
      deg: 0,
      userName: localStorage.getItem('localUserName') ?? 'No Name',
      muted: true,
    })
    setAudioListener()

    const _room = PEER.joinRoom<SfuRoom>(props.roomId, {
      mode: 'sfu',
      stream: localStream(),
    })
    _room.once('open', () => {
      console.log('=== あなたが参加しました ===\n')
      goToMyLocation()
    })
    _room.on('peerJoin', (peerId) => {
      console.log(`=== ${peerId} が入室しました ===\n`)
      // Send data
      sendLocalUserNameTo(peerId)
      sendLocalUserCoordinateTo(peerId)
      sendLocalUserAvatarTo(peerId)
      sendLocalUserOriginalAvatarTo(peerId)
      sendLocalUserMutedTo(peerId)
      const _localUserInfo = localUserInfo()
      // Send Room data
      if (
        _localUserInfo !== undefined &&
        !remoteUserInfos().some(
          (element) => element.peerId.localeCompare(_localUserInfo.peerId) > 0
        )
      ) {
        sendRoomBoxInfosTo(peerId)
        sendChatInfosTo(peerId)
      }
    })
    _room.on('stream', (stream) => {
      const userInfo = {
        ...defaultUserAvatar,
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
      sendLocalUserOriginalAvatarToAll()
      sendLocalUserMutedToAll()
    })
    _room.on('peerLeave', (peerId) => {
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
    _room.on('data', (roomData) => {
      receivedDataAction(roomData.data, roomData.src)
    })

    setRoom(_room)

    // Media Connection
    setCall()
    // DataConnection
    PEER.on('connection', (dataConnection) => {
      dataConnection.on('data', (data) => {
        receivedDataAction(data, dataConnection.remoteId)
      })
    })

    // Start Audio
    if (audioCtx.state === 'suspended') {
      void audioCtx.resume().then(() => {
        console.log('音声の再生を開始しました')
      })
    }
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
              case BoxTypes.IMAGE:
                return <ImageBox info={info as ImageBoxInfo} />
              case BoxTypes.SCREEN:
                return <ScreenBox info={info as ScreenBoxInfo} />
            }
          }}
        </For>
        {/* Remote User Icons */}
        {remoteUserInfos().map((info) => (
          <RemoteUserIcon info={info} />
        ))}
        {/* <For each={remoteUserInfos()}> なぜかうまくいかない
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
