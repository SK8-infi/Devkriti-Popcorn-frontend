import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Loading.css'

const Loading = () => {

  const { nextUrl } = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    if(nextUrl){
      setTimeout(()=>{
        navigate('/' + nextUrl)
      },8000)
    }
  },[])

  return (
    <div className='loading-container'>
        <div className='loading-spinner'></div>
    </div>
  )
}

export default Loading
