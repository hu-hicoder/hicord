import { PEER } from '../../components/Room'
import { room } from '../room'
import { RemoteUserInfo } from '../user'

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
  room().send(data)
}
