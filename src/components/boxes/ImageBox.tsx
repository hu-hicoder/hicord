import { createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import { ImageBoxInfo } from '../../utils/boxes/image'
// import { getUserNameFromPeerId } from '../../utils/user'
import RoomBox from './RoomBox'

const ImageBox: Component<{ info: ImageBoxInfo }> = (props) => {
  let imageRef: HTMLImageElement | undefined

  createEffect(() => {
    if (props.info.image) {
      const binaryData = []

      binaryData.push(props.info.image)
      const srcUrl = window.URL.createObjectURL(
        new Blob(binaryData, { type: 'image/jpeg' })
      )
      if (imageRef) {
        imageRef.src = srcUrl
      }
    }
  })

  return (
    <RoomBox boxInfo={props.info} class="image-box">
      <img ref={imageRef} />

      {/* <div class="absolute left-2" style={{ top: '-1.5rem' }}>
        {getUserNameFromPeerId(props.info.peerId)}
      </div> */}
    </RoomBox>
  )
}

export default ImageBox
