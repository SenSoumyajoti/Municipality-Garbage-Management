import React, { useEffect, useState } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import AssignCardComponent from '../components/AssignCardComponent';
const backendURL = import.meta.env.VITE_BACKEND_URL

// const spanStyle = {
//   padding: '20px',
//   background: '#efefef',
//   color: '#000000'
// }

// const divStyle = {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundSize: 'cover',
//   height: '600px'
// }
// const slideImages = [
//   {
//     url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
//     caption: 'Slide 1'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80',
//     caption: 'Slide 2'
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
//     caption: 'Slide 3'
//   },
// ];



const SlideShow = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${backendURL}/assign/getAllAssigns?populateArea=true&populateDustbin=true&populateDriver=true&populateVehicle=true`, {
        method: 'GET',
        // headers: headers
      });
      const data = await response.json();
      setProfiles(data.assignments);
      // slideShow();
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // localStorage.setItem("token", "Admin");
    fetchProfiles(); // Fetch profiles initially
  }, []);

    return (
      <div className="slide-container">
        <h2 className='text-3xl font-semibold mb-4'>Assignments</h2>
        <div>
        <Slide>
          {profiles.map((eachProfile, idx) => (
            <div key={idx}>
            <AssignCardComponent
              key={eachProfile._id}
              areaName={eachProfile.areaId.areaName}
              areaId={eachProfile.areaId.areaId}
              dustbinNo={eachProfile.areaId.noOfDustbins}
              driverName={eachProfile.driverUsername.fullName}
              vehicleNo={eachProfile.vehicleReg.vehicleReg}
              className='driverSlides visible'
            >
              {/* <button className='text-6xl text-gray-500 rounded-l-md absolute top-1/2 right-0 -translate-y-1/2 px-3 py-3'
              >
                <FontAwesomeIcon icon={faChevronRight}/>
              </button>
              <button className='text-6xl text-gray-500 rounded-l-md absolute top-1/2 left-0 -translate-y-1/2 px-3 py-3'>
                <FontAwesomeIcon icon={faChevronLeft}/>
              </button> */}
            </AssignCardComponent>
            </div>
          ))} 
        </Slide>
        </div>
      </div>
    )
}

export default SlideShow