import { RemoteUserInfo } from '../user'
import { ScreenBoxInfo } from '../boxes/screen'
import { sendTo, sendToAll } from './send'

// Screen Box
export const sendScreenBoxInfoToAll = (data: ScreenBoxInfo) => {
  sendToAll(data)
}

export const sendScreenBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: ScreenBoxInfo
) => {
  sendTo(remoteUserPeerId, data)
}
