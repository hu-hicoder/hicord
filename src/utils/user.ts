import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<
  RemoteUserInfo[]
>([])
import { Coordinate } from './coordinate'

export type UserInfo = Coordinate &
  UserName &
  UserAvatar &
  UserReaction &
  UserMuted & {
    stream: MediaStream
    peerId: string
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

export type UserMuted = {
  muted: boolean
}

export const isUserCoordinate = (data: unknown): data is Coordinate =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 3 &&
  typeof (data as Coordinate).x === 'number' &&
  typeof (data as Coordinate).y === 'number' &&
  typeof (data as Coordinate).deg === 'number'

export const isUserName = (data: unknown): data is UserName =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 1 &&
  typeof (data as UserName).userName === 'string'

// TODO Refactor
// const isFile = (input) => 'File' in window && input instanceof File
export const isUserAvatar = (data: unknown): data is UserAvatar =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 1 &&
  (data as UserAvatar).image !== null

export const isUserReaction = (data: unknown): data is Required<UserReaction> =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 1 &&
  typeof (data as UserReaction).userReactionURIEncoded === 'string'

export const isUserMuted = (data: unknown): data is UserMuted =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 1 &&
  typeof (data as UserMuted).muted === 'boolean'
