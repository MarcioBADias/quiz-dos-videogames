import React from 'react'

const Questions = ({ appState, onUserHasAnwered, onHandleClickOption }) => (
  <div>
    <h4>{appState.apiData[appState.currentQuestion].question}</h4>
    <ul className="options">
      {appState.apiData[appState.currentQuestion].options.map(
        (option, index) => {
          const answersClass = appState.clickedOption === index ? 'answer' : ''
          const correctOrWrongClass = onUserHasAnwered
            ? appState.apiData[appState.currentQuestion]?.correctOption ===
              index
              ? 'correct'
              : 'wrong'
            : ''
          return (
            <li key={option}>
              <button
                onClick={() => onHandleClickOption(index)}
                className={`btn btn-option ${answersClass} ${correctOrWrongClass}`}
                disabled={onUserHasAnwered}
              >
                {option}
              </button>
            </li>
          )
        },
      )}
    </ul>
  </div>
)

export { Questions }
