import { RemoteUserInfo } from './user'
import { ChatInfo, localChatInfoFrom } from './chat'
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
