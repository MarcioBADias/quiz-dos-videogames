import { useEffect, useReducer, useState } from 'react'

const secondsPerQuestion = 30

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
    const wasLastQuestion = state.currentQuestion + 1 === state.apiData.length
    return {
      ...state,
      currentQuestion: wasLastQuestion ? 0 : state.currentQuestion + 1,
      clickedOption: null,
      appStatus: wasLastQuestion ? 'finished' : state.appStatus,
    }
  }

  if (action.type === 'clicked_restart') {
    return {
      ...state,
      userScore: 0,
      appStatus: 'ready',
      currentQuestion: 0,
      clickedOption: null,
    }
  }

  if (action.type === 'clicked_start') {
    return {
      ...state,
      appStatus: 'active',
    }
  }

  if (action.type === 'game_over') {
    return {
      ...state,
      appStatus: 'finished',
    }
  }

  return state
}

const initialState = {
  currentQuestion: 0,
  apiData: [],
  clickedOption: null,
  userScore: 0,
  appStatus: 'ready',
}

const Timer = ({ appState, onHandleTimer }) => {
  const [seconds, setSeconds] = useState(
    secondsPerQuestion * appState.apiData.length,
  )

  useEffect(() => {
    if (seconds === 0) {
      onHandleTimer({ message: 'game_over' })
      return
    }

    if (appState.status === 'finished') {
      return
    }

    const id = setTimeout(() => setSeconds((prev) => prev - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds, onHandleTimer, appState])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <div className="timer">
      {minutes < 10 ? `0${minutes}` : minutes} : {secs < 10 ? `0${secs}` : secs}
    </div>
  )
}

const Header = () => (
  <header className="app-header">
    <img src="./img/logo-quiz-videogames.png" alt="Logo" />
    <h1>Quiz dos Videogames</h1>
  </header>
)

const Questions = ({ appState, onUserHasAnwered, onHandleClickOption }) => {
  return (
    <div>
      <h4>{appState.apiData[appState.currentQuestion].question}</h4>
      <ul className="options">
        {appState.apiData[appState.currentQuestion].options.map(
          (option, index) => {
            const answersClass =
              appState.clickedOption === index ? 'answer' : ''
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

  const handleClickStart = () => dispatch({ type: 'clicked_start' })

  const handleClickOption = (index) =>
    dispatch({ type: 'clicked_option', index })

  const handleClickNextQustion = () =>
    dispatch({ type: 'clicked_next_question' })

  const handleClickRestart = () => dispatch({ type: 'clicked_restart' })

  const handleTimer = ({ message }) => dispatch({ type: message })

  const userHasAnwered = state.clickedOption !== null
  const maxScore = state.apiData.reduce((acc, q) => acc + q.points, 0)
  const percentage = (state.userScore / maxScore) * 100
  const progressValue = userHasAnwered
    ? state.currentQuestion + 1
    : state.currentQuestion

  return (
    <>
      <div className="app">
        <Header />
        <main className="main">
          {state.appStatus === 'ready' && (
            <div className="start">
              <h2>Bem-vindo(a) ao Quiz dos Videogames!</h2>
              <h3>{state.apiData.length} Questões para te testar</h3>
              <button onClick={handleClickStart} className="btn">
                Bora começar
              </button>
            </div> //InitialScreen
          )}
          {state.appStatus === 'finished' && (
            <>
              <div className="result">
                <span>
                  Voce fez <b>{state.userScore}</b> pontos de {maxScore} (
                  {percentage}%)
                </span>
              </div>
              <button onClick={handleClickRestart} className="btn btn-ui">
                Reiniciar o Quiz
              </button>
            </> //ResultScreen
          )}

          {state.apiData.length > 0 && state.appStatus === 'active' && (
            <>
              <header className="progress">
                <label>
                  <progress max={state.apiData.length} value={progressValue}>
                    {progressValue}
                  </progress>
                  <span>
                    Questao <b>{state.currentQuestion + 1}</b> de{' '}
                    {state.apiData.length}
                  </span>
                  <span>
                    <b>
                      {state.userScore} / {maxScore} pontos
                    </b>
                  </span>
                </label>
              </header>{' '}
              //ProgressBar
              <Questions
                appState={state}
                onUserHasAnwered={userHasAnwered}
                onHandleClickOption={handleClickOption}
              />
              <Timer appState={state} onHandleTimer={handleTimer} />
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
                </div> //StepsButtons
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export { App }
