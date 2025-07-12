import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './DateSelect.css'

const DateSelect = ({dateTime, id}) => {

    const navigate = useNavigate();

    const [selected, setSelected] = useState(null)

    const onBookHandler = ()=>{
        if(!selected){
            return toast('Please select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0)
    }

  return (
    <div id='dateSelect' className='date-select-container'>
      <div className='date-select-box'>
        <div>
            <p className='date-select-title'>Choose Date</p>
            <div className='date-select-row'>
                <ChevronLeftIcon width={28}/>
                <span className='date-select-days'>
                    {Object.keys(dateTime).map((date)=>(
                        <button onClick={()=> setSelected(date)} key={date} className={`date-select-day-btn${selected === date ? ' selected' : ''}`}> 
                            <span>{new Date(date).getDate()}</span>
                            <span>{new Date(date).toLocaleDateString("en-US", {month: "short"})}</span>
                        </button>
                    ))}
                </span>
                <ChevronRightIcon width={28}/>
            </div>
        </div>
        <button onClick={onBookHandler} className='date-select-book-btn'>Book Now</button>
      </div>
    </div>
  )
}

export default DateSelect
