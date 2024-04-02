import { useEffect, useRef } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export const useOutsideClick = (ref: any, cb: any) => {
  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = cb;
  });

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // @ts-ignore
        callbackRef.current();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};
