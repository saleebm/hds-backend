import { useRef } from "react";

export function useHoverIntent(onHover: (...args: any) => any, onHoverOut:(...args: any) => any, defer: boolean) {
  const timeout = useRef<any>();

  return {
    onMouseEnter: (...args: any) => {
      clearTimeout(timeout.current);

      if (defer) {
        timeout.current = setTimeout(() => onHover(...args), 200);
      } else {
        onHover(...args);
      }
    },
    onMouseLeave: (...args: any) => {
      clearTimeout(timeout.current);
      onHoverOut(...args);
    }
  };
}
