import { UserName, RemoteUserInfo, localUserInfo } from '../user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserNameToAll = () => {
  const data: UserName = { userName: localUserInfo.userName }
  sendToAll(data)
}

export const sendLocalUserNameTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserName = { userName: localUserInfo.userName }
  sendTo(remoteUserPeerId, data)
}
