import { useEffect, useReducer } from 'react'

const reduce = (state, action) => {
  if (action.type === 'set_api_data') {
    return { ...state, apiData: action.apiData }
  }

  if (action.type === 'clicked_option') {
    return {
      ...state,
      clickedOption: action.index,
      userScore:
        action.index === state.apiData[state.currentQuestion].correctOption
          ? state.userScore + state.apiData[state.currentQuestion].points
          : state.userScore,
    }
  }

  if (action.type === 'clicked_next_question') {
    const lastQuestion = state.currentQuestion + 1 === state.apiData.length
    return {
      ...state,
      currentQuestion: lastQuestion ? 0 : state.currentQuestion + 1,
      clickedOption: null,
      shouldShowResult: lastQuestion,
    }
  }

  return state
}

const initialState = {
  currentQuestion: 0,
  apiData: [],
  clickedOption: null,
  userScore: 0,
  shouldShowResult: false,
}

const App = () => {
  const [state, dispatch] = useReducer(reduce, initialState)

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/Roger-Melo/fake-data/main/videogame-questions.json',
    )
      .then((response) => response.json())
      .then((apiData) => dispatch({ type: 'set_api_data', apiData }))
      .catch((error) => alert(error.message))
  }, [])

  const handleClickOption = (index) =>
    dispatch({ type: 'clicked_option', index })

  const handleClickNextQustion = () =>
    dispatch({ type: 'clicked_next_question' })
  const userHasAnwered = state.clickedOption !== null
  const maxScore = state.apiData.reduce((acc, q) => acc + q.points, 0)
  const percentage = (state.userScore / maxScore) * 100

  return (
    <>
      <div className="app">
        <main className="main">
          <div className="app-header">
            <img src="./img/logo-quiz-videogames.png" alt="Logo" />
            <h1>Quiz dos Videogames</h1>
          </div>
          {state.shouldShowResult && (
            <p>
              Voce fez {state.userScore} pontos de {maxScore} ({percentage}%)
            </p>
          )}
          {state.apiData.length > 0 && !state.shouldShowResult && (
            <>
              <div>
                <h4>{state.apiData[state.currentQuestion].question}</h4>
                <ul className="options">
                  {state.apiData[state.currentQuestion].options.map(
                    (option, index) => (
                      <li key={option}>
                        <button
                          onClick={() => handleClickOption(index)}
                          className={`
                            btn 
                            btn-option 
                            ${state.clickedOption === index ? 'answer' : ''}
                            ${
                              userHasAnwered
                                ? state.apiData[state.currentQuestion]
                                    ?.correctOption === index
                                  ? 'correct'
                                  : 'wrong'
                                : ''
                            }
                            
                          `}
                          disabled={userHasAnwered}
                        >
                          {option}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              {userHasAnwered && (
                <div>
                  <button
                    onClick={handleClickNextQustion}
                    className="btn btn-ui"
                  >
                    {state.currentQuestion === state.apiData.length - 1
                      ? 'Finalizar'
                      : 'Proxima'}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export { App }
