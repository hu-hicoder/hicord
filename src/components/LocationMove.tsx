import { createSignal } from 'solid-js'
import { localUserInfo, setLocalUserInfo } from '../utils/user'
import { sendLocalUserCoordinateToAll } from '../utils/send/sendLocalUserCoordinate'
import { setListener as setAudioListener } from '../utils/audio'
import { updateDeg } from '../utils/coordinate'

const options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}

const error = () => {
  alert('位置情報を利用できません')
}

const LocationMove = () => {
  const [getHasLocationMove, setHasLocationMove] = createSignal(false)
  const [getWatchID, setWatchID] = createSignal<number>()
  const [getBaseCoord, setBaseCoord] = createSignal<GeolocationCoordinates>()
  const success = (position: GeolocationPosition) => {
    const dx = (position.coords.latitude - getBaseCoord().latitude) * 200000
    const dy = (position.coords.longitude - getBaseCoord().longitude) * 200000
    console.log(
      position.coords.latitude,
      position.coords.longitude,
      position.coords.heading
    )

    // set info
    setLocalUserInfo((preUserInfo) => {
      return {
        ...preUserInfo,
        x: preUserInfo.x + dx,
        y: preUserInfo.y + dy,
        deg: updateDeg(dx, dy, preUserInfo.deg),
      }
    })

    // set audio listener
    setAudioListener(localUserInfo())

    sendLocalUserCoordinateToAll()
    // update BaseCoord
    setBaseCoord(position.coords)
  }

  const clickLocationMove = () => {
    if (getHasLocationMove()) {
      if (getWatchID()) {
        navigator.geolocation.clearWatch(getWatchID())
      }
      setHasLocationMove(false)
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setBaseCoord(position.coords)
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
