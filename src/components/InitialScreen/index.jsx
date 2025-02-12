import React from 'react'

const InitialScreen = ({ appState, onHandleClickStart }) => (
  <div className="start">
    <h2>Bem-vindo(a) ao Quiz dos Videogames!</h2>
    <h3>{appState.apiData.length} Questões para te testar</h3>
    <button onClick={onHandleClickStart} className="btn">
      Bora começar
    </button>
  </div>
)

export { InitialScreen }
