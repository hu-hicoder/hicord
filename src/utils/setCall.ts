import { PEER } from '../components/Room'
import { getScreenInfos } from './boxes/screen'

export const setCall = () => {
  PEER.on('call', (mediaConnection) => {
    console.log('get call', mediaConnection.metadata)

    getScreenInfos().forEach((screen) => {
      if (screen.mStream.id === mediaConnection.metadata.mStreamId) {
        mediaConnection.answer(screen.mStream)
      }
    })
  })
}
