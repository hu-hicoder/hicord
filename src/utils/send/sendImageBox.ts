import { RemoteUserInfo } from '../user'
import { sendTo, sendToAll } from './send'
import { ImageBoxInfo } from '../boxes/image'

export const sendImageBoxInfoToAll = (data: ImageBoxInfo) => {
  sendToAll(data)
}

export const sendImageBoxInfoTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: ImageBoxInfo
) => {
  sendTo(remoteUserPeerId, data)
}
