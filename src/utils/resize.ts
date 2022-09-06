const createResizeObserver = (
  elements: Array<Element>,
  callback: (entries: ResizeObserverEntry[]) => void
) => {
  const resizeObserver = new ResizeObserver((entries) => {
    callback(entries)
  })

  elements.forEach((element) => {
    element && resizeObserver.observe(element)
  })

  return () => resizeObserver.disconnect()
}

export default createResizeObserver
