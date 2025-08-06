import { BookOpenIcon, Cog6ToothIcon, HomeIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { useLocation, useNavigate } from 'react-router'

const NavButton = ({path, children}) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <button
      className={`size-8 cursor-pointer p-1 opacity-50 ${location.pathname == path && 'bg-glass-frost opacity-100'}`}
      onClick={() => navigate(path)}
    >
      {children}
    </button>
  )
}

const Header = () => {
  const navigate = useNavigate()

  return (
    <div className='
         p-3
         shadow-lg bg-white/10 flex items-center justify-between 
         h-15
         '
    >
      <h1 className='text-4xl font-bold text-color-main-title text-shadow-md'> Nolu </h1>
      <nav className="flex items-center space-x-4">
        <NavButton path='/'>
          <HomeIcon />
        </NavButton>
        <NavButton path='/journal'>
          <BookOpenIcon />
        </NavButton>
        <NavButton path='/account'>
          <UserCircleIcon />
        </NavButton>
        <NavButton path='/settings'>
          <Cog6ToothIcon />
        </NavButton>
      </nav>
    </div>
  )
}

export default Header