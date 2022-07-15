import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<UserInfo[]>(
  []
)

export type UserInfo = UserCoordinate & {
  stream: MediaStream
  peerId: string
}

export type UserCoordinate = {
  // right-handed coordinate system
  x: number
  y: number
  deg: number
}
