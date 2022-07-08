import { UserInfo } from './user'

function directionX(deg: number) {
    return Math.cos(deg * Math.PI / 180)
}

function directionY(deg: number) {
    return Math.sin(deg * Math.PI / 180)
}

const audioCtx = new AudioContext()

export function audioProcessing(localUserInfo: UserInfo, remoteUserInfo: UserInfo) {
    const source = audioCtx.createMediaStreamSource(remoteUserInfo.stream)

    // Filter

    // Listener
    const listener = audioCtx.listener
    listener.positionX.value = localUserInfo.x
    listener.positionY.value = localUserInfo.y
    // listener.positionZ.value = 0
    listener.forwardX.value = Math.cos(localUserInfo.deg * Math.PI / 180)
    listener.forwardY.value = Math.sin(localUserInfo.deg * Math.PI / 180)
    // listener.forwardZ.value = 0
    // listener.upX.value = 0
    // listener.upY.value = 0
    // listener.upZ.value = 0
    // Panner
    const maxDistance = 10000
    const refDistance = 1
    const rollOff = 10
    const innerCone = 60
    const outerCone = 90
    const outerGain = 0.3
    const pannerNode = new PannerNode(audioCtx, {
        panningModel: 'HRTF',
        distanceModel: 'linear',
        positionX: remoteUserInfo.x,
        positionY: remoteUserInfo.y,
        // positionZ: 0,
        orientationX: directionX(remoteUserInfo.x),
        orientationY: directionY(remoteUserInfo.y),
        // orientationZ: 0,
        maxDistance: maxDistance,
        refDistance: refDistance,
        rolloffFactor: rollOff,
        coneInnerAngle: innerCone,
        coneOuterAngle: outerCone,
        coneOuterGain: outerGain
})

    // Connect
    source.connect(pannerNode)
    pannerNode.connect(audioCtx.destination)
}