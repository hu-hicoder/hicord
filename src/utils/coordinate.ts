import { Size } from './size'

/**
 * 座標
 * right-handed coordinate system
 */
export type Coordinate = {
  x: number
  y: number
  deg: number
}

// -90 ~ 270
export const updateDeg = (dx: number, dy: number, deg: number) => {
  if (4 < dx ** 2 + dy ** 2) {
    let r = Math.atan2(dy, dx)
    if (r < 0) {
      r = r + 2 * Math.PI
    }
    return Math.floor((r * 360) / (2 * Math.PI)) - 90
  }
  return deg
}

const left = (x: Coordinate['x']) => {
  return x
}
const right = (x: Coordinate['x'], width: Size['width']) => {
  return x + width
}
const top = (y: Coordinate['y']) => {
  return y
}
const bottom = (y: Coordinate['y'], height: Size['height']) => {
  return y + height
}

const leftRightTopBottom = (
  x: Coordinate['x'],
  y: Coordinate['y'],
  width: Size['width'],
  height: Size['height']
) => {
  return [left(x), right(x, width), top(y), bottom(y, height)]
}

export const collision = (
  x1: Coordinate['x'],
  y1: Coordinate['y'],
  width1: Size['width'],
  height1: Size['height'],
  x2: Coordinate['x'],
  y2: Coordinate['y'],
  width2: Size['width'],
  height2: Size['height']
): boolean => {
  const [left1, right1, top1, bottom1] = leftRightTopBottom(
    x1,
    y1,
    width1,
    height1
  )
  const [left2, right2, top2, bottom2] = leftRightTopBottom(
    x2,
    y2,
    width2,
    height2
  )
  if (left1 < right2 && top1 < bottom2 && right1 > left2 && bottom1 > top2) {
    return true
  } else {
    return false
  }
}
