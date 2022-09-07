import { RemoteUserInfo } from './user'
import { RoomBoxInfo, BoxTypes, getRoomBoxInfos } from './box'
import { sendChatBoxInfoTo, sendChatBoxInfoToAll } from './sendChatInfo'
import { ChatBoxInfo } from './chat'

export const sendRoomBoxInfoToAll = (data: RoomBoxInfo) => {
  switch (data.boxType) {
    case BoxTypes.CHAT:
      sendChatBoxInfoToAll(data as ChatBoxInfo)
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
  }
}

export const sendRoomBoxInfosTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  getRoomBoxInfos().forEach((info) => sendRoomBoxInfoTo(remoteUserPeerId, info))
}
