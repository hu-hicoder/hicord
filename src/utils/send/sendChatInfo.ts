import { RemoteUserInfo } from '../user'
import {
  ChatInfo,
  localChatInfoFrom,
  ChatBoxInfo,
  getChatInfos,
} from '../boxes/chat'
import { sendTo, sendToAll } from './send'

export const sendChatInfoToAll = (data: ChatInfo) => {
  const localChatInfo = localChatInfoFrom(data)
  if (localChatInfo === undefined) return
  sendToAll(localChatInfo)
}

export const sendChatInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: ChatInfo
) => {
  sendTo(remoteUserPeerId, data)
}

export const sendChatInfosTo = (remoteUserPeerId: RemoteUserInfo['peerId']) => {
  getChatInfos().forEach((info) => sendChatInfoTo(remoteUserPeerId, info))
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
