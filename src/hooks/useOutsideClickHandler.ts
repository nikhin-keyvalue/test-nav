// This hook will help in capturing outside click using a ref passed to that particular div

import { useEffect, useRef, useState } from 'react';

/**
 * Hook that updates the isClickOutside state
 * if a click is registered outside a div with the ref returned
 */
const useOutsideClickHandler = () => {
  const [isClickedOutside, setIsClickedOutside] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsClickedOutside(true);
    } else {
      setIsClickedOutside(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return { ref, isClickedOutside, setIsClickedOutside };
};

export { useOutsideClickHandler };
