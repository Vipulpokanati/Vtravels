import axios from 'axios'
import React, { useState, useEffect } from 'react'

const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token || !userId) return
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${userId}/bookings/`, {
          headers: { Authorization: `Token ${token}` }
        })
        // Sort bookings by newest first
        const sortedBookings = response.data.sort(
          (a, b) => new Date(b.booking_time) - new Date(a.booking_time)
        )
        setBookings(sortedBookings)
      } catch (error) {
        console.log('Error fetching bookings', error)
      }
    }
    fetchBookings()
  }, [token, userId])

  return (
    <div>
      <h2>Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map(b => (
          <div key={b.id}>
            <strong>{b.bus.bus_name}</strong> ({b.bus.bus_number})<br />
            Seat: {b.seat.seat_number}<br />
            Time: {new Date(b.booking_time).toLocaleString()}
            <hr />
          </div>
        ))
      )}
    </div>
  )
}

export default UserBookings
