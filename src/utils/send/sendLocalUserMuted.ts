import { localUserInfo, RemoteUserInfo, UserMuted } from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserMutedToAll = () => {
  const data: UserMuted = {
    muted: localUserInfo().muted,
  }
  sendToAll(data)
}

export const sendLocalUserMutedTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserMuted = {
    muted: localUserInfo().muted,
  }
  sendTo(remoteUserPeerId, data)
}
