import { useEffect, useState } from "react";

function useClickOutside(ref, initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  console.log(ref, " at hooks");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, ref]);

  return [isOpen, setIsOpen];
}

export default useClickOutside;
