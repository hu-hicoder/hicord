import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<
  RemoteUserInfo[]
>([])
import { Coordinate } from './coordinate'

export type UserInfo = Coordinate &
  UserName &
  UserOriginalAvatar &
  UserAvatar &
  UserReaction &
  UserMuted & {
    stream: MediaStream
    peerId: string
  }

export type RemoteUserAudioNodes = {
  sourceNode: MediaStreamAudioSourceNode
  analyser: AnalyserNode
  gainNode: GainNode
  pannerNode: PannerNode
}

export type RemoteUserInfo = UserInfo & RemoteUserAudioNodes

export type UserName = {
  userName: string
}

export type UserOriginalAvatar = {
  originalImage?: File
}

export type UserAvatar = {
  mainColor: string
  subColor1: string
  subColor2: string
}
export const defaultUserAvatar = {
  mainColor: '#ffffff',
  subColor1: '#f4a460',
  subColor2: '#696969',
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
export const isUserOriginalAvatar = (
  data: unknown
): data is UserOriginalAvatar =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 1 &&
  (data as UserOriginalAvatar).originalImage !== null

export const isUserAvatar = (data: unknown): data is UserAvatar =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 3 &&
  typeof (data as UserAvatar).mainColor === 'string' &&
  typeof (data as UserAvatar).subColor1 === 'string' &&
  typeof (data as UserAvatar).subColor2 === 'string'

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

export const getUserNameFromPeerId = (peerId: string): string => {
  if (peerId === localUserInfo().peerId) {
    return 'あなた'
  } else {
    const initialValue = peerId
    return remoteUserInfos().reduce((previousValue, currUser) => {
      if (currUser.peerId === peerId) {
        return currUser.userName
      }
      return previousValue
    }, initialValue)
  }
}
