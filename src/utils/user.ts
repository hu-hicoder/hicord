import { NIL as NIL_UUID } from 'uuid'
import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Coordinate } from './coordinate'
import { addOrUpdateInfoFromPrev } from './info'
import { ROOM_HEIGHT, ROOM_WIDTH } from './room'

export const defaultUserAvatar = {
  mainColor: '#ffffff',
  subColor1: '#f4a460',
  subColor2: '#696969',
}

const RANDOM_VALUE = 96

export const initialLocalUserInfo = () => ({
  stream: undefined,
  audioNodes: undefined,
  peerId: undefined,
  talkBoxId: NIL_UUID,
  x:
    ROOM_WIDTH / 2 +
    Math.floor(Math.random() * RANDOM_VALUE) -
    RANDOM_VALUE / 2,
  y: ROOM_HEIGHT / 2 - Math.floor(Math.random() * RANDOM_VALUE),
  deg: 0,
  userName: localStorage.getItem('localUserName') ?? 'No Name',
  muted: true,
  ...defaultUserAvatar, // TODO: 参照になってるから元が変更されるかも
})

export const [localUserInfo, setLocalUserInfo] = createStore<LocalUserInfo>(
  initialLocalUserInfo()
)

export const [remoteUserInfos, setRemoteUserInfos] = createSignal<
  RemoteUserInfo[]
>([])

export const setRemoteUserInfo = (remoteUserInfo: RemoteUserInfo) => {
  setRemoteUserInfos(
    addOrUpdateInfoFromPrev(
      remoteUserInfo,
      (curr, info) => curr.peerId === info.peerId
    )
  )
}

export type LocalUserInfo = {
  peerId: string | undefined
  stream: MediaStream | undefined
} & LocalUserAudioNodes &
  UserInfoBaseType extends infer T
  ? { [Key in keyof T]: T[Key] }
  : never

export type RemoteUserInfo = {
  peerId: string
  stream: MediaStream | undefined
} & RemoteUserAudioNodes &
  UserInfoBaseType extends infer T
  ? { [Key in keyof T]: T[Key] }
  : never

export type UserInfoBaseType = TalkBoxId &
  Coordinate &
  UserName &
  UserOriginalAvatar &
  UserAvatar &
  UserReaction &
  UserMuted

export type LocalUserAudioNodes = {
  audioNodes:
    | {
        analyserNode: AnalyserNode
      }
    | undefined
}

export type RemoteUserAudioNodes = {
  audioNodes:
    | {
        sourceNode: MediaStreamAudioSourceNode
        analyserNode: AnalyserNode
        gainNode: GainNode
        pannerNode: PannerNode
      }
    | undefined
}

export type TalkBoxId = {
  /**
   * NIL_UUID: main room, 1~: talk box id
   */
  talkBoxId: string
}

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
  if (peerId === localUserInfo.peerId) {
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
