/**
 * 座標
 * right-handed coordinate system
 */
export type Coordinate = {
  x: number
  y: number
  deg: number
}

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
