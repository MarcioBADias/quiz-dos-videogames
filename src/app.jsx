const App = () => {
  return (
    <>
      <div className="app">
        <main className="main">
          <div className="app-header">
            <img src="./img/logo-quiz-videogames.png" alt="Logo" />
            <h1>Quiz dos Videogames</h1>
          </div>
          <div>
            <h4>Qual foi o videogame?</h4>
            <ul className="options">
              <li className="btn btn-option">Opcao 1</li>
              <li className="btn btn-option">Opcao 2</li>
              <li className="btn btn-option">Opcao 3</li>
              <li className="btn btn-option">Opcao 4</li>
            </ul>
          </div>
          <div>
            <button className="btn btn-ui">Proxima</button>
          </div>
        </main>
      </div>
    </>
  )
}

export { App }
