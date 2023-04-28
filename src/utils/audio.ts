import {
  RemoteUserInfo,
  localUserInfo,
  LocalUserInfo,
  remoteUserInfos,
  setLocalUserInfo,
  RemoteUserAudioNodes,
} from './user'
import { MyOmit } from './utils'

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

// Audio Context
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

export function setUpAudioListener() {
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
  const pannerNode = remoteUserInfo.audioNodes?.pannerNode
  if (pannerNode === undefined) return

  pannerNode.positionX.setValueAtTime(remoteUserInfo.x, audioCtx.currentTime)
  pannerNode.positionZ.setValueAtTime(remoteUserInfo.y, audioCtx.currentTime)
  pannerNode.orientationX.setValueAtTime(
    directionX(remoteUserInfo.deg),
    audioCtx.currentTime
  )
  pannerNode.orientationZ.setValueAtTime(
    directionZ(remoteUserInfo.deg),
    audioCtx.currentTime
  )
}

export const setUpLocalUserAudioAnalyzer = () => {
  if (localUserInfo.stream === undefined) return

  const sourceNode = audioCtx.createMediaStreamSource(localUserInfo.stream)
  const analyserNode = audioCtx.createAnalyser()
  sourceNode.connect(analyserNode)
  setLocalUserInfo('audioNodes', { analyserNode })
}

export const initRemoteUserAudio = (
  remoteUserInfo: MyOmit<RemoteUserInfo, 'audioNodes'>
): RemoteUserAudioNodes => {
  if (remoteUserInfo.stream === undefined) {
    return { audioNodes: undefined }
  }

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
  const analyserNode = audioCtx.createAnalyser()

  // Connect
  sourceNode
    .connect(analyserNode)
    .connect(gainNode)
    .connect(pannerNode)
    .connect(audioCtx.destination)

  return { audioNodes: { sourceNode, analyserNode, gainNode, pannerNode } }
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

// Doorbell
export const playDoorbell = () => {
  const gainNode = audioCtx.createGain()
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)

  const oscillatorNode = audioCtx.createOscillator()
  oscillatorNode.type = 'sine'
  oscillatorNode.frequency.setValueAtTime(1000, audioCtx.currentTime)

  oscillatorNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillatorNode.start()
  oscillatorNode.stop(audioCtx.currentTime + 0.4)
}
