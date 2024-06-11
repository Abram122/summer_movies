// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { Route, Routes } from "react-router-dom"
import Home from "./Components/Home"
import Movies from "./Components/Movies"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/movies" element={<Movies/>}/>
    </Routes>
      )
}

export default App
