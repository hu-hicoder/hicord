import { PEER } from '../components/Room'
import { setPanner } from './audio'
import { addRemoteUserReaction } from './reaction'
import {
  isUserAvatar,
  isUserCoordinate,
  isUserName,
  isUserReaction,
  setRemoteUserInfos,
} from './user'

export const setPeerOnConnection = () => {
  PEER.on('connection', (dataConnection) => {
    dataConnection.on('data', (data) => {
      console.log(data)
      if (isUserCoordinate(data)) {
        setRemoteUserInfos((preInfo) =>
          preInfo.map((remoteUserInfo) => {
            if (remoteUserInfo.peerId === dataConnection.remoteId) {
              // Coordinate
              remoteUserInfo.x = data.x
              remoteUserInfo.y = data.y
              remoteUserInfo.deg = data.deg
              // Panner Node
              setPanner(remoteUserInfo)
            }
            return remoteUserInfo
          })
        )
      } else if (isUserReaction(data)) {
        addRemoteUserReaction(data.userReaction, dataConnection.remoteId)
      } else if (isUserName(data)) {
        setRemoteUserInfos((preInfo) =>
          preInfo.map((remoteUserInfo) => {
            if (remoteUserInfo.peerId === dataConnection.remoteId) {
              remoteUserInfo.userName = data.userName
            }
            return remoteUserInfo
          })
        )
      } else if (isUserAvatar(data)) {
        // TODO Refactor
        setRemoteUserInfos((preInfo) =>
          preInfo.map((remoteUserInfo) => {
            if (remoteUserInfo.peerId === dataConnection.remoteId) {
              const arrayBuffer = data.image as unknown as ArrayBuffer
              remoteUserInfo.image = new Blob([arrayBuffer], {
                type: 'image/jpeg',
              }) as File
            }
            return remoteUserInfo
          })
        )
      }
    })
  })
}
