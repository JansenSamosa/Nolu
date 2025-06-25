import React from 'react'
import Daily from './components/Daily'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './components/Home'
import Journal from './components/Journal'

const App = () => {
  return (
    <div className='font-display text-color-main'>
      <BrowserRouter>
        <Routes> 
          <Route index element={<Home/>}/>
          <Route path='/daily' element={<Daily />} />
          <Route path='/journal' element={<Journal />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App