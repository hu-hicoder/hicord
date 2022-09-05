export function createOutsideClick(ref: HTMLElement, callback: () => void) {
  function handleClickOutside(event) {
    if (ref && !ref.contains(event.target)) {
      callback()
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}
