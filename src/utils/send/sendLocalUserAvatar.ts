import { localUserInfo, UserOriginalAvatar, RemoteUserInfo } from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserOriginalAvatarToAll = () => {
  const data: UserOriginalAvatar = {
    originalImage: localUserInfo().originalImage,
  }
  sendToAll(data)
}

export const sendLocalUserOriginalAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserOriginalAvatar = {
    originalImage: localUserInfo().originalImage,
  }
  sendTo(remoteUserPeerId, data)
}
