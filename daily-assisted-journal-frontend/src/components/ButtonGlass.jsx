import React from 'react'

const ButtonGlass = ({ children, className, onClick, clickable = true }) => {
  return clickable ? (
    <button
      onClick={onClick}
      className={`${className} shadow-md bg-white/15 hover:bg-white/7
            active:shadow-sm active:bg-white/0
            transition-all rounded-2xl  cursor-pointer`}
    >
      {children}
    </button>
  ) : (
    <button
      className={`${className} shadow-md bg-white/15 
      transition-all rounded-2xl cursor-not-allowed opacity-50`}
    >
      {children}
    </button>
  )
}

export default ButtonGlass