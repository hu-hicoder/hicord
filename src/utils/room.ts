import { SfuRoom } from 'skyway-js'
import { createSignal } from 'solid-js'
import {
  initialLocalUserInfo,
  setLocalUserInfo,
  setRemoteUserInfos,
} from './user'

export const ROOM_WIDTH = 4096
export const ROOM_HEIGHT = 4096

export const [room, setRoom] = createSignal<SfuRoom>()

export const leaveRoom = () => {
  const _room = room()
  if (_room) {
    _room.close()
    setRemoteUserInfos((prev) => {
      return prev.filter((userInfo) => {
        userInfo.stream?.getTracks().forEach((track) => track.stop())
        return false
      })
    })
  }
  setLocalUserInfo(initialLocalUserInfo())
  // setIsStarted(false)
  console.log('=== あなたが退出しました ===\n')
}
