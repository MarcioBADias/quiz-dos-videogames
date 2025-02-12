import React from 'react'

const Timer = ({ appState }) => {
  const minutes = Math.floor(appState.seconds / 60)
  const secs = appState.seconds % 60

  return (
    <div className="timer">
      {minutes < 10 ? `0${minutes}` : minutes} : {secs < 10 ? `0${secs}` : secs}
    </div>
  )
}

export { Timer }
