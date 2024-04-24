import { Route, Routes } from 'react-router-dom'
import MainPage from './components/MainPage'
import Easy from './components/Easy'
import Medium from './components/Medium'
import Hard from './components/Hard'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/easy' element={<Easy />} />
        <Route path='/medium' element={<Medium />} />
        <Route path='/hard' element={<Hard />} />
      </Routes>
    </>
  )
}

export default App
