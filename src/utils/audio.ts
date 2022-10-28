import {
  RemoteUserAudioNodes,
  RemoteUserInfo,
  localUserInfo,
  LocalUserInfo,
  remoteUserInfos,
} from './user'

// Panner
const MAX_DISTANCE = 300
const REF_DISTANCE = 50
const ROLL_OFF = 1
const CONE_INNER_ANGLE = 90
const CONE_OUTER_ANGLE = 210
const CONE_OUTER_GAIN = 0.1

function directionX(deg: LocalUserInfo['deg']) {
  return Math.cos(Math.PI / 2 + (deg * Math.PI) / 180)
}

function directionZ(deg: LocalUserInfo['deg']) {
  return Math.sin(Math.PI / 2 + (deg * Math.PI) / 180)
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

export function setAudioListener() {
  // Listener
  const listener = audioCtx.listener
  listener.positionX.setValueAtTime(localUserInfo.x, audioCtx.currentTime)
  listener.positionZ.setValueAtTime(localUserInfo.y, audioCtx.currentTime)
  // listener.positionZ.value
  listener.forwardX.setValueAtTime(
    directionX(localUserInfo.deg),
    audioCtx.currentTime
  )
  listener.forwardY.setValueAtTime(0, audioCtx.currentTime)
  listener.forwardZ.setValueAtTime(
    directionZ(localUserInfo.deg),
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
    directionX(remoteUserInfo.deg),
    audioCtx.currentTime
  )
  remoteUserInfo.pannerNode.orientationZ.setValueAtTime(
    directionZ(remoteUserInfo.deg),
    audioCtx.currentTime
  )
}

export function initRemoteAudio(
  remoteUserInfo: Omit<RemoteUserInfo, keyof RemoteUserAudioNodes>
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
    orientationX: directionX(remoteUserInfo.deg),
    orientationZ: directionZ(remoteUserInfo.deg),
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

// talk box
export const muteOtherTalkBox = () => {
  const localTalkBoxId = localUserInfo.talkBoxId
  remoteUserInfos().forEach((remoteUser) => {
    // same talk box
    if (remoteUser.talkBoxId === localTalkBoxId) {
      if (!remoteUser.muted) {
        remoteUser.stream?.getAudioTracks().forEach((track) => {
          // eslint-disable-next-line no-param-reassign
          track.enabled = true
        })
      }
    } else {
      remoteUser.stream?.getAudioTracks().forEach((track) => {
        // eslint-disable-next-line no-param-reassign
        track.enabled = false
      })
    }
  })
}
