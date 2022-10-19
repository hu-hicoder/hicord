import { createSignal } from 'solid-js'
import { setLocalUserInfo } from '../../utils/user'
import { sendLocalUserCoordinateToAll } from '../../utils/send/sendLocalUserCoordinate'
import { setAudioListener } from '../../utils/audio'
import { updateDeg } from '../../utils/coordinate'

const options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}

const error = () => {
  alert('位置情報を利用できません')
}

const POSITION_RATE = 6000000

const LocationMove = () => {
  const [getHasLocationMove, setHasLocationMove] = createSignal(false)
  const [getWatchID, setWatchID] = createSignal<number>()
  const [getBaseCoordinate, setBaseCoordinate] =
    createSignal<GeolocationCoordinates>()

  const success = (position: GeolocationPosition) => {
    const baseCoordinate = getBaseCoordinate()
    if (baseCoordinate === undefined) return

    const dx =
      (position.coords.latitude - baseCoordinate.latitude) * POSITION_RATE
    const dy =
      (position.coords.longitude - baseCoordinate.longitude) * POSITION_RATE
    console.log(
      position.coords.latitude,
      position.coords.longitude,
      position.coords.heading
    )

    // set info
    setLocalUserInfo((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
      deg: updateDeg(dx, dy, prev.deg),
    }))

    // set audio listener
    setAudioListener()

    sendLocalUserCoordinateToAll()
    // update BaseCoord
    setBaseCoordinate(position.coords)
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
          setBaseCoordinate(position.coords)
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
