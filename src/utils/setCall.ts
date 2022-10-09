import { ScreenBoxMediaMetadata } from '../components/boxes/ScreenBox'
import { PEER } from '../components/Room'
import { getScreenInfos } from './boxes/screen'

export const setCall = () => {
  PEER.on('call', (mediaConnection) => {
    console.log('get call', mediaConnection.metadata)

    getScreenInfos().forEach((screen) => {
      if (
        screen.mStream.id ===
        (mediaConnection.metadata as ScreenBoxMediaMetadata).mStreamId
      ) {
        mediaConnection.answer(screen.mStream)
      }
    })
  })
}
