import React, { useEffect, useState } from 'react'
import ButtonGlass from '../ui/ButtonGlass.jsx'
import {
  auth, signInWithEmailAndPassword,
  GoogleAuthProvider, providerGoogle, signInWithRedirect, getRedirectResult,
  signInWithPopup
} from '../../firebase.js'

import { useNavigate } from 'react-router'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const loginUser = (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // signed up
        console.log(userCredential.user)
        navigate('/')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const loginWithGoogle = () => {
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        console.log(user)
        navigate('/')
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error)
        console.log(credential)
      });
  }

  return (
    <div className='background-saturated h-screen w-screen'>
      <form
        className='flex flex-col items-center justify-center h-full'
        onSubmit={e => loginUser(e)}
      >
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
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
          Login
        </ButtonGlass>
        <ButtonGlass
          className='w-64 p-3 mt-4'
          onClick={loginWithGoogle}
        >
          Login with Google
        </ButtonGlass>
      </form>
    </div>
  )
}

export default Login