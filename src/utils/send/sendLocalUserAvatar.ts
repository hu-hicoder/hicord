import { localUserInfo, UserAvatar, RemoteUserInfo } from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserAvatarToAll = () => {
  const data: UserAvatar = {
    image: localUserInfo().image,
  }
  sendToAll(data)
}

export const sendLocalUserAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserAvatar = {
    image: localUserInfo().image,
  }
  sendTo(remoteUserPeerId, data)
}
