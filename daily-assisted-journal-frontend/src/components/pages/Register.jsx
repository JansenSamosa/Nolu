import React, { useState } from 'react'
import ButtonGlass from '../ui/ButtonGlass.jsx'
import { auth, createUserWithEmailAndPassword } from '../../firebase.js'
import { useNavigate } from 'react-router'

const Register = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const createUser = (e) => {
    e.preventDefault()
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // signed up
        console.log(userCredential.user)
        navigate('/')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div className='background-saturated h-screen w-screen'>
      <form 
        className='flex flex-col items-center justify-center h-full'
        onSubmit={e => createUser(e)}
      >
        <h1 className='text-2xl font-bold mb-4'>Register</h1>
        <input
          type='email'
          placeholder='Email'
          className='mb-2 p-2  rounded bg-glass w-64'
          id='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          className='mb-2 p-2  rounded bg-glass w-64'
          id='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <ButtonGlass className='w-64 p-3 mt-2'>
          Register
        </ButtonGlass>
      </form>
    </div>
  )
}

export default Register