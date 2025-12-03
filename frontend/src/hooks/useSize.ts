import * as React from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import { useState } from 'react'


export const useSize = (target : React.RefObject<HTMLElement | SVGAElement>) => {
  const [size, setSize] = useState<DOMRect | undefined>()

  React.useLayoutEffect(() => {
    setSize(target?.current?.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry : ResizeObserverEntry) => setSize(entry.contentRect))
  return size
}


