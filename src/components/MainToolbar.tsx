import { addLocalUserReaction } from '../utils/reaction'
import { onMount } from 'solid-js'
import { createPopup, PopupPickerController } from '@picmo/popup-picker'
import { EmojiSelection } from 'picmo'
import { goToMyLocation } from '../utils/goToMyLocation'
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
      <span class="material-symbols-outlined tb-item tb-icon-on">mic</span>
      <span class="material-symbols-outlined tb-item" onClick={screenCapture}>
        screen_share
      </span>
      <span
        class="material-symbols-outlined tb-item"
        onClick={() => goToMyLocation()}
      >
        my_location
      </span>
      <LocationMove />
    </div>
  )
}

export default MainToolbar
