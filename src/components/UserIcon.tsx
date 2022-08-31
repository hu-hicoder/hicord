import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { UserInfo } from '../utils/user'
export const USER_ICON_WIDTH = 128
export const USER_ICON_HEIGHT = 128

const UserIcon: Component<{ info: UserInfo }> = (props) => {
  let iconPositionDiv: HTMLDivElement
  let iconDiv: HTMLDivElement
  let imgElement: HTMLImageElement

  createEffect(() => {
    iconPositionDiv.style.left = `${props.info.x}px`
    iconPositionDiv.style.top = `${props.info.y}px`
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

  return (
    <div ref={iconPositionDiv} class="absolute w-32 h-32 flex flex-col">
      <div ref={iconDiv} class="avatar">
        <div class="w-32 mask mask-squircle">
          <img ref={imgElement} />
        </div>
      </div>

      <div class="text-center">{props.info.userName}</div>
    </div>
  )
}

export default UserIcon
