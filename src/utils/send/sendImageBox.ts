import { RemoteUserInfo } from '../user'
import { ImageBoxInfo } from '../boxes/image'
import { sendTo, sendToAll } from './send'

export const sendImageBoxInfoToAll = (data: ImageBoxInfo) => {
  sendToAll(data)
}

export const sendImageBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: ImageBoxInfo
) => {
  sendTo(remoteUserPeerId, data)
}
