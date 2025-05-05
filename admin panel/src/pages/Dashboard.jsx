import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"

import AssignCardComponent from '../components/AssignCardComponent';
import NavBarComponent from '../components/NavBarComponent';
import { Slide } from 'react-slideshow-image';
import { socket } from "../App";
import 'react-slideshow-image/dist/styles.css'
import '../styles/Dashboard.css'
const backendURL = import.meta.env.VITE_BACKEND_URL


// const divStyle = {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundSize: 'cover',
//   height: 'auto'
// }

const Dashboard = () => {
  const [assigns, setAssigns] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(true)
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const slideContainerRef = useRef(null);
  const driverSlideRef = useRef(null);
  const [currIdx, setCurrIdx] = useState(0);

  const navigate = useNavigate()

  socket.on('update statuses', () => {
    setUpdateStatus(prev => !prev);
  })

  const nextSlide = () => {
    const nextIdx = (currIdx + 1) % assigns.length;
    setCurrIdx(nextIdx);
  }

  const prevSlide = () => {
    let prevIdx;
    if(currIdx == 0){
      prevIdx = assigns.length - 1;
    }
    else {
      prevIdx = currIdx - 1;
    }
    setCurrIdx(prevIdx);
  }

  const fetchStatuses = async () => {
    try {
      const response = await fetch(`${backendURL}/trackingStatus/getAllStatuses`, {
        method: 'GET'
      });
      const data = await response.json();
      if(response.ok){
        setStatuses(data.statuses);
      }
    } catch(error) {
      console.error('Error fetching tracking statuses:', error);
    }
  }

  const fetchAssigns = async () => {
    try {
      const response = await fetch(`${backendURL}/assign/getAllAssigns?populatePath=true&populateDustbin=true&populateDriver=true&populateVehicle=true`, {
        method: 'GET',
        // headers: headers
      });
      const data = await response.json();
      if(response.ok){
        setAssigns(data.assignments);
        console.log(data.assignments);
      }
      // slideShow();
    } catch (error) {
      console.error('Error fetching assigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [updateStatus])

  useEffect(() => {
    fetchAssigns(); // Fetch assigns initially
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if(storedToken==null || storedToken==""){
      navigate("/login")
      return
    }
    console.log(storedToken)
    
  }, []); // Empty dependency array to run only once on mount

  // return assigns;

  return (
    <>
      {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
        ? <div className="">
          <div className='fixed w-full top-0 z-10'>
            <NavBarComponent />
          </div>
          <div className="dashboardContainer h-[calc(100vh-4rem)] flex justify-between mt-16">
            {/* tracking status portion */}
            <div className="h-full w-[60%] px-5 py-3">
              <div className="status h-full w-full flex flex-col">
                <h2 className='text-3xl font-semibold mb-4'>Tracking Status</h2>
                <div className='allStatusContainer h-full w-full p-5 rounded-lg overflow-y-auto'
                  style={{ boxShadow : 'inset -2px 2px 5px 3px rgb(0 0 0 / 0.05), inset 2px -2px 5px 3px rgb(0 0 0 / 0.05)' }}
                >                                                                                    {/* index.css */}
                  {(statuses.length == 0)
                    ? <div className='h-full flex justify-center items-center text-gray-400'>
                      No Tracking Updates
                    </div>
                    : <div className='flex flex-col gap-3'>
                      {statuses.map((eachStatus) => (
                        <div className='w-full p-2 bg-blue-200 text-blue-900 border-[1px] border-blue-400 rounded-md relative' key={eachStatus.trackingStatusId} >
                          <div className='absolute right-3'>
                            <p className='inline-block mr-3'>{new Date(eachStatus.createdAt).toLocaleTimeString()}</p>
                            <p className='inline-block'>{new Date(eachStatus.createdAt).toLocaleDateString()}</p>
                          </div>
                          <h3 className='font-semibold text-lg truncate'>
                            {eachStatus.title}
                          </h3>
                          <p className='truncate'>
                            {eachStatus.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  }
                </div>
                
              </div>
            </div>

            {/* assignments portion */}
            <div className="w-[40%] px-5 py-3 relative">
              <div className="flex flex-col items-center relative  w-full h-full">
                <h2 className='text-3xl font-semibold mb-4'>Assignments</h2>
                {(assigns.length == 0)
                  ? <div className='h-[50vh] flex items-center text-gray-400'>
                    No Assignments
                  </div>
                  : <div className='min-w-[75%] relative'>
                    {assigns.map((eachAssign, idx) => (
                      <div key={idx} className={`slide center   ${idx == currIdx ? "active" : ""}`} >
                        <AssignCardComponent
                          key={eachAssign._id}
                          pathName={eachAssign.pathId.pathName}
                          pathId={eachAssign.pathId.pathId}
                          dustbinNo={eachAssign.pathId.noOfDustbins}
                          driverName={eachAssign.driverUsername.fullName}
                          vehicleNo={eachAssign.vehicleReg.vehicleReg}
                          className='driverSlides visible'
                          // {...console.log(eachassign)}
                        />

                      </div>
                    ))}
                    <button className='text-6xl text-gray-500 rounded-l-md absolute top-1/2 right-0 -translate-y-1/2 px-3 py-3'
                      onClick={nextSlide}
                    >
                      <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                    <button className='text-6xl text-gray-500 rounded-l-md absolute top-1/2 left-0 -translate-y-1/2 px-3 py-3'
                      onClick={prevSlide}
                    >
                      <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <div className='absolute bottom-2 flex gap-2 left-1/2 -translate-x-1/2'>
                      {assigns.map((eachAssign, idx) => (
                        <div key={idx}
                          className={`w-2 h-2 rounded-full transition-all duration-200
                                      ${(idx == currIdx) ? 'bg-gray-600' : 'bg-gray-400'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                }
                {/* <Slide> */}
                
                {/* </Slide> */}

                

              </div>
            </div>
          </div>
          {/* {slideShow()} */}
        </div>
        : <>{navigate("/login")}</>
      }
    </>
    
     
  );
};


export default Dashboard;
