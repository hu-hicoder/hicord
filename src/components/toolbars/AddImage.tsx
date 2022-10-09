/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sendRoomBoxInfoToAll } from '../../utils/send/sendRoomBoxInfo'
import { ImageBoxInfo } from '../../utils/boxes/image'
import {
  BoxTypes,
  getRoomBoxInfos,
  setRoomBoxInfo,
} from '../../utils/boxes/box'
import { localUserInfo } from '../../utils/user'

const getImageSize = async (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const size = {
        width: img.naturalWidth,
        height: img.naturalHeight,
      }

      URL.revokeObjectURL(img.src)
      resolve(size)
    }

    img.onerror = (error) => {
      reject(error)
    }

    img.src = URL.createObjectURL(file)
  })
}

const AddImage = () => {
  let imageRef: HTMLInputElement | undefined

  const addImage = async () => {
    if (imageRef!.files?.length !== 1) return

    const file = imageRef!.files.item(0)
    if (file === null) return

    // image size
    const imageSize = await getImageSize(file)
    const MAX_SIZE = 500
    let width = imageSize.width
    let height = imageSize.height
    if (MAX_SIZE < width) {
      height = (MAX_SIZE * height) / width
      width = MAX_SIZE
    } else if (MAX_SIZE < height) {
      width = (MAX_SIZE * width) / height
      height = MAX_SIZE
    }

    const localUserPeerId = localUserInfo()?.peerId
    if (localUserPeerId === undefined) return

    const roomBox: ImageBoxInfo = {
      boxType: BoxTypes.IMAGE,
      id: getRoomBoxInfos().length + 1,
      x: 2048,
      y: 2048,
      deg: 0,
      width,
      height,
      editorPeerId: undefined,
      // Image Box
      image: file,
      peerId: localUserPeerId,
    }
    setRoomBoxInfo(roomBox)
    sendRoomBoxInfoToAll(roomBox)
    // Reset input
    imageRef!.value = ''
  }

  return (
    <label class="tb-item">
      <input
        class="hidden"
        type="file"
        ref={imageRef}
        accept="image/*"
        onInput={() => void addImage()}
      />
      <span class={'material-symbols-outlined'}>image</span>
    </label>
  )
}

export default AddImage
