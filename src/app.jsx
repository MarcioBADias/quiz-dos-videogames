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

    const id = setTimeout(() => setSeconds((prev) => prev - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds, onHandleTimer])

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

const InitialScreen = ({ appState, onHandleClickStart }) => (
  <div className="start">
    <h2>Bem-vindo(a) ao Quiz dos Videogames!</h2>
    <h3>{appState.apiData.length} Questões para te testar</h3>
    <button onClick={onHandleClickStart} className="btn">
      Bora começar
    </button>
  </div>
)

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

const StepButtons = ({ appState, onHandleClickNextQuestion }) => (
  <div>
    <button onClick={onHandleClickNextQuestion} className="btn btn-ui">
      {appState.currentQuestion === appState.apiData.length - 1
        ? 'Finalizar'
        : 'Proxima'}
    </button>
  </div>
)

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

  const handleClickNextQuestion = () =>
    dispatch({ type: 'clicked_next_question' })

  const handleClickRestart = () => dispatch({ type: 'clicked_restart' })

  const handleTimer = ({ message }) => dispatch({ type: message })

  const userHasAnwered = state.clickedOption !== null
  const maxScore = state.apiData.reduce((acc, q) => acc + q.points, 0)

  return (
    <>
      <div className="app">
        <Header />
        <main className="main">
          {state.appStatus === 'ready' && (
            <InitialScreen
              appState={state}
              onHandleClickStart={handleClickStart}
            />
          )}
          {state.appStatus === 'finished' && (
            <ResultScreen
              appState={state}
              maxScore={maxScore}
              onHandleClickRestart={handleClickRestart}
            />
          )}

          {state.apiData.length > 0 && state.appStatus === 'active' && (
            <>
              <ProgressBar
                appState={state}
                maxScore={maxScore}
                onUserHasAnwered={userHasAnwered}
              />
              <Questions
                appState={state}
                onUserHasAnwered={userHasAnwered}
                onHandleClickOption={handleClickOption}
              />
              <Timer appState={state} onHandleTimer={handleTimer} />
              {userHasAnwered && (
                <StepButtons
                  appState={state}
                  onHandleClickNextQuestion={handleClickNextQuestion}
                />
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export { App }
