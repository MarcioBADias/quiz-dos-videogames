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
            <div className="options">
              <button className="btn btn-option">Opcao 1</button>
              <button className="btn btn-option">Opcao 2</button>
              <button className="btn btn-option">Opcao 3</button>
              <button className="btn btn-option">Opcao 4</button>
            </div>
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
