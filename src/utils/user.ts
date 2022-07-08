import { createSignal } from 'solid-js'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()
export const [remoteUserInfos, setRemoteUserInfos] = createSignal<UserInfo[]>(
  []
)

export type UserInfo = UserCoord & {
  stream: MediaStream;
  peerId: string;
}

export type UserCoord = {
  // right-handed coordinate system
  x: number;
  y: number;
  deg: number;
}
