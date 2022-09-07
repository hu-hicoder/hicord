import { localUserInfo } from './user'

export const goToMyLocation = () => {
  window.scroll(
    localUserInfo().x - window.innerWidth / 2,
    localUserInfo().y - window.innerHeight / 2
  )
}
