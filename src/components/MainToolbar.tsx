import { localUserInfo } from '../utils/user'

const MainToolbar = () => {
  const goToMyLocation = () => {
    window.scroll(
      localUserInfo().x - window.innerWidth / 2,
      localUserInfo().y - window.innerHeight / 2
    )
  }

  return (
    <div class="fixed sm:left-6 sm:bottom-6 left-4 bottom-4 tb-card">
      <span class="material-symbols-outlined tb-icon">add_reaction</span>
      <span class="material-symbols-outlined tb-icon tb-icon-on">mic</span>
      <span class="material-symbols-outlined tb-icon">screen_share</span>
      <span
        class="material-symbols-outlined tb-icon"
        onClick={() => goToMyLocation()}
      >
        my_location
      </span>
    </div>
  )
}

export default MainToolbar
