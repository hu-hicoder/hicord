import {
  localUserInfo,
  UserOriginalAvatar,
  RemoteUserInfo,
  UserAvatar,
} from '../user'
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

export const sendLocalUserAvatarToAll = () => {
  const data: UserAvatar = {
    mainColor: localUserInfo().mainColor,
    subColor1: localUserInfo().subColor1,
    subColor2: localUserInfo().subColor2,
  }
  sendToAll(data)
}

export const sendLocalUserAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserAvatar = {
    mainColor: localUserInfo().mainColor,
    subColor1: localUserInfo().subColor1,
    subColor2: localUserInfo().subColor2,
  }
  sendTo(remoteUserPeerId, data)
}
