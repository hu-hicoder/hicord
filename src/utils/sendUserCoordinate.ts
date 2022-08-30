import { PEER } from '../components/Room'
import {
  localUserInfo,
  RemoteUserInfo,
  remoteUserInfos,
  UserCoordinate,
} from './user'

export const sendUserCoordinateToAll = () => {
  remoteUserInfos().forEach((info) => {
    const dataConnection = PEER.connect(info.peerId)

    dataConnection.on('open', () => {
      const data: UserCoordinate = {
        x: localUserInfo().x,
        y: localUserInfo().y,
        deg: localUserInfo().deg,
      }
      dataConnection.send(data)
    })
  })
}

export const sendUserCoordinate = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const dataConnection = PEER.connect(remoteUserPeerId)

  dataConnection.on('open', () => {
    const data: UserCoordinate = {
      x: localUserInfo().x,
      y: localUserInfo().y,
      deg: localUserInfo().deg,
    }
    dataConnection.send(data)
  })
}
