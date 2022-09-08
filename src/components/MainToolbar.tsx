import { addLocalUserReaction } from '../utils/reaction'
import { onMount } from 'solid-js'
import { createPopup, PopupPickerController } from '@picmo/popup-picker'
import { EmojiSelection } from 'picmo'
import { goToMyLocation } from '../utils/goToMyLocation'
import { localUserInfo, setLocalUserInfo } from '../utils/user'
import { sendLocalUserMutedToAll } from '../utils/send/sendLocalUserMuted'
import { screenCapture } from '../utils/screenCapture'
import LocationMove from './LocationMove'

const MainToolbar = () => {
  let reactionButtonElement: HTMLInputElement
  let mainToolbarElement: HTMLDivElement
  let picker: PopupPickerController

  onMount(() => {
    picker = createPopup(
      {
        rootElement: mainToolbarElement,
        showVariants: false, // 手間が増えるのでオフ
      },
      {
        triggerElement: reactionButtonElement,
        referenceElement: mainToolbarElement,
        position: 'top-end',
      }
    )
    picker.addEventListener(
      'emoji:select',
      (emojiSelection: EmojiSelection) => {
        addLocalUserReaction(encodeURI(emojiSelection.emoji))
      }
    )
  })

  const onClickReactionButton = () => {
    picker.open()
  }

  const onClickMicrophoneButton = () => {
    setLocalUserInfo((preInfo) => ({ ...preInfo, muted: !preInfo.muted }))
    sendLocalUserMutedToAll()
  }

  return (
    <div
      class="fixed sm:left-6 sm:bottom-6 left-4 bottom-4 tb-card"
      ref={mainToolbarElement}
    >
      <span
        ref={reactionButtonElement}
        class="material-symbols-outlined tb-item"
        onClick={() => onClickReactionButton()}
      >
        add_reaction
      </span>
      {/* daisyUIのswapでやろうとしたがうまくいかない */}
      {/* <label class="swap hover:bg-base-content rounded-lg"> */}
      {/* <input
        type="checkbox"
        onClick={() => onClickMicrophoneButton()}
        checked={localUserInfo()?.muted ?? true}
      /> */}
      {/* </label> */}
      {localUserInfo()?.muted ?? true ? (
        <div
          class="swap-off material-symbols-outlined tb-item tb-icon-on"
          onClick={() => onClickMicrophoneButton()}
        >
          mic_off
        </div>
      ) : (
        <div
          class="swap-on material-symbols-outlined tb-item tb-icon-on"
          onClick={() => onClickMicrophoneButton()}
        >
          mic
        </div>
      )}
      <span
        class="material-symbols-outlined tb-item"
        onClick={() => goToMyLocation()}
      >
        my_location
      </span>
      <span class="material-symbols-outlined tb-item" onClick={screenCapture}>
        screen_share
      </span>
      <LocationMove />
    </div>
  )
}

export default MainToolbar
