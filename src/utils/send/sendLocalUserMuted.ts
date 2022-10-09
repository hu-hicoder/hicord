import { localUserInfo, RemoteUserInfo, UserMuted } from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserMutedToAll = () => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserMuted = {
    muted: _localUserInfo.muted,
  }
  sendToAll(data)
}

export const sendLocalUserMutedTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserMuted = {
    muted: _localUserInfo.muted,
  }
  sendTo(remoteUserPeerId, data)
}
