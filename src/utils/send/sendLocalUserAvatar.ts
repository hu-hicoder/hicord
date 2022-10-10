import {
  UserOriginalAvatar,
  RemoteUserInfo,
  UserAvatar,
  localUserInfo,
} from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserOriginalAvatarToAll = () => {
  const localUserOriginalImage = localUserInfo.originalImage
  if (localUserOriginalImage === undefined) return
  const data: UserOriginalAvatar = {
    originalImage: localUserOriginalImage,
  }
  sendToAll(data)
}

export const sendLocalUserOriginalAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const localUserOriginalImage = localUserInfo.originalImage
  if (localUserOriginalImage === undefined) return
  const data: UserOriginalAvatar = {
    originalImage: localUserOriginalImage,
  }
  sendTo(remoteUserPeerId, data)
}

export const sendLocalUserAvatarToAll = () => {
  const data: UserAvatar = {
    mainColor: localUserInfo.mainColor,
    subColor1: localUserInfo.subColor1,
    subColor2: localUserInfo.subColor2,
  }
  sendToAll(data)
}

export const sendLocalUserAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserAvatar = {
    mainColor: localUserInfo.mainColor,
    subColor1: localUserInfo.subColor1,
    subColor2: localUserInfo.subColor2,
  }
  sendTo(remoteUserPeerId, data)
}
