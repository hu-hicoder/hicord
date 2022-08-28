import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<
  RemoteUserInfo[]
>([])

export type UserCoordinate = {
  // right-handed coordinate system
  x: number
  y: number
  deg: number
}

export type UserInfo = UserCoordinate & {
  stream: MediaStream
  peerId: string
}

export type RemoteUserAudioNodes = {
  sourceNode: MediaStreamAudioSourceNode
  gainNode: GainNode
  pannerNode: PannerNode
}

export type RemoteUserInfo = UserInfo & RemoteUserAudioNodes
