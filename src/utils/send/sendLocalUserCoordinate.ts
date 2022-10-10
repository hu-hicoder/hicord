import { RemoteUserInfo, localUserInfo } from '../user'
import { Coordinate } from '../coordinate'
import { sendTo, sendToAll } from './send'

export const sendLocalUserCoordinateToAll = () => {
  const data: Coordinate = {
    x: localUserInfo.x,
    y: localUserInfo.y,
    deg: localUserInfo.deg,
  }
  sendToAll(data)
}

export const sendLocalUserCoordinateTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: Coordinate = {
    x: localUserInfo.x,
    y: localUserInfo.y,
    deg: localUserInfo.deg,
  }
  sendTo(remoteUserPeerId, data)
}
