import React from 'react'
import { Spinner } from "flowbite-react";

const LoadingSpinner = () => {
  return (
    <div>
        <Spinner className="fill-indigo-600" size="md" aria-label="Purple spinner example" />
    </div>
  )
}

export default LoadingSpinner