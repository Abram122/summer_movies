import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Movies from "./Pages/Movies"
import Loader from "./components/loader"
import MovieDetails from "./Pages/MovieDetails"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/movies" element={<Movies/>}/>
      <Route path="/movies/:id" element={<MovieDetails/>}/>
      <Route path="/loader" element={<Loader/>}/>
    </Routes>
      )
}

export default App
