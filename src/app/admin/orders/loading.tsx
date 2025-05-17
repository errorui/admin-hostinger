import React from 'react'


const Loading = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-green-200 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-green-200 rounded w-3/4"></div>
          <h1>Loading</h1>
          <div className="h-4 bg-green-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading