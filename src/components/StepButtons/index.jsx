import React from 'react'

const StepButtons = ({ appState, onHandleClickNextQuestion }) => (
  <div>
    <button onClick={onHandleClickNextQuestion} className="btn btn-ui">
      {appState.currentQuestion === appState.apiData.length - 1
        ? 'Finalizar'
        : 'Proxima'}
    </button>
  </div>
)

export { StepButtons }
