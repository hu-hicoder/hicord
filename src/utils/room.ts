import { SfuRoom } from 'skyway-js'
import { createSignal } from 'solid-js'
import { setRemoteUserInfos, setLocalUserInfo } from './user'

export const [room, setRoom] = createSignal<SfuRoom>()

export const leaveRoom = () => {
  if (room()) {
    room().close()
    setRemoteUserInfos((prev) => {
      return prev.filter((userInfo) => {
        userInfo.stream.getTracks().forEach((track) => track.stop())
        return false
      })
    })
  }
  setLocalUserInfo()
  // setIsStarted(false)
  console.log('=== あなたが退出しました ===\n')
}
