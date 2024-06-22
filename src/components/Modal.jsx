import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ children, open }) {
  const dialog = useRef();

  //remeber this hook will execute its own function after this component-function has been executed 
  useEffect(()=>{
    if(open){
      dialog.current.showModal();
    }
    else{
      dialog.current.close();
    }
  }, [open]);//open is added as a dependency because we want useEffect to execute its function again when the value of the 'open' variable changes
  

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {open && children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
