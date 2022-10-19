import { RemoteUserInfo } from '../user'
import { TalkBoxInfo } from './../boxes/talk'
import { sendTo, sendToAll } from './send'

export const sendTalkBoxInfoToAll = (data: TalkBoxInfo) => {
  sendToAll(data)
}

export const sendTalkBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: TalkBoxInfo
) => {
  sendTo(remoteUserPeerId, data)
}
