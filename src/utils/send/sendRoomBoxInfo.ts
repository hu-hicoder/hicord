import { RemoteUserInfo } from '../user'
import { RoomBoxInfo, BoxTypes, getRoomBoxInfos } from '../boxes/box'
import { ImageBoxInfo } from '../boxes/image'
import { ChatBoxInfo } from '../boxes/chat'
import { ScreenBoxInfo } from '../boxes/screen'
import { sendChatBoxInfoTo, sendChatBoxInfoToAll } from './sendChatInfo'
import { sendScreenBoxInfoTo, sendScreenBoxInfoToAll } from './sendScreen'
import { sendImageBoxInfoTo, sendImageBoxInfoToAll } from './sendImageBox'

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
  }
}

export const sendRoomBoxInfosTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  getRoomBoxInfos().forEach((info) => sendRoomBoxInfoTo(remoteUserPeerId, info))
}
