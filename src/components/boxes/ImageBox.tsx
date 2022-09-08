import { createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import { ImageBoxInfo } from '../../utils/boxes/image'
import RoomBox from './RoomBox'
import { getUserNameFromPeerId } from '../../utils/user'

const ImageBox: Component<{ info: ImageBoxInfo }> = (props) => {
  let imageRef: HTMLImageElement
  createEffect(() => {
    const file = props.info.image
    let srcUrl = './dummy.png'
    if (file) {
      srcUrl = window.URL.createObjectURL(props.info.image)
    }

    imageRef.src = srcUrl
  })

  return (
    <RoomBox boxInfo={props.info} class="image-box">
      <img ref={imageRef} />

      <div class="absolute left-2" style={{ top: '-1.5rem' }}>
        {getUserNameFromPeerId(props.info.peerId)}
      </div>
    </RoomBox>
  )
}

export default ImageBox