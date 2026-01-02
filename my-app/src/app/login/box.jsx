import React from 'react'

const box = ({icon, text}) => {
  return (
    
        <>
        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-black/30 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-white/10"
        >
          {icon}
          {text}
        </button></>
    
  )
}

export default box