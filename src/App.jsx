import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Movies from "./Pages/Movies"
import MovieDetails from "./Pages/MovieDetails"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/movies" element={<Movies/>}/>
      <Route path="/movies/:id" element={<MovieDetails/>}/>
    </Routes>
      )
}

export default App
