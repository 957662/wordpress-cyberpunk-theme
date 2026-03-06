/**
 * useClickOutside Hook
 *
 * Detects clicks outside of a specified element.
 * Useful for closing dropdowns, modals, and popups when clicking outside.
 */

import { useEffect, RefObject } from 'react';

function useClickOutside(
  refs: RefObject<Element> | RefObject<Element>[],
  callback: () => void,
  options: { disabled?: boolean } = {}
): void {
  const { disabled = false } = options;

  useEffect(() => {
    if (disabled) return;

    const handleClick = (event: MouseEvent) => {
      const refArray = Array.isArray(refs) ? refs : [refs];

      // Check if click is outside all refs
      const isOutside = refArray.every((ref) => {
        if (!ref.current) return true;
        return !ref.current.contains(event.target as Node);
      });

      if (isOutside) {
        callback();
      }
    };

    // Use mousedown for faster response
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [refs, callback, disabled]);
}

export default useClickOutside;

/**
 * Usage examples:
 *
 * // 1. Close dropdown when clicking outside
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(dropdownRef, () => setIsOpen(false));
 *
 *   return (
 *     <div ref={dropdownRef} className="dropdown">
 *       <button onClick={() => setIsOpen(!isOpen)}>
 *         Toggle
 *       </button>
 *       {isOpen && (
 *         <div className="dropdown-menu">
 *           <a href="#">Option 1</a>
 *           <a href="#">Option 2</a>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 *
 * // 2. Close modal when clicking outside
 * function Modal({ onClose }) {
 *   const modalRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(modalRef, onClose);
 *
 *   return (
 *     <div className="modal-overlay">
 *       <div ref={modalRef} className="modal">
 *         <h2>Modal Title</h2>
 *         <p>Modal content</p>
 *         <button onClick={onClose}>Close</button>
 *       </div>
 *     </div>
 *   );
 * }
 *
 * // 3. Multiple refs (close dropdown when clicking outside both button and menu)
 * function MultiRefDropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *   const menuRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside([buttonRef, menuRef], () => setIsOpen(false));
 *
 *   return (
 *     <div>
 *       <button
 *         ref={buttonRef}
 *         onClick={() => setIsOpen(!isOpen)}
 *       >
 *         Toggle
 *       </button>
 *       {isOpen && (
 *         <div ref={menuRef} className="dropdown-menu">
 *           <a href="#">Option 1</a>
 *           <a href="#">Option 2</a>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 *
 * // 4. Conditional behavior
 * function ConditionalDropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const [disabled, setDisabled] = useState(false);
 *   const ref = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(
 *     ref,
 *     () => setIsOpen(false),
 *     { disabled } // Won't close if disabled is true
 *   );
 *
 *   return (
 *     <div ref={ref}>
 *       <button onClick={() => setIsOpen(!isOpen)}>
 *         Toggle
 *       </button>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={disabled}
 *           onChange={(e) => setDisabled(e.target.checked)}
 *         />
 *         Disable click outside
 *       </label>
 *       {isOpen && (
 *         <div className="dropdown-menu">
 *           <p>Won't close if disabled</p>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */
