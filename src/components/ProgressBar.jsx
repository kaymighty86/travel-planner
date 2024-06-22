import { useEffect, useState } from "react"

export default function ProgressBar({totalTime}){

    const [currentTime, setCurrentTime] = useState(totalTime);

    useEffect(()=>{
        const timeUpdater = setInterval(()=>{
            setCurrentTime(prevTime => (prevTime -= 10));
        }, 10)

        return ()=>{
            clearInterval(timeUpdater);
        }
    },[]);
   
    return <progress value={currentTime} max={totalTime}></progress>
}