import { onMount } from 'solid-js'
import { createPopup, PopupPickerController } from '@picmo/popup-picker'
import { EmojiSelection } from 'picmo'
import { addLocalUserReaction } from '../../utils/reaction'
import { goToMyLocation } from '../../utils/goToMyLocation'
import { localUserInfo, setLocalUserInfo } from '../../utils/user'
import { sendLocalUserMutedToAll } from '../../utils/send/sendLocalUserMuted'
import { screenCapture } from '../../utils/screenCapture'
import LocationMove from './LocationMove'
import AddImage from './AddImage'

const MainToolbar = () => {
  let reactionButtonElement: HTMLInputElement | undefined
  let mainToolbarElement: HTMLDivElement | undefined
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
    void picker.open()
  }

  const onClickMicrophoneButton = () => {
    if (localUserInfo.stream === undefined) {
      if (localUserInfo.muted === true) {
        // TODO: あとから有効化されていた場合streamとaudioNodesをセットしてミュート解除する
      }
      return
    }
    setLocalUserInfo('muted', (prev) => !prev)
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
      <span
        class="material-symbols-outlined tb-item"
        onClick={() => goToMyLocation()}
      >
        my_location
      </span>
      {localUserInfo.muted ? (
        <div
          class="material-symbols-outlined tb-item tb-item-off"
          onClick={() => onClickMicrophoneButton()}
        >
          mic_off
        </div>
      ) : (
        <div
          class="material-symbols-outlined tb-item tb-item-on"
          onClick={() => onClickMicrophoneButton()}
        >
          mic
        </div>
      )}
      <AddImage />
      <span
        class="material-symbols-outlined tb-item hidden md:block"
        onClick={() => void screenCapture()}
      >
        screen_share
      </span>
      <LocationMove />
    </div>
  )
}

export default MainToolbar
