import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Lobby from './sections/lobby/lobby'
import ProductScreen from './sections/productscreen/productscreen'

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Link className='bg-blue-400' to='/'>so this is how to go back to the main page</Link>
          <h3>for now I'm putting up with the header shenanegens </h3>
          <h2>It seems we are going to make the backend</h2>
          <Routes>
            <Route path='/product/:slug' element={<ProductScreen />} />
            <Route path='/' element={<Lobby />} />
          </Routes>
        </div>      
      </BrowserRouter>
    </>
  )
}

export default App
