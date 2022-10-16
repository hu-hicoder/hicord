import { Accessor, onCleanup } from 'solid-js'

declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      // use:clickOutside
      clickOutside: unknown
    }
  }
}

export default function clickOutside(
  element: HTMLElement,
  accessor: Accessor<() => void>
) {
  const onClick = (e: MouseEvent) =>
    !element.contains(e.target as Node) && accessor()?.()
  document.body.addEventListener('click', onClick)

  onCleanup(() => document.body.removeEventListener('click', onClick))
}
