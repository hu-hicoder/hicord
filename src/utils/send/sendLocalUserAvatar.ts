import {
  localUserInfo,
  UserOriginalAvatar,
  RemoteUserInfo,
  UserAvatar,
} from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserOriginalAvatarToAll = () => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserOriginalAvatar = {
    originalImage: _localUserInfo.originalImage,
  }
  sendToAll(data)
}

export const sendLocalUserOriginalAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserOriginalAvatar = {
    originalImage: _localUserInfo.originalImage,
  }
  sendTo(remoteUserPeerId, data)
}

export const sendLocalUserAvatarToAll = () => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserAvatar = {
    mainColor: _localUserInfo.mainColor,
    subColor1: _localUserInfo.subColor1,
    subColor2: _localUserInfo.subColor2,
  }
  sendToAll(data)
}

export const sendLocalUserAvatarTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserAvatar = {
    mainColor: _localUserInfo.mainColor,
    subColor1: _localUserInfo.subColor1,
    subColor2: _localUserInfo.subColor2,
  }
  sendTo(remoteUserPeerId, data)
}
