import type { ParentComponent } from 'solid-js'
import { createEffect } from 'solid-js'
import { UserInfo } from '../utils/user'
export const USER_ICON_WIDTH = 128
export const USER_ICON_HEIGHT = 128

const UserIcon: ParentComponent<{ info: UserInfo }> = (props) => {
  let iconPositionDiv: HTMLDivElement
  let iconDiv: HTMLDivElement

  createEffect(() => {
    iconPositionDiv.style.left = `${props.info.x}px`
    iconPositionDiv.style.top = `${props.info.y}px`
  })

  createEffect(() => {
    iconDiv.style.transform = `rotate(${props.info.deg}deg)`
  })

  return (
    <div
      ref={iconPositionDiv}
      class="absolute"
      style={{
        height: `${USER_ICON_HEIGHT}px`,
        width: `${USER_ICON_WIDTH}px`,
      }}
    >
      <div
        ref={iconDiv}
        class="bg-blue-600 top-3 left-5"
        style={{
          'clip-path': 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%)',
          height: `${USER_ICON_HEIGHT}px`,
          width: `${USER_ICON_WIDTH}px`,
        }}
      >
        {props.children}
      </div>
      <div class="text-center">{props.info.userName}</div>
    </div>
  )
}

export default UserIcon
