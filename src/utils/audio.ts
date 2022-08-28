import { UserInfo, RemoteUserAudioNodes } from './user'

// Panner
const MAX_DISTANCE = 100
const REF_DISTANCE = 1
const ROLL_OFF = 10
const INNER_CONE = 60
const OUTER_CONE = 90
const OUTER_GAIN = 0.3

export function directionX(deg: number) {
  return Math.cos((deg * Math.PI) / 180)
}

export function directionY(deg: number) {
  return Math.sin((deg * Math.PI) / 180)
}

const AudioContext = window.AudioContext
const audioCtx = new AudioContext()

export function audioProcessing(
  localUserInfo: UserInfo,
  remoteUserInfo: UserInfo
): RemoteUserAudioNodes {
  // Listener
  const listener = audioCtx.listener
  listener.positionX.value = localUserInfo.x
  listener.positionY.value = localUserInfo.y
  // listener.positionZ.value = 0
  listener.forwardX.value = Math.cos((localUserInfo.deg * Math.PI) / 180)
  listener.forwardY.value = Math.sin((localUserInfo.deg * Math.PI) / 180)
  // listener.forwardZ.value = 0
  // listener.upX.value = 0
  // listener.upY.value = 0
  // listener.upZ.value = 0

  return initRemoteAudio(remoteUserInfo)
}

export function initRemoteAudio(
  remoteUserInfo: UserInfo
): RemoteUserAudioNodes {
  const sourceNode = audioCtx.createMediaStreamSource(remoteUserInfo.stream)

  // Filter

  // Panner
  const pannerNode = new PannerNode(audioCtx, {
    panningModel: 'HRTF',
    distanceModel: 'linear',
    positionX: remoteUserInfo.x,
    positionY: remoteUserInfo.y,
    // positionZ: 0,
    orientationX: directionX(remoteUserInfo.x),
    orientationY: directionY(remoteUserInfo.y),
    // orientationZ: 0,
    maxDistance: MAX_DISTANCE,
    refDistance: REF_DISTANCE,
    rolloffFactor: ROLL_OFF,
    coneInnerAngle: INNER_CONE,
    coneOuterAngle: OUTER_CONE,
    coneOuterGain: OUTER_GAIN,
  })

  // Connect
  sourceNode.connect(pannerNode)
  pannerNode.connect(audioCtx.destination)

  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return { sourceNode, pannerNode }
}
