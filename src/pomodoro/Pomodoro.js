import React, { useState } from "react";
import useInterval from "../utils/useInterval";
import {minutesToDuration} from '../utils/duration';
import Duration from './Duration';
import ControlBar from './ControlBar';
import Sessions from './Sessions';

const BREAK_MAX = 15;
const BREAK_MIN = 1;
const BREAK_STEP = 1;
const FOCUS_MAX = 60;
const FOCUS_MIN = 5;
const FOCUS_STEP = 5;

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1)
  const secondsElapsed = prevState.timeTotal - timeRemaining;
  return {
    ...prevState,
    timeRemaining,
    percentComplete: (secondsElapsed / prevState.timeTotal) * 100,
  };
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if(currentSession.label === "Focusing") {
      return {
        label: "On Break",
        duration: minutesToDuration(breakDuration),
        timeTotal: breakDuration * 60,
        timeRemaining: breakDuration * 60,
        percentComplete: 0,
      }
    }
    return {
      label: "Focusing",
      duration: minutesToDuration(focusDuration),
      timeTotal: focusDuration * 60,
      timeRemaining: focusDuration * 60,
      percentComplete: 0,
    }
  }
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [session, setSession] = useState(null);

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if(nextState) {
        setSession((prevStateSession) => {
          if(prevStateSession === null) {
            return {
              label: "Focusing",
              duration: minutesToDuration(focusDuration),
              timeTotal: focusDuration * 60,
              timeRemaining: focusDuration * 60,
              percentComplete: 0,
            }
          }
          return prevStateSession
        })
      }
      return nextState
    });
  }

  function decreaseFocus() {
    setFocusDuration((prevState) => Math.max(FOCUS_MIN, prevState - FOCUS_STEP));
  }
  function increaseFocus() {
    setFocusDuration((prevState) => Math.min(FOCUS_MAX, prevState + FOCUS_STEP));
  }
  function decreaseBreak() {
    setBreakDuration((currentBreak) => Math.max(BREAK_MIN, prevState - BREAK_STEP));
  }
  function increaseBreak() {
    setBreakDuration((currentBreak) => Math.min(BREAK_MAX, prevState + BREAK_STEP));
  }
  function stopSession() {
    setIsTimerRunning(false);
    setSession(null)
  }

  useInterval(() => {
    // ToDo: Implement what should happen when the timer is running
    if(session.timeRemaining === 0){
      new Audio(`${process.env.PUBLIC_URL}/alarm/submarine-dive-horn.mp3`).play();
      return setSession(nextSession(focusDuration, breakDuration))
    }
    return setSession(nextTick)
    }, isTimerRunning ? 1000 : null,
  );

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <Duration 
            label={`Focus Duration: ${minutesToDuration(focusDuration)}`}
            onIncrease={increaseFocus} 
            onDecrease={decreaseFocus} 
            testid="focus"
          />
        </div>
        <div className="col">
          <div className="float-right">
            <Duration 
              label={`Break Duration: ${minutesToDuration(breakDuration)}`}
              onIncrease={increaseBreak} 
              onDecrease={decreaseBreak} 
              testid="break"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ControlBar 
            onPlayPause={playPause} 
            isPlaying={isTimerRunning}
            onStopSession={stopSession} 
          />       
        </div>
      </div>
      <Sessions session={session} isPaused={!isTimerRunning}/>
    </div>
  )
}

export default Pomodoro;