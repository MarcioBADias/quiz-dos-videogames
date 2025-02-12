import React from 'react'

const ProgressBar = ({ appState, maxScore, onUserHasAnwered }) => {
  const progressValue = onUserHasAnwered
    ? appState.currentQuestion + 1
    : appState.currentQuestion
  return (
    <header className="progress">
      <label>
        <progress max={appState.apiData.length} value={progressValue}>
          {progressValue}
        </progress>
        <span>
          Questao <b>{appState.currentQuestion + 1}</b> de{' '}
          {appState.apiData.length}
        </span>
        <span>
          <b>
            {appState.userScore} / {maxScore} pontos
          </b>
        </span>
      </label>
    </header>
  )
}

export { ProgressBar }
