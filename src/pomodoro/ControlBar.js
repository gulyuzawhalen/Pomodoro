import React from "react";
import PropTypes from "prop-types";
import classNames from "../utils/class-names";

function ControlBar({onPlayPause, isPlaying, onStopSession}) {
    return (
        <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={onPlayPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isPlaying,
                  "oi-media-pause": isPlaying,
                })}
              />
            </button>
            {/* TODO: Implement stopping the current focus or break session and disable when there is no active session */}
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={onStopSession}
            >
              <span className="oi oi-media-stop" />
            </button>
        </div>
    )
}
ControlBar.propTypes = {
    playPause: PropTypes.bool.isRequired,
    stopSession: PropTypes.func.isRequired,
};
export default ControlBar;