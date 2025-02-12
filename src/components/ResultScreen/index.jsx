import React from 'react'

const ResultScreen = ({ appState, maxScore, onHandleClickRestart }) => {
  const percentage = (appState.userScore / maxScore) * 100

  return (
    <>
      <div className="result">
        <span>
          Voce fez <b>{appState.userScore}</b> pontos de {maxScore} (
          {percentage}
          %)
        </span>
      </div>
      <button onClick={onHandleClickRestart} className="btn btn-ui">
        Reiniciar o Quiz
      </button>
    </>
  )
}

export { ResultScreen }
