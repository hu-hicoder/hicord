/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { JSX, ParentComponent } from 'solid-js'
import { createEffect, createSignal } from 'solid-js'
import { LocalUserInfo } from '../../utils/user'
import clickOutsideDirective from '../../directives/clickOutside'
import UserAvatarIcon from './UserAvatarIcon'
const clickOutside = clickOutsideDirective

export const USER_ICON_WIDTH = 64
export const USER_ICON_HEIGHT = 64

const UserIcon: ParentComponent<{
  info: LocalUserInfo
  settings?: JSX.Element
}> = (props) => {
  let iconPositionDiv: HTMLDivElement | undefined
  let iconDiv: HTMLDivElement | undefined
  let imgElement: HTMLImageElement | undefined
  let userReactionElement: HTMLDivElement | undefined

  const [getShowSettings, setShowSettings] = createSignal(false)

  createEffect(() => {
    iconPositionDiv!.style.left = `${props.info.x - USER_ICON_WIDTH / 2}px`
    iconPositionDiv!.style.top = `${props.info.y - USER_ICON_HEIGHT / 2}px`
  })

  createEffect(() => {
    iconDiv!.style.transform = `rotate(${props.info.deg}deg)`
  })

  createEffect(() => {
    const file = props.info.originalImage
    if (file) {
      const srcUrl = window.URL.createObjectURL(file)
      imgElement!.src = srcUrl
    }
  })

  createEffect(() => {
    if (props.info.userReactionURIEncoded === undefined) {
      userReactionElement!.style.display = 'none'
    } else {
      userReactionElement!.style.removeProperty('display')
      userReactionElement!.textContent = decodeURI(
        props.info.userReactionURIEncoded
      )
    }
  })

  return (
    <div
      ref={iconPositionDiv}
      class="absolute w-16 flex flex-col"
      onClick={() => setShowSettings(true)}
      use:clickOutside={() => {
        setShowSettings(false)
      }}
    >
      {props.children}

      <div ref={iconDiv} class="avatar">
        <div class="w-16 h-16">
          {props.info?.originalImage ? (
            <img ref={imgElement} />
          ) : (
            <UserAvatarIcon avatar={props.info} />
          )}
        </div>
      </div>

      {getShowSettings() ? (
        <div class="absolute -top-12 w-40 text-center -right-12">
          {props.settings}
        </div>
      ) : null}

      <div class="text-center text-sm absolute w-40 -bottom-8 -right-12">
        {props.info?.userName}
      </div>
      <div
        ref={userReactionElement}
        class="text-center text-4xl w-16 absolute -top-12"
      />
      {props.info?.muted ?? true ? (
        <div class="swap-off material-symbols-outlined absolute text-xl -bottom-2 -left-2 w-6 h-6 leading-6 rounded-full text-center text-error bg-base-200 bg-opacity-50">
          mic_off
        </div>
      ) : undefined}
    </div>
  )
}

export default UserIcon
