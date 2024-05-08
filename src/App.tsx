import { Route, Routes } from 'react-router-dom'
import { MainPage } from './game/MainPage'
// import { Login } from './authentication/Login'
// import { Server } from "./server/server"
// import "./server/server"

function App() {
  // const handleLogin = (username: string) => {
  //   // Implement your login logic here
  //   console.log("Logging in with:", username);
  // };

  return (
    <>
      <Routes>
        {/* <Route path='/' element={<Login onLogin={handleLogin} />} /> */}
        <Route path='/' element={<MainPage />} />
      </Routes>
      {/* <Server /> */}
    </>
  )
}

export default App
