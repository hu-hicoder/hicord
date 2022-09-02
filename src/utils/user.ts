import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<
  RemoteUserInfo[]
>([])

export type UserInfo = UserCoordinate &
  UserName &
  UserAvatar &
  UserReaction & {
    stream: MediaStream
    peerId: string
  }

/**
 * ユーザーの座標
 * right-handed coordinate system
 */
export type UserCoordinate = {
  x: number
  y: number
  deg: number
}

export type RemoteUserAudioNodes = {
  sourceNode: MediaStreamAudioSourceNode
  gainNode: GainNode
  pannerNode: PannerNode
}

export type RemoteUserInfo = UserInfo & RemoteUserAudioNodes

export type UserName = {
  userName: string
}

export type UserAvatar = {
  image?: File
}

export type UserReaction = {
  userReactionURIEncoded?: string
}

export const isUserCoordinate = (data: unknown): data is UserCoordinate =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as UserCoordinate).x === 'number' &&
  typeof (data as UserCoordinate).y === 'number' &&
  typeof (data as UserCoordinate).deg === 'number'

export const isUserName = (data: unknown): data is UserName =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as UserName).userName === 'string'

// TODO Refactor
// const isFile = (input) => 'File' in window && input instanceof File
export const isUserAvatar = (data: unknown): data is UserAvatar =>
  typeof data === 'object' &&
  data !== null &&
  (data as UserAvatar).image !== null

export const isUserReaction = (data: unknown): data is Required<UserReaction> =>
  typeof data === 'object' &&
  data !== null &&
  typeof (data as UserReaction).userReactionURIEncoded === 'string'
