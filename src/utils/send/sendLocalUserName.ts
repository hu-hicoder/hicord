import { localUserInfo, UserName, RemoteUserInfo } from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserNameToAll = () => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserName = { userName: _localUserInfo.userName }
  sendToAll(data)
}

export const sendLocalUserNameTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: UserName = { userName: _localUserInfo.userName }
  sendTo(remoteUserPeerId, data)
}
