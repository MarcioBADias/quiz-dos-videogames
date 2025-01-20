import { useEffect, useReducer } from 'react'

const reduce = (state, action) => {
  if (action.type === 'set_api_data') {
    return { ...state, apiData: action.apiData }
  }

  return state
}

const App = () => {
  const [state, dispatch] = useReducer(reduce, {
    currentQuestion: 0,
    apiData: [],
  })

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/Roger-Melo/fake-data/main/videogame-questions.json',
    )
      .then((response) => response.json())
      .then((apiData) => dispatch({ type: 'set_api_data', apiData }))
      .catch((error) => alert(error.message))
  }, [])

  return (
    <>
      <div className="app">
        <main className="main">
          <div className="app-header">
            <img src="./img/logo-quiz-videogames.png" alt="Logo" />
            <h1>Quiz dos Videogames</h1>
          </div>
          {state.apiData.length > 0 && (
            <>
              <div>
                <h4>{state.apiData[state.currentQuestion].question}</h4>
                <ul className="options">
                  {state.apiData[state.currentQuestion].options.map(
                    (option) => (
                      <li key={option} className="btn btn-option">
                        {option}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                <button className="btn btn-ui">Proxima</button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

export { App }
