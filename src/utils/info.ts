type returnType<T> = (prev: Array<T>) => Array<T>

export function addOrUpdateInfoFromPrev<T>(
  info: T,
  isEqual: (curr: T, info: T) => boolean
): returnType<T> {
  return (prev) => {
    let newInfo = true
    const infos = prev.map((curr) => {
      if (isEqual(curr, info)) {
        newInfo = false
        return info
      }
      return curr
    })

    if (newInfo) {
      infos.push(info)
    }

    return infos
  }
}
