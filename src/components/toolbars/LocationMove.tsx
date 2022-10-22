import { createSignal } from 'solid-js'
import { localUserInfo, setLocalUserInfo } from '../../utils/user'
import { sendLocalUserCoordinateToAll } from '../../utils/send/sendLocalUserCoordinate'
import { setAudioListener } from '../../utils/audio'
import { Coordinate } from '../../utils/coordinate'

const options = {
  // enableHighAccuracy: true,
  // maximumAge: 3000,
  // timeout: 20000,
}

const error = () => {
  alert('位置情報を利用できません')
}

const POSITION_RATE = 6000000

const LocationMove = () => {
  const [getHasLocationMove, setHasLocationMove] = createSignal(false)
  const [getWatchID, setWatchID] = createSignal<number>()
  const [getBaseGeolocation, setBaseGeolocation] =
    createSignal<GeolocationCoordinates>()
  const [getBaseCoordinate, setBaseCoordinate] = createSignal<Coordinate>()
  // TODO use only for log
  const [getDx, setDx] = createSignal<number>(0.136543235)
  const [getDy, setDy] = createSignal<number>(0.765223542)

  const success = (position: GeolocationPosition) => {
    const currGeolocation = position.coords
    const baseGeolocation = getBaseGeolocation()
    if (baseGeolocation === undefined) return
    const baseCoordinate = getBaseCoordinate()
    if (baseCoordinate === undefined) return

    const dx =
      (currGeolocation.latitude - baseGeolocation.latitude) * POSITION_RATE
    const dy =
      (currGeolocation.longitude - baseGeolocation.longitude) * POSITION_RATE

    // log
    setDx(dx)
    setDy(dy)

    // set info
    setLocalUserInfo((prev) => {
      let deg = prev.deg
      if (position.coords.heading && !isNaN(position.coords.heading)) {
        deg = position.coords.heading
      }
      return {
        x: baseCoordinate.x + dx,
        y: baseCoordinate.y + dy,
        deg,
      }
    })

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
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // initialize
            setBaseGeolocation(position.coords)
            setBaseCoordinate({
              x: localUserInfo.x,
              y: localUserInfo.y,
              deg: localUserInfo.deg,
            })
          },
          error,
          options
        )
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
      <div>{getDx()}</div>
      <div>{getDy()}</div>
    </div>
  )
}

export default LocationMove
