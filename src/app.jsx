import { useEffect, useReducer } from 'react'
import { Timer } from '@/components/Timer'
import { Header } from '@/components/Header'
import { InitialScreen } from '@/components/InitialScreen'
import { ResultScreen } from '@/components/ResultScreen'
import { Questions } from '@/components/Questions'
import { ProgressBar } from '@/components/ProgressBar'
import { StepButtons } from '@/components/StepButtons'

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
      seconds: wasLastQuestion ? null : state.seconds,
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
      seconds: secondsPerQuestion * state.apiData.length,
    }
  }

  if (action.type === 'tick') {
    return {
      ...state,
      seconds: state.seconds === 0 ? null : state.seconds - 1,
      appStatus: state.seconds === 0 ? 'finished' : state.appStatus,
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
  seconds: null,
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

  useEffect(() => {
    if (state.seconds === null) {
      return
    }
    const id = setTimeout(() => dispatch({ type: 'tick' }), 1000)

    return () => clearTimeout(id)
  }, [state.seconds])

  const handleClickStart = () => dispatch({ type: 'clicked_start' })
  const handleClickOption = (index) =>
    dispatch({ type: 'clicked_option', index })
  const handleClickNextQuestion = () =>
    dispatch({ type: 'clicked_next_question' })
  const handleClickRestart = () => dispatch({ type: 'clicked_restart' })
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
              <Timer appState={state} />
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
