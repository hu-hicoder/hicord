import { room } from '../components/Room'
import { setRemoteUserInfos, setLocalUserInfo } from './user'

export const onEnd = () => {
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
