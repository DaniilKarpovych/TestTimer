import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Observable, Subject } from "rxjs";
import { timestamp, pairwise } from "rxjs/operators";

function App() {
  const [time, setTime] = useState(0);
  const [subscriptions, setSubscriptions] = useState(null);
  const [waitSub, setWaitSub] = useState(null);

  useEffect(() => {
    const subject = new Subject();
    setWaitSub(subject);
    return () => {
      setWaitSub(null);
    };
  }, []);

  const onStartClick = useCallback(() => {
    if (subscriptions) {
      subscriptions.unsubscribe();
      setSubscriptions(null);
      setTime(0);
    } else {
      const timer = new Observable((observer) => {
        const date = new Date();
        const intervalId = setInterval(() => {
          observer.next(date);
        }, 500);
        return () => {
          clearInterval(intervalId);
        };
      });
      const subscription = timer.subscribe((val) => {
        setTime(new Date() - val);
      });
      setSubscriptions(subscription);
    }
  }, [subscriptions]);

  const onStopClick = useCallback(() => {
    if (subscriptions) {
      subscriptions.unsubscribe();
      setTime(0);
      const timer = new Observable((observer) => {
        const date = new Date();
        const intervalId = setInterval(() => {
          observer.next(date);
        }, 500);
        return () => {
          clearInterval(intervalId);
        };
      });
      const subscription = timer.subscribe((val) => {
        setTime(new Date() - val);
        console.log(val);
      });
      setSubscriptions(subscription);
    }
  }, [subscriptions]);

  const onWaitClick = useCallback(() => {
    if (subscriptions) {
      waitSub.next();
      waitSub.pipe(timestamp(), pairwise()).subscribe((v) => {
        if (v[1].timestamp - v[0].timestamp <= 300) {
          subscriptions.unsubscribe();
        }
      });
    }
  }, [subscriptions]);

  console.log(time);

  let sec = new Date(time).getSeconds();
  if (sec < 10) sec = `${"0" + sec}`;
  let min = new Date(time).getMinutes();
  if (min < 10) min = `${"0" + min}`;
  let hours = new Date(time).getUTCHours();
  if (hours < 10) hours = `${"0" + hours}`;
  console.log(hours);

  return (
    <div className="timer">
      <h1>Timer</h1>
      <output>{`${hours + ":" + min + ":" + sec}`}</output>
      <div>
        <button onClick={onStartClick}>Start/Stop</button>
        <button onMouseDown={onWaitClick}>Wait</button>
        <button onClick={onStopClick}>Reset</button>
      </div>
    </div>
  );
}

export default App;
