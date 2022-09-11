import type { Component } from 'solid-js'
import { createEffect } from 'solid-js'
import { UserInfo } from '../../utils/user'
// import catSvg from '../../../public/cat.svg'

function onColorChange(elements: NodeListOf<Element>, color: string) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement | null
    if (element !== null) {
      element.style.fill = color
    }
  }
}

const UserAvatar: Component<{ info: UserInfo }> = (props) => {
  let objRef: HTMLObjectElement
  let svgDoc: Document

  createEffect(() => {
    if (objRef) {
      svgDoc = objRef.contentDocument
      console.log(svgDoc)
      if (objRef.getSVGDocument()) {
        const mainColor = svgDoc.querySelectorAll("*[style*='fill:#ffffff']")
        const subColor1 = svgDoc.querySelectorAll("*[style*='fill:#f4a460']")
        const subColor2 = svgDoc.querySelectorAll("*[style*='fill:#696969']")
        console.log(mainColor.length)
        console.log(subColor1.length)
        console.log(subColor2.length)
        onColorChange(mainColor, '#0000FF')
        onColorChange(subColor1, '#FF0000')
        onColorChange(subColor2, '#00FF00')
      }
    }
    console.log(props.info.x)
  })

  // createEffect(() => {
  //   console.log(catSvg)
  //   console.log(catSvg.replaceAll('#696969', '#ffff00'))
  // }, [props.info])

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

export default UserAvatar
