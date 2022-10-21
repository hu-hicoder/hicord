import { createSignal } from 'solid-js'
import { localUserInfo, setLocalUserInfo } from '../../utils/user'
import { sendLocalUserCoordinateToAll } from '../../utils/send/sendLocalUserCoordinate'
import { setAudioListener } from '../../utils/audio'
import { Coordinate, updateDeg } from '../../utils/coordinate'

const options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}

const error = () => {
  alert('位置情報を利用できません')
}

const POSITION_RATE = 4000000

const LocationMove = () => {
  const [getHasLocationMove, setHasLocationMove] = createSignal(false)
  const [getWatchID, setWatchID] = createSignal<number>()
  const [getBaseGeolocation, setBaseGeolocation] =
    createSignal<GeolocationCoordinates>()
  const [getBaseCoordinate, setBaseCoordinate] = createSignal<Coordinate>()

  const success = (position: GeolocationPosition) => {
    const baseGeolocation = getBaseGeolocation()
    if (baseGeolocation === undefined) return
    const baseCoordinate = getBaseCoordinate()
    if (baseCoordinate === undefined) return

    const dx =
      (position.coords.latitude - baseGeolocation.latitude) * POSITION_RATE
    const dy =
      (position.coords.longitude - baseGeolocation.longitude) * POSITION_RATE

    // set info
    setLocalUserInfo((prev) => ({
      x: baseCoordinate.x + dx,
      y: baseCoordinate.y + dy,
      // TODO: change degree
      deg: prev.deg,
    }))

    // set audio listener
    setAudioListener()
    // send local user coordinate
    sendLocalUserCoordinateToAll()
  }

  const clickLocationMove = () => {
    if (getHasLocationMove()) {
      const watchID = getWatchID()
      if (watchID) {
        navigator.geolocation.clearWatch(watchID)
      }
      setHasLocationMove(false)
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setBaseGeolocation(position.coords)
          setBaseCoordinate(localUserInfo)
        })
        // watch position
        const watchID = navigator.geolocation.watchPosition(
          success,
          error,
          options
        )
        setWatchID(watchID)
        setHasLocationMove(true)
      } else {
        console.log('geolocationを取得することができません')
      }
    }
  }

  return (
    <div>
      <span
        class={`material-symbols-outlined tb-item ${
          getHasLocationMove() ? 'tb-item-on' : ''
        }`}
        onClick={clickLocationMove}
      >
        person_pin_circle
      </span>
    </div>
  )
}

export default LocationMove
