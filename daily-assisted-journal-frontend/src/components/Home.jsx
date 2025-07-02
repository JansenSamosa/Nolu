import React, { useContext, useEffect } from 'react'
import ButtonGlass from './ButtonGlass'
import { redirect, useNavigate } from 'react-router'
import { AuthContext } from '../App'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

const Home = () => {
  const navigate = useNavigate()

  const user = useContext(AuthContext)

  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen 
      background-saturated
      text-color-main  text-2xl 
    '>
      <div className='flex-1/3'></div>

      <div className='flex-1/3 flex flex-col items-center justify-end text-center'>
        <h1 className='text-5xl font-bold text-shadow-md'>
          Welcome to
        </h1>
        <h1 className='text-7xl font-bold text-color-main-title text-shadow-md'> Nolu </h1>
        {/* <p className='text-xl mt-3 '>Your thoughts.</p>
        <p className='text-xl mt-3 '>Nothing else.</p> */}
      </div>
      <div className='flex-1/3 flex flex-col items-center justify-center text-center w-full'>
        {/* <div className=' shadow-xl  w-full'> */}
        <p className='text-1xl w-60 leading-relaxed '>Your daily pause for self-reflection</p>
        {/* </div> */}
      </div>
      <div className='flex-1/3 flex flex-col justify-start w-60 '>
        {user && (
          <>
            <ButtonGlass className='mb-4 p-2' onClick={() => navigate('/journal')}>
              Dashboard
            </ButtonGlass>
            <ButtonGlass className='mb-4 p-2' onClick={() => {
              signOut(auth)
              location.reload()
            }}>
              Logout
            </ButtonGlass>
          </>
        )}

        {!user &&
          <>
            <ButtonGlass className='mb-4 p-2' onClick={() => navigate('/login')}>
              Login
            </ButtonGlass>
            <ButtonGlass className='mb-4 p-2' onClick={() => navigate('/register')}>
              Register
            </ButtonGlass>
          </>}
      </div>
      <div className='flex-1/3'></div>
    </div>
  )
}

export default Home