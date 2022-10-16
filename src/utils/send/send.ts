import { DataConnection } from 'skyway-js'
import { PEER } from '../../components/Room'
import { room } from '../room'
import { RemoteUserInfo } from '../user'

const dataConnections: Record<
  RemoteUserInfo['peerId'],
  DataConnection | undefined
> = {}

const addDataConnectionsIfNotAlreadyAdded = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  if (dataConnections[remoteUserPeerId] === undefined) {
    dataConnections[remoteUserPeerId] = PEER.connect(remoteUserPeerId)
  }
}

const getDataConnection = (remoteUserPeerId: RemoteUserInfo['peerId']) => {
  addDataConnectionsIfNotAlreadyAdded(remoteUserPeerId)
  return dataConnections[remoteUserPeerId] as DataConnection
}

export const closeDataConnection = (
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  dataConnections[remoteUserPeerId]?.close()
  delete dataConnections[remoteUserPeerId]
}

export const sendTo = (
  remoteUserPeerId: RemoteUserInfo['peerId'],
  data: unknown
) => {
  const dataConnection = getDataConnection(remoteUserPeerId)

  if (dataConnection.open) {
    dataConnection.send(data)
    console.log(`send to ${remoteUserPeerId}`, data)
  } else {
    dataConnection.on('open', () => {
      dataConnection.send(data)
      console.log(`send to ${remoteUserPeerId}`, data)
    })
  }
}

export const sendToAll = (data: unknown) => {
  room()?.send(data)
}
