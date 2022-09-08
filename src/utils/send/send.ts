import { PEER } from '../../components/Room'
import { RemoteUserInfo, remoteUserInfos } from '../user'

export const sendTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: unknown
) => {
  const dataConnection = PEER.connect(remoteUserPeerId)

  dataConnection.on('open', () => {
    dataConnection.send(data)
    console.log(`send to ${remoteUserPeerId}`, data)
  })
}

export const sendToAll = (data: unknown) => {
  remoteUserInfos().forEach((info) => {
    sendTo(info.peerId, data)
  })
}
