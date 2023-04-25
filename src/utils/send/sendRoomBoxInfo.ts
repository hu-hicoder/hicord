import { RemoteUserInfo } from '../user'
import {
  RoomBoxInfo,
  BoxTypes,
  getRoomBoxInfos,
  DeleteRoomBoxInfo,
} from '../boxes/box'
import { ImageBoxInfo } from '../boxes/image'
import { ChatBoxInfo } from '../boxes/chat'
import { ScreenBoxInfo } from '../boxes/screen'
import { TalkBoxInfo } from './../boxes/talk'
import { sendTalkBoxInfoTo, sendTalkBoxInfoToAll } from './sendTalkBox'
import { sendChatBoxInfoTo, sendChatBoxInfoToAll } from './sendChatInfo'
import { sendScreenBoxInfoTo, sendScreenBoxInfoToAll } from './sendScreen'
import { sendImageBoxInfoTo, sendImageBoxInfoToAll } from './sendImageBox'
import { sendTo, sendToAll } from './send'

export const sendRoomBoxInfoToAll = (data: RoomBoxInfo) => {
  switch (data.boxType) {
    case BoxTypes.CHAT:
      sendChatBoxInfoToAll(data as ChatBoxInfo)
      break
    case BoxTypes.IMAGE:
      sendImageBoxInfoToAll(data as ImageBoxInfo)
      break
    case BoxTypes.SCREEN:
      sendScreenBoxInfoToAll(data as ScreenBoxInfo)
      break
    case BoxTypes.TALK:
      sendTalkBoxInfoToAll(data as TalkBoxInfo)
      break
  }
}

export const sendRoomBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: RoomBoxInfo
) => {
  switch (data.boxType) {
    case BoxTypes.CHAT:
      sendChatBoxInfoTo(remoteUserPeerId, data as ChatBoxInfo)
      break
    case BoxTypes.IMAGE:
      sendImageBoxInfoTo(remoteUserPeerId, data as ImageBoxInfo)
      break
    case BoxTypes.SCREEN:
      sendScreenBoxInfoTo(remoteUserPeerId, data as ScreenBoxInfo)
      break
    case BoxTypes.TALK:
      sendTalkBoxInfoTo(remoteUserPeerId, data as TalkBoxInfo)
  }
}

export const sendRoomBoxInfosTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  getRoomBoxInfos().forEach((info) => sendRoomBoxInfoTo(remoteUserPeerId, info))
}

// delete box
export const sendDeleteRoomBoxInfoToAll = (data: DeleteRoomBoxInfo) => {
  sendToAll(data)
}

export const sendDeleteRoomBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: DeleteRoomBoxInfo
) => {
  sendTo(remoteUserPeerId, data)
}
