/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { onMount, onCleanup } from 'solid-js'
import type { Component } from 'solid-js'

const WIDTH = 64
const HEIGHT = 32

const VisualizeAudio: Component<{ analyser: AnalyserNode }> = (props) => {
  let canvas: HTMLCanvasElement | undefined

  onMount(() => {
    const canvasCtx = canvas!.getContext('2d')
    let frame = requestAnimationFrame(loop)

    props.analyser.fftSize = 1024
    const bufferLength = props.analyser.fftSize
    console.log(bufferLength)
    const dataArray = new Float32Array(bufferLength)

    function loop() {
      if (canvasCtx === null) return
      frame = requestAnimationFrame(loop)

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      props.analyser.getFloatTimeDomainData(dataArray)

      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)'
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

      canvasCtx.lineWidth = 1
      canvasCtx.strokeStyle = 'rgba(10, 10, 10, 0.125)'

      canvasCtx.beginPath()

      const sliceWidth = (WIDTH * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * 200.0
        const y = HEIGHT / 2 + v

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas!.width, canvas!.height / 2)
      canvasCtx.stroke()
    }

    onCleanup(() => cancelAnimationFrame(frame))
  })

  return <canvas ref={canvas} width={WIDTH} height={HEIGHT} />
}

export default VisualizeAudio
