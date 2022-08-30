import { PEER } from '../components/Room'
import {
  localUserInfo,
  RemoteUserInfo,
  remoteUserInfos,
  UserName,
} from './user'

export const sendLocalUserNameToAll = () => {
  remoteUserInfos().forEach((info) => {
    const dataConnection = PEER.connect(info.peerId)

    dataConnection.on('open', () => {
      const data: UserName = { userName: localUserInfo().userName }
      dataConnection.send(data)
    })
  })
}

export const sendLocalUserName = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const dataConnection = PEER.connect(remoteUserPeerId)
  dataConnection.on('open', () => {
    const data: UserName = { userName: localUserInfo().userName }
    dataConnection.send(data)
  })
}
