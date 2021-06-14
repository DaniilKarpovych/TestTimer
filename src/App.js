import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Observable, Subject } from "rxjs";
import { timestamp, pairwise } from "rxjs/operators";

function App() {
  const [time, setTime] = useState("00:00:00");
  const [subscriptions, setSubscriptions] = useState(null);
  const [waitSub, setWaitSub] = useState(null);

  useEffect(() => {
    const subject = new Subject();
    setWaitSub(subject);
    return () => {
      setWaitSub(null);
      console.log("UseEffect");
    };
  }, []);

  const onStartClick = useCallback(() => {
    if (subscriptions) {
      subscriptions.unsubscribe();
      setSubscriptions(null);
      setTime("00:00:00");
    } else {
      const timer = new Observable((observer) => {
        let counter = 0;
        const intervalId = setInterval(() => {
          observer.next(counter++);
        }, 1000);
        return () => {
          clearInterval(intervalId);
        };
      });
      const subscription = timer.subscribe((val) => {
        setTime(val);
        console.log(val);
      });
      setSubscriptions(subscription);
    }
  }, [subscriptions]);

  const onStopClick = useCallback(() => {
    if (subscriptions){
    subscriptions.unsubscribe();
    setTime("00:00:00");
    const timer = new Observable((observer) => {
      let counter = 0;
      const intervalId = setInterval(() => {
        observer.next(counter++);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    });
    const subscription = timer.subscribe((val) => {
      setTime(val);
      console.log(val);
    });
    setSubscriptions(subscription);
  }}, [subscriptions]);

  const onWaitClick = useCallback(() => {
    if (subscriptions){
    waitSub.next();
    waitSub.pipe(timestamp(), pairwise()).subscribe((v) => {
      if (v[1].timestamp - v[0].timestamp <= 300) {
        subscriptions.unsubscribe();
        console.log("double click");
      }
    });
  }}, [subscriptions]);

  return (
    <div className="timer">
      <h1>Timer</h1>
      <output>{time}</output>
      <div>
        <button onClick={onStartClick}>Start/Stop</button>
        <button onMouseDown={onWaitClick}>Wait</button>
        <button onClick={onStopClick}>Reset</button>
      </div>
    </div>
  );
}

export default App;
