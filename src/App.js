import Header from './Header'; // Import the Header component
import React, { useState, useEffect } from 'react'; // Import React hooks
import Row from './Row'; // Import the Row component
import AddUtil from './AddUtil'; // Import the AddUtil component
import HideUtil from './HideUtil'; // Import the HideUtil component
import './App.css'; // Import CSS for styling

function App() {
  localStorage.removeItem("reservations");
  // Initialize `locations` state with data from localStorage or default conservation areas
  const [locations, setLocations] = useState(() => {
    try {
      const savedLocations = localStorage.getItem("reservations");
      if (savedLocations) {
        const parsedData = JSON.parse(savedLocations);
        if (Array.isArray(parsedData)) return parsedData;
      }
    } catch (error) {
      console.error("Error parsing localStorage data", error);
    }
    // Default data for conservation areas
    return [
      {
        locationName: "Centennial Park",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
      {
        locationName: "Grand Canyon",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
      {
        locationName: "Niagara Falls",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
      {
        locationName: "Sleeping Giant",
        timeSlots: [
          { time: "9am-12pm", booked: false },
          { time: "12pm-3pm", booked: false },
          { time: "3pm-6pm", booked: false },
        ],
      },
    ];
  });

  // State to control visibility of booked destinations
  const [showBooked, setShowBooked] = useState(true);

  // Sync `locations` state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("reservations", JSON.stringify(locations));
  }, [locations]);

  // Function to create a new location
  const createLocation = (location) => {
    if (!locations.some((item) => item.locationName === location)) {
      const updatedLocations = [
        ...locations,
        {
          locationName: location,
          timeSlots: [
            { time: "9am-12pm", booked: false },
            { time: "12pm-3pm", booked: false },
            { time: "3pm-6pm", booked: false },
          ],
        },
      ];
      setLocations(updatedLocations);
    }
  };

  // Function to toggle the booked status of a time slot
  const toggleReservation = (reservation, timeSlot) => {
    const updatedLocations = locations.map((item) =>
      item.locationName === reservation.locationName
        ? {
            ...item,
            timeSlots: item.timeSlots.map((slot) =>
              slot.time === timeSlot ? { ...slot, booked: !slot.booked } : slot
            ),
          }
        : item
    );
    setLocations(updatedLocations);
  };

  // Function to generate rows for booked or available time slots
  const reservationRow = (bookedValue) =>
    locations.flatMap((item) =>
      item.timeSlots
        .filter((slot) => slot.booked === bookedValue)
        .map((slot) => (
          <tr key={`${item.locationName}-${slot.time}`}>
            <td>{item.locationName}</td>
            <td>{slot.time}</td>
          </tr>
        ))
    );

  // Render the component
  return (
    <div>
      <Header locations={locations} />
      <div className="m-3">
        <AddUtil call={createLocation} />
      </div>
      <div className="container-fluid">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Destinations</th>
              <th>Time Slots</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((item) => (
              <Row
                key={item.locationName}
                item={item}
                toggle={toggleReservation}
              />
            ))}
          </tbody>
        </table>
        <div className="bg-secondary text-white text-center p-2">
          <HideUtil
            description="Booked Destinations"
            isBooked={showBooked}
            call={(checked) => setShowBooked(checked)}
          />
        </div>
        {showBooked && (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Destinations</th>
                <th>Time Slot</th>
              </tr>
            </thead>
            <tbody>{reservationRow(true)}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
