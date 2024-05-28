import {Routes, Route} from 'react-router-dom'
import Login from "./components/Login"
import Register from "./components/Register"
import Chat from './components/Chat'

function App() {
  
  return (
  <div className="p-10">
    <Routes>
      <Route path = '/' element = {<Login/>} />
      <Route path = '/register' element = {<Register/>} />
      <Route path = '/chat' element = {<Chat/>} />
    </Routes>
  </div>
  )
}

export default App
