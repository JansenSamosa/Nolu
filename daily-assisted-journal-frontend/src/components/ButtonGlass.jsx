import React from 'react'

const ButtonGlass = ({ children, className, onClick }) => {
  return (
    <button 
        onClick={onClick}
        className={`${className} shadow-md bg-white/15 hover:bg-white/7
            active:shadow-sm active:bg-white/0
            transition-all rounded-2xl  cursor-pointer`}
    >
        {children}
    </button>
  )
}

export default ButtonGlass