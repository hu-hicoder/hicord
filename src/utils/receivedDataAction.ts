import { setPanner } from './audio'
import { setRoomBoxInfo } from './boxes/box'
import { isChatBoxInfo, isChatInfo, setChatInfos } from './boxes/chat'
import { isImageBoxInfo } from './boxes/image'
import { isScreenBoxInfo } from './boxes/screen'
import { isTalkBoxInfo } from './boxes/talk'
import { addRemoteUserReaction } from './reaction'
import {
  isUserAvatar,
  isUserCoordinate,
  isUserMuted,
  isUserName,
  isUserOriginalAvatar,
  isUserReaction,
  setRemoteUserInfos,
} from './user'

export const receivedDataAction = (data: unknown, sourcePeerId: string) => {
  console.log(data) // TODO: remove

  if (isUserCoordinate(data)) {
    console.log('user coord')
    setRemoteUserInfos((preInfo) =>
      preInfo.map((remoteUserInfo) => {
        if (remoteUserInfo.peerId === sourcePeerId) {
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
    addRemoteUserReaction(data.userReactionURIEncoded, sourcePeerId)
  } else if (isUserMuted(data)) {
    console.log('user muted')
    setRemoteUserInfos((preInfos) =>
      preInfos.map((remoteUserInfo) => {
        if (remoteUserInfo.peerId === sourcePeerId) {
          remoteUserInfo.muted = data.muted
        }
        return remoteUserInfo
      })
    )
  } else if (isUserName(data)) {
    console.log('user name')
    setRemoteUserInfos((preInfo) =>
      preInfo.map((remoteUserInfo) => {
        if (remoteUserInfo.peerId === sourcePeerId) {
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
  } else if (isImageBoxInfo(data)) {
    console.log('image box info')
    const arrayBuffer = data.image as unknown as ArrayBuffer
    data.image = new Blob([arrayBuffer], {
      type: 'image/jpeg',
    }) as File
    setRoomBoxInfo(data)
  } else if (isScreenBoxInfo(data)) {
    console.log('screen box info')
    setRoomBoxInfo(data)
  } else if (isTalkBoxInfo(data)) {
    console.log('talk box info')
    setRoomBoxInfo(data)
  } else if (isUserAvatar(data)) {
    console.log('user avatar')
    setRemoteUserInfos((preInfo) =>
      preInfo.map((remoteUserInfo) => {
        if (remoteUserInfo.peerId === sourcePeerId) {
          remoteUserInfo.mainColor = data.mainColor
          remoteUserInfo.subColor1 = data.subColor1
          remoteUserInfo.subColor2 = data.subColor2
        }
        return remoteUserInfo
      })
    )
  } else if (isUserOriginalAvatar(data)) {
    console.log('user avatar', data)
    // TODO Refactor
    setRemoteUserInfos((preInfo) =>
      preInfo.map((remoteUserInfo) => {
        if (remoteUserInfo.peerId === sourcePeerId) {
          const arrayBuffer = data.originalImage as unknown as ArrayBuffer
          remoteUserInfo.originalImage = new Blob([arrayBuffer], {
            type: 'image/jpeg',
          }) as File
        }
        return remoteUserInfo
      })
    )
  }
}
