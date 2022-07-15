import type { ParentComponent } from 'solid-js'
import { createEffect } from 'solid-js'
import { UserInfo } from '../utils/user'
export const USER_ICON_WIDTH = 128
export const USER_ICON_HEIGHT = 128

const UserIcon: ParentComponent<{ info: UserInfo }> = (props) => {
  let iconDiv: HTMLDivElement

  createEffect(() => {
    iconDiv.style.left = `${props.info.x}px`
    iconDiv.style.top = `${props.info.y}px`
    iconDiv.style.transform = `rotate(${props.info.deg}deg)`
  })

  return (
    <div
      ref={iconDiv}
      class="absolute bg-blue-600 top-3 left-5"
      style={{
        'clip-path': 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%)',
        height: `${USER_ICON_HEIGHT}px`,
        width: `${USER_ICON_WIDTH}px`,
      }}
    >
      {props.children}
    </div>
  )
}

export default UserIcon
