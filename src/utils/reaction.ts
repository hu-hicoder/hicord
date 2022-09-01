import { sendLocalUserReactionToAll } from './sendLocalUserReaction'
import {
  RemoteUserInfo,
  remoteUserInfos,
  setLocalUserInfo,
  setRemoteUserInfos,
  UserReaction,
} from './user'

const REACTION_DISPLAY_TIME_MS = 5000

let newLocalUserReactionAddedTimeMs: number
export const addLocalUserReaction = (
  reaction: UserReaction['userReaction']
) => {
  sendLocalUserReactionToAll(reaction)
  setLocalUserInfo((preInfo) => ({
    ...preInfo,
    userReaction: reaction,
  }))
  const thisReactionAddedTime = Date.now()
  newLocalUserReactionAddedTimeMs = thisReactionAddedTime
  void (async () => {
    await sleep(REACTION_DISPLAY_TIME_MS)
    if (newLocalUserReactionAddedTimeMs === thisReactionAddedTime) {
      setLocalUserInfo((preInfo) => ({
        ...preInfo,
        userReaction: undefined,
      }))
    }
  })()
}

const newRemoteUserReactionAddedTimeMsDictionary: {
  [peerId: RemoteUserInfo['peerId']]: number
} = {}
export const addRemoteUserReaction = (
  reaction: UserReaction['userReaction'],
  peerId: RemoteUserInfo['peerId']
) => {
  setRemoteUserInfos((preInfos) =>
    preInfos.map((preInfo) => {
      if (preInfo.peerId === peerId) {
        return { ...preInfo, userReaction: reaction }
      }
      return preInfo
    })
  )
  const thisReactionAddedTime = Date.now()
  newRemoteUserReactionAddedTimeMsDictionary[peerId] = thisReactionAddedTime

  void (async () => {
    await sleep(REACTION_DISPLAY_TIME_MS)
    if (
      newRemoteUserReactionAddedTimeMsDictionary[peerId] ===
      thisReactionAddedTime
    ) {
      setRemoteUserInfos((preInfos) => {
        return preInfos.map((preInfo) => {
          if (preInfo.peerId === peerId) {
            return { ...preInfo, userReaction: undefined }
          }
          return preInfo
        })
      })
      const remoteUserPeerIds = remoteUserInfos().map((info) => info.peerId)
      Object.keys(newRemoteUserReactionAddedTimeMsDictionary)
        .filter((id) => !remoteUserPeerIds.includes(id))
        .forEach((id) => {
          delete newRemoteUserReactionAddedTimeMsDictionary[id]
        }) // TODO: perf: 頻度が高くて重い？
    }
  })()
}

const sleep = async (durationMs: number) =>
  new Promise((resolve) => setTimeout(resolve, durationMs))
