import { localUserInfo } from './user'

export const goToMyLocation = () => {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  window.scroll(
    _localUserInfo.x - window.innerWidth / 2,
    _localUserInfo.y - window.innerHeight / 2
  )
}
