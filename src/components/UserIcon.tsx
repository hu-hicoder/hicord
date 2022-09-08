import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { UserInfo } from '../utils/user'
export const USER_ICON_WIDTH = 128
export const USER_ICON_HEIGHT = 128

const UserIcon: Component<{ info: UserInfo }> = (props) => {
  let iconPositionDiv: HTMLDivElement
  let iconDiv: HTMLDivElement
  let imgElement: HTMLImageElement
  let userReactionElement: HTMLDivElement

  createEffect(() => {
    iconPositionDiv.style.left = `${props.info.x - USER_ICON_WIDTH / 2}px`
    iconPositionDiv.style.top = `${props.info.y - USER_ICON_HEIGHT / 2}px`
  })

  createEffect(() => {
    iconDiv.style.transform = `rotate(${props.info.deg}deg)`
  })

  createEffect(() => {
    const file = props.info.image
    let srcUrl = './dummy.png'
    if (file) {
      srcUrl = window.URL.createObjectURL(props.info.image)
    }

    imgElement.src = srcUrl
  })

  createEffect(() => {
    if (props.info.userReactionURIEncoded === undefined) {
      userReactionElement.style.display = 'none'
    } else {
      userReactionElement.style.removeProperty('display')
      userReactionElement.textContent = decodeURI(
        props.info.userReactionURIEncoded
      )
    }
  })

  return (
    <div ref={iconPositionDiv} class="absolute w-32 h-32 flex flex-col">
      <div ref={iconDiv} class="avatar">
        <div class="w-32 mask mask-squircle">
          <img ref={imgElement} />
        </div>
      </div>

      <div
        class="text-center w-32 absolute"
        style={{
          bottom: `${-USER_ICON_HEIGHT / 4}px`,
        }}
      >
        {props.info.userName}
      </div>
      <div
        ref={userReactionElement}
        class="text-center text-6xl w-32 absolute"
        style={{
          top: `${-USER_ICON_HEIGHT / 2}px`,
        }}
      />
      {props.info.muted ? (
        <div class="swap-off material-symbols-outlined absolute bottom-0">
          mic_off
        </div>
      ) : undefined}
    </div>
  )
}

export default UserIcon
