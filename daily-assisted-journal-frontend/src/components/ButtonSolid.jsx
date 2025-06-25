import React from 'react'

const ButtonSolid = ({ children, className, onClick }) => {
  return (
    <button 
        onClick={onClick}
        className={`${className} shadow-md shadow-slate-600 bg-slate-400 hover:bg-slate-500
            active:shadow-sm active:bg-slate-600
            transition-all rounded-2xl cursor-pointer`}
    >
        {children}
    </button>
  )
}

export default ButtonSolid