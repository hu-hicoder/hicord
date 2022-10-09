import { localUserInfo, RemoteUserInfo } from '../user'
import { Coordinate } from '../coordinate'
import { sendTo, sendToAll } from './send'

export const sendLocalUserCoordinateToAll = () => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: Coordinate = {
    x: _localUserInfo.x,
    y: _localUserInfo.y,
    deg: _localUserInfo.deg,
  }
  sendToAll(data)
}

export const sendLocalUserCoordinateTo = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  const data: Coordinate = {
    x: _localUserInfo.x,
    y: _localUserInfo.y,
    deg: _localUserInfo.deg,
  }
  sendTo(remoteUserPeerId, data)
}
