import { BoxInfo, BoxTypes } from './box'

export type ImageBoxInfo = BoxInfo & {
  peerId: string
  image: File
}

export const isImageBoxInfo = (data: unknown): data is ImageBoxInfo =>
  typeof data === 'object' &&
  data !== null &&
  (data as ImageBoxInfo).boxType === BoxTypes.IMAGE &&
  typeof (data as ImageBoxInfo).peerId === 'string' &&
  typeof (data as ImageBoxInfo).image === 'object' &&
  typeof (data as ImageBoxInfo).x === 'number' &&
  typeof (data as ImageBoxInfo).y === 'number' &&
  typeof (data as ImageBoxInfo).deg === 'number' &&
  typeof (data as ImageBoxInfo).width === 'number' &&
  typeof (data as ImageBoxInfo).height === 'number' &&
  typeof (data as ImageBoxInfo).id === 'number'
