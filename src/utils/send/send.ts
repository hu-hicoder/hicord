import { PEER } from '../../components/Room'
import { room } from '../room'
import { RemoteUserInfo } from '../user'

export const sendTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: unknown
) => {
  // TODO: 毎回DataConnectionを作り直さないようにする
  const dataConnection = PEER.connect(remoteUserPeerId)

  dataConnection.once('open', () => {
    dataConnection.send(data)
    console.log(`send to ${remoteUserPeerId}`, data)
    dataConnection.close()
  })
}

export const sendToAll = (data: unknown) => {
  room()?.send(data)
}
