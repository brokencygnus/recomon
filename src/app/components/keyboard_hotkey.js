import { useEffect, useCallback } from 'react'

export default function KeyboardHotkey({hotkey, callback}) {
  // https://stackoverflow.com/questions/37440408/how-to-detect-esc-key-press-in-react-and-how-to-handle-it
  const hotkeyFunction = useCallback((event) => {
    if (event.key === hotkey) {
      callback()
    }
  }, []);
  
  useEffect(() => {
    document.addEventListener("keydown", hotkeyFunction, false);

    return () => {
      document.removeEventListener("keydown", hotkeyFunction, false);
    };
  }, [hotkeyFunction]);
}