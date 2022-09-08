import { PEER } from '../components/Room'
import { setPanner } from './audio'
import { isChatInfo, setChatInfos, isChatBoxInfo } from './chat'
import { addRemoteUserReaction } from './reaction'
import {
  isUserAvatar,
  isUserCoordinate,
  isUserName,
  isUserReaction,
  setRemoteUserInfos,
} from './user'
import { setRoomBoxInfo } from './box'
import { isScreenBoxInfo } from './screen'

export const setPeerOnConnection = () => {
  PEER.on('connection', (dataConnection) => {
    dataConnection.on('data', (data) => {
      console.log(data)
      if (isUserCoordinate(data)) {
        console.log('user coord')
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
        console.log('user reaction')
        addRemoteUserReaction(
          data.userReactionURIEncoded,
          dataConnection.remoteId
        )
      } else if (isUserName(data)) {
        console.log('user name')
        setRemoteUserInfos((preInfo) =>
          preInfo.map((remoteUserInfo) => {
            if (remoteUserInfo.peerId === dataConnection.remoteId) {
              remoteUserInfo.userName = data.userName
            }
            return remoteUserInfo
          })
        )
      } else if (isChatInfo(data)) {
        console.log('get chat info')
        data.date = new Date(data.date)
        setChatInfos((prev) => [...prev, data])
      } else if (isChatBoxInfo(data)) {
        console.log('chat box info')
        setRoomBoxInfo(data)
      } else if (isScreenBoxInfo(data)) {
        console.log('screen box info')
        setRoomBoxInfo(data)
      } else if (isUserAvatar(data)) {
        console.log('user avatar', data)
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
