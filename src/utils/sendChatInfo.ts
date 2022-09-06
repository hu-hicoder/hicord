import { RemoteUserInfo } from './user'
import { ChatInfo, localChatInfoFrom, ChatBoxInfo } from './chat'
import { sendTo, sendToAll } from './send'

export const sendChatInfoToAll = (data: ChatInfo) => {
  sendToAll(localChatInfoFrom(data))
}

export const sendChatInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: ChatInfo
) => {
  sendTo(remoteUserPeerId, data)
}

export const sendChatBoxInfoToAll = (data: ChatBoxInfo) => {
  sendToAll(data)
}

export const sendChatBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: ChatBoxInfo
) => {
  sendTo(remoteUserPeerId, data)
}
