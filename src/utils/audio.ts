import {
  UserInfo,
  RemoteUserAudioNodes,
  RemoteUserInfo,
  localUserInfo,
} from './user'

// Panner
const MAX_DISTANCE = 1000
const REF_DISTANCE = 1
const ROLL_OFF = 1
const CONE_INNER_ANGLE = 60
const CONE_OUTER_ANGLE = 120
const CONE_OUTER_GAIN = 0.1

function directionX(userInfo: UserInfo) {
  return Math.cos((userInfo.deg * Math.PI) / 180)
}

function directionZ(userInfo: UserInfo) {
  return Math.sin((userInfo.deg * Math.PI) / 180)
}

// Aucio Context
export let audioCtx: AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}
window.onload = function () {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  audioCtx = new AudioContext()
}

export function audioProcessing(
  localUserInfo: UserInfo,
  remoteUserInfo: UserInfo
): RemoteUserAudioNodes {
  setAudioListener()
  return initRemoteAudio(remoteUserInfo)
}

export function setAudioListener() {
  const _localUserInfo = localUserInfo()
  if (_localUserInfo === undefined) return
  // Listener
  const listener = audioCtx.listener
  listener.positionX.setValueAtTime(_localUserInfo.x, audioCtx.currentTime)
  listener.positionZ.setValueAtTime(_localUserInfo.y, audioCtx.currentTime)
  // listener.positionZ.value
  listener.forwardX.setValueAtTime(
    directionX(_localUserInfo),
    audioCtx.currentTime
  )
  listener.forwardY.setValueAtTime(0, audioCtx.currentTime)
  listener.forwardZ.setValueAtTime(
    directionZ(_localUserInfo),
    audioCtx.currentTime
  )
  listener.upX.setValueAtTime(0, audioCtx.currentTime)
  listener.upY.setValueAtTime(1, audioCtx.currentTime)
  listener.upZ.setValueAtTime(0, audioCtx.currentTime)
}

export function setPanner(remoteUserInfo: RemoteUserInfo) {
  remoteUserInfo.pannerNode.positionX.setValueAtTime(
    remoteUserInfo.x,
    audioCtx.currentTime
  )
  remoteUserInfo.pannerNode.positionZ.setValueAtTime(
    remoteUserInfo.y,
    audioCtx.currentTime
  )
  remoteUserInfo.pannerNode.orientationX.setValueAtTime(
    directionX(remoteUserInfo),
    audioCtx.currentTime
  )
  remoteUserInfo.pannerNode.orientationZ.setValueAtTime(
    directionZ(remoteUserInfo),
    audioCtx.currentTime
  )
}

export function initRemoteAudio(
  remoteUserInfo: UserInfo
): RemoteUserAudioNodes {
  const sourceNode = audioCtx.createMediaStreamSource(remoteUserInfo.stream)

  // Gain
  const gainNode = new GainNode(audioCtx)

  // Filter

  // Panner
  const pannerNode = new PannerNode(audioCtx, {
    panningModel: 'HRTF',
    distanceModel: 'linear',
    positionX: remoteUserInfo.x,
    positionZ: remoteUserInfo.y,
    // positionZ: 0,
    orientationX: directionX(remoteUserInfo),
    orientationZ: directionZ(remoteUserInfo),
    // orientationZ: 0,
    maxDistance: MAX_DISTANCE,
    refDistance: REF_DISTANCE,
    rolloffFactor: ROLL_OFF,
    coneInnerAngle: CONE_INNER_ANGLE,
    coneOuterAngle: CONE_OUTER_ANGLE,
    coneOuterGain: CONE_OUTER_GAIN,
  })

  // Analyser
  const analyser = audioCtx.createAnalyser()

  // Connect
  sourceNode
    .connect(analyser)
    .connect(gainNode)
    .connect(pannerNode)
    .connect(audioCtx.destination)

  return { sourceNode, analyser, gainNode, pannerNode }
}
