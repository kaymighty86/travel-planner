import { useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";

export default function DeleteConfirmation({ onConfirm, onCancel }) {

  const countDownTime = 3000;//3 seconds

  useEffect(()=>{
    const autoDeleteTimer = setTimeout(onConfirm, countDownTime);

    //this returned function is a "cleanup function". React will execute it before the next useEffect hook function execution (remember useEffect will re-execute its function if the dependency value changes)
    //or if the component is unmounting, React will execute it before it unmounts
    return ()=>{
      clearTimeout(autoDeleteTimer);
    }
  }, [onConfirm])//since we are using a function dependency and functions/objects are never the same when re-initialised by javascript (remember no two functions or objets are the same even if they contain the same line of code). This will cause the hook to be re-executed every time the function is re-initialised. The way to block this is to wrap the dependent function's source in a useCallback() hook to ensure that the source function is only created once throughout the lifecycle of the component (check the 'App.jsx' code to see how it was used)

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar totalTime={countDownTime} />
    </div>
  );
}
