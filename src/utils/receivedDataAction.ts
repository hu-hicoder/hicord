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
          const _remoteUserInfo = { ...remoteUserInfo, ...data }
          setPanner(_remoteUserInfo)
          return _remoteUserInfo
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
          return { ...remoteUserInfo, ...data }
        }
        return remoteUserInfo
      })
    )
  } else if (isUserName(data)) {
    console.log('user name')
    setRemoteUserInfos((preInfo) =>
      preInfo.map((remoteUserInfo) => {
        if (remoteUserInfo.peerId === sourcePeerId) {
          return { ...remoteUserInfo, ...data }
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
          return { ...remoteUserInfo, ...data }
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
          return {
            ...remoteUserInfo,
            originalImage: new Blob(
              [data.originalImage as unknown as ArrayBuffer],
              {
                type: 'image/jpeg',
              }
            ) as File,
          }
        }
        return remoteUserInfo
      })
    )
  }
}
