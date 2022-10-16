/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, onMount, createEffect } from 'solid-js'
import { defaultUserAvatar, UserAvatar } from '../../utils/user'

function onColorChange(elements: NodeListOf<Element>, color: string) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement | null
    if (element !== null) {
      element.style.fill = color
    }
  }
}

function changeColors(obj: HTMLObjectElement, avatar: UserAvatar) {
  const svgDoc = obj.contentDocument
  if (svgDoc === null) return

  const mainColor = svgDoc.querySelectorAll(
    `*[style*='fill:${defaultUserAvatar.mainColor}']`
  )

  const subColor1 = svgDoc.querySelectorAll(
    `*[style*='fill:${defaultUserAvatar.subColor1}']`
  )
  const subColor2 = svgDoc.querySelectorAll(
    `*[style*='fill:${defaultUserAvatar.subColor2}']`
  )
  onColorChange(mainColor, avatar.mainColor)
  onColorChange(subColor1, avatar.subColor1)
  onColorChange(subColor2, avatar.subColor2)
}

const UserAvatarIcon: Component<{ avatar: UserAvatar | undefined }> = (
  props
) => {
  let objRef: HTMLObjectElement | undefined

  onMount(() => {
    objRef!.addEventListener(
      'load',
      () => {
        if (objRef !== undefined && props.avatar !== undefined)
          changeColors(objRef, props.avatar)
      },
      { once: true }
    )
  })

  createEffect(() => {
    if (props.avatar !== undefined) {
      changeColors(objRef!, props.avatar)
    }
  })

  return (
    <div>
      <object
        style={{ 'pointer-events': 'none' }}
        ref={objRef}
        type="image/svg+xml"
        data="./cat.svg"
        width={64}
        height={64}
      />
    </div>
  )
}

export default UserAvatarIcon
