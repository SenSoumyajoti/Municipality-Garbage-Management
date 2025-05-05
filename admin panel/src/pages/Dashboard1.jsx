import React, { useEffect, useState } from "react"
import NavBarComponent from "../components/NavBarComponent";
import AssignCardComponent from "../components/AssignCardComponent";
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
const backendURL = import.meta.env.VITE_BACKEND_URL

const Dashboard1 = () => {
    const [profiles, setProfiles] = useState([]);
    const [currIdx, setCurrIdx] = useState(0);

    const nextSlide = () => {
        const nextIdx = (currIdx + 1) % profiles.length;
        setCurrIdx(nextIdx);
    }

    const fetchProfiles = async () => {
        try{
            const response = await fetch(`${backendURL}/assign/getAllAssigns?populateArea=true&populateDustbin=true&populateDriver=true&populateVehicle=true`, {
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok) {
                setProfiles(data.assignments);
            }
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchProfiles();
    })

    return (
        <>
            <div className='fixed w-full top-0 z-10'>
                <NavBarComponent />
            </div>
            <div className="w-full h-[calc(100vh-4rem)] mt-16 flex">
                {/* <div className="w-[60%] h-full p-5 border-2 border-black">
                    <h2 className="text-3xl mb-4 font-semibold">Tracking Status</h2>
                    <div>Updates ...</div>
                </div> */}
                <div className="w-[100%] h-full p-5 relative overflow-hidden border-2 border-black">
                    <h2 className="text-3xl mb-4 font-semibold">Assignments</h2>
                    {/* <Slide> */}
                    {profiles.map((eachProfile, idx) => (
                        <div key={idx} className={`slide ${idx == currIdx ? "active" : ""}`}>
                            <AssignCardComponent 
                                key={eachProfile._id}
                                // className={`slide ${idx == currIdx ? "active" : ""}`}
                                areaName={eachProfile.areaId.areaName}
                                areaId={eachProfile.areaId.areaId}
                                dustbinNo={eachProfile.areaId.noOfDustbins}
                                driverName={eachProfile.driverUsername.fullName}
                                vehicleNo={eachProfile.vehicleReg.vehicleReg}
                            />
                            
                        </div>
                    ))}
                    <button className="absolute top-2 right-2" onClick={nextSlide}>Next</button>
                    {/* </Slide> */}
                </div>
            </div>
        </>
    )

}

export default Dashboard1