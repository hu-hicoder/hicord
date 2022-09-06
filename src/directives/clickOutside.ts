import { onCleanup } from 'solid-js'

declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      // use:clickOutside
      clickOutside: unknown
    }
  }
}

export default function clickOutside(el: HTMLElement, accessor) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.()
  document.body.addEventListener('click', onClick)

  onCleanup(() => document.body.removeEventListener('click', onClick))
}
