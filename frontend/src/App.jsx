import Login from "./components/Login"
import {Routes, Route} from 'react-router-dom'
import Register from "./components/Register"

function App() {
  
  return (
  <div className="p-10">
    <Routes>
      <Route path = '/' element = {<Login/>} />
      <Route path = '/register' element = {<Register/>} />
    </Routes>
  </div>
  )
}

export default App
