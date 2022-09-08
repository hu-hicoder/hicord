import { RemoteUserInfo } from '../user'
import { RoomBoxInfo, BoxTypes, getRoomBoxInfos } from '../boxes/box'
import { sendChatBoxInfoTo, sendChatBoxInfoToAll } from './sendChatInfo'
import { ChatBoxInfo } from '../boxes/chat'
import { sendScreenBoxInfoTo, sendScreenBoxInfoToAll } from './sendScreen'
import { ScreenBoxInfo } from '../boxes/screen'

export const sendRoomBoxInfoToAll = (data: RoomBoxInfo) => {
  switch (data.boxType) {
    case BoxTypes.CHAT:
      sendChatBoxInfoToAll(data as ChatBoxInfo)
      break
    case BoxTypes.SCREEN:
      sendScreenBoxInfoToAll(data as ScreenBoxInfo)
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
    case BoxTypes.SCREEN:
      sendScreenBoxInfoTo(remoteUserPeerId, data as ScreenBoxInfo)
      break
  }
}

export const sendRoomBoxInfosTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  getRoomBoxInfos().forEach((info) => sendRoomBoxInfoTo(remoteUserPeerId, info))
}
