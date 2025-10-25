import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BusList = ({userId}) => {
  const [buses, setBuses] = useState([])
  const navigate = useNavigate()

  console.log("App userId:", userId);
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/buses/")
        setBuses(response.data)
      } catch (error) {
        console.log('Error fetching buses', error)
      }
    }
    fetchBuses()
  }, [])

  const handleViewSeats = (id) => {
    navigate(`/bus/${id}`)
  }

  return (
    <div>
      {buses.map((bus) => (
        <div key={bus.id}>
          <div>Bus Name: {bus.bus_name}</div>
          <div>Bus Number: {bus.bus_number}</div>
          <div>Origin: {bus.origin}</div>
          <div>Destination: {bus.destination}</div>
          <div>Start Time: {bus.start_time}</div>
          <div>End Time: {bus.end_time}</div>
          <button onClick={() => handleViewSeats(bus.id)}>View Seats</button>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default BusList
