import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<
  RemoteUserInfo[]
>([])

export type UserInfo = UserCoordinate &
  UserName & {
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
