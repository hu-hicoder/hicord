import { createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import { ImageBoxInfo } from '../../utils/boxes/image'
import { getUserNameFromPeerId } from '../../utils/user'
import RoomBox from './RoomBox'

const ImageBox: Component<{ info: ImageBoxInfo }> = (props) => {
  let imageRef: HTMLImageElement | undefined

  createEffect(() => {
    const srcUrl = window.URL.createObjectURL(props.info.image)

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    imageRef!.src = srcUrl
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
