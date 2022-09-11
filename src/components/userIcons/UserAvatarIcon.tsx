import { Component, onMount } from 'solid-js'
import { createEffect } from 'solid-js'
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

  const mainColor = svgDoc.querySelectorAll(
    `*[style*='fill:${defaultUserAvatar.mainColor}']`
  )
  console.log('main c', mainColor.length)
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

const UserAvatarIcon: Component<{ avatar: UserAvatar }> = (props) => {
  let objRef: HTMLObjectElement

  onMount(() => {
    if (objRef) {
      console.log('on mount')
      objRef.addEventListener(
        'load',
        () => changeColors(objRef, props.avatar),
        { once: true }
      )
    }
  })

  createEffect(() => {
    if (objRef) {
      console.log('add event lis')
      changeColors(objRef, props.avatar)
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
