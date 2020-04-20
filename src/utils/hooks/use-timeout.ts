import React, { useEffect, useRef } from 'react'

/**
 * Use setTimeout with Hooks in a declarative way.
 *
 * @see https://stackoverflow.com/a/59274757/3723993
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export default function useTimeout(
  callback: React.EffectCallback,
  delay: number
): void {
  const timeoutRef = useRef<number>()
  const callbackRef = useRef(callback)

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useEffect's deps, it will work fine but the
  // timeout will be reset.

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Set up the timeout:
  useEffect((): (() => void) => {
    timeoutRef.current = window?.setTimeout(() => callbackRef.current(), delay)
    return () => window?.clearTimeout(timeoutRef.current)
  }, [delay])
}
