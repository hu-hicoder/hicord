import { localUserInfo, UserCoordinate, RemoteUserInfo } from './user'
import { sendTo, sendToAll } from './send'

export const sendUserCoordinateToAll = () => {
  const data: UserCoordinate = {
    x: localUserInfo().x,
    y: localUserInfo().y,
    deg: localUserInfo().deg,
  }
  sendToAll(data)
}

export const sendUserCoordinate = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserCoordinate = {
    x: localUserInfo().x,
    y: localUserInfo().y,
    deg: localUserInfo().deg,
  }
  sendTo(remoteUserPeerId, data)
}
