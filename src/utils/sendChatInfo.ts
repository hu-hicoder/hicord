import { RemoteUserInfo, localUserInfo } from './user'
import { ChatInfo, ChatRaw } from './chat'
import { sendTo, sendToAll } from './send'

function localChatInfoFrom(chatRaw: ChatRaw): ChatInfo {
  return {
    userName: localUserInfo().userName,
    chatId: chatRaw.chatId,
    peerId: localUserInfo().peerId,
    value: chatRaw.value,
    date: new Date(),
  }
}

export const sendChatInfoToAll = (chatRaw: ChatRaw) => {
  sendToAll(localChatInfoFrom(chatRaw))
}

export const sendChatInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  chatRaw: ChatRaw
) => {
  sendTo(remoteUserPeerId, localChatInfoFrom(chatRaw))
}
