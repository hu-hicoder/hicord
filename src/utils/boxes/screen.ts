// import { UserName, localUserInfo } from './user'
import { createSignal } from 'solid-js'
import { MediaConnection } from 'skyway-js'
import { addOrUpdateInfoFromPrev } from '../info'
import { BoxInfo, BoxTypes } from './box'

export const [getScreenInfos, setScreenInfos] = createSignal<ScreenInfo[]>([])

export type ScreenInfo = {
  mStream: MediaStream
}

export const setScreenInfo = (screenInfo: ScreenInfo) => {
  setScreenInfos(
    addOrUpdateInfoFromPrev(
      screenInfo,
      (curr, info) => curr.mStream.id === info.mStream.id
    )
  )
}

export const setMediaStreamEventListener = (
  mediaConnection: MediaConnection
) => {
  mediaConnection.on('stream', (mStream: MediaStream) => {
    console.log('get remote media stream')
    setScreenInfo({
      mStream: mStream,
    })
  })
}

export type ScreenBoxInfo = BoxInfo & {
  mStreamId: string
  peerId: string
}

export const isScreenInfo = (data: unknown): data is ScreenInfo =>
  typeof data === 'object' &&
  data !== null &&
  Object.keys(data).length === 1 &&
  typeof (data as ScreenInfo).mStream === 'string'

// export function localScreenInfoFrom(chatRaw: ScreenRaw): ScreenInfo {
//   return {
//     userName: localUserInfo().userName,
//     chatGroup: chatRaw.chatGroup,
//     peerId: localUserInfo().peerId,
//     value: chatRaw.value,
//     date: new Date(),
//   }
// }

export const isScreenBoxInfo = (data: unknown): data is ScreenBoxInfo =>
  typeof data === 'object' &&
  data !== null &&
  (data as ScreenBoxInfo).boxType === BoxTypes.SCREEN &&
  typeof (data as ScreenBoxInfo).peerId === 'string' &&
  typeof (data as ScreenBoxInfo).mStreamId === 'string' &&
  typeof (data as ScreenBoxInfo).x === 'number' &&
  typeof (data as ScreenBoxInfo).y === 'number' &&
  typeof (data as ScreenBoxInfo).deg === 'number' &&
  typeof (data as ScreenBoxInfo).width === 'number' &&
  typeof (data as ScreenBoxInfo).height === 'number' &&
  typeof (data as ScreenBoxInfo).id === 'number'
