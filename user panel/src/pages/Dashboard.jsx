import { useState } from "react";
import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import CardsComponent from "../components/CardsComponent";
import { faClock, faLocationDot, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar, faClock as faRegularClock } from '@fortawesome/free-regular-svg-icons';
// import { faStar } from "@fortawesome/free-solid-svg-icons";
import cityBG from "../assets/cityBG.jpg"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>

            {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
                ? <div>
                    <div className="w-full top-0 z-10">
                        <NavBarComponent />
                    </div>

                    <div className="dashboardContainer min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-6">
                        <div className="flex flex-col gap-6 justify-center items-center h-[45vh]">
                            <h1>On-Demand Garbage Collection</h1>
                            <p className="w-[40vw] text-center">Request garbage collection at your convenience. Our efficient service ensures a cleaner environment for everyone.</p>
                            <button
                                className="inline-block w-48 bg-green-700 py-2 font-medium text-white rounded-full"
                                onClick={() => {navigate("/request")}}
                            >Request Collection</button>
                        </div>
                        <div className="grid gap-5 w-[85vw]
                                        grid-cols-3">
                            <CardsComponent
                                icon={faTruckFast}
                                heading={"Quick Collection"}
                                message={"Schedule a pickup at your preffered time"}
                                onclick={() => {navigate("/request")}}
                            />
                            <CardsComponent 
                                icon={faRegularClock}
                                heading={"Collection History"}
                                message={"Know when your waste was collected"}
                                onclick={() => {navigate("/history")}}
                            />
                            <CardsComponent
                                icon={faRegularStar}
                                heading={'Service Feedback'}
                                message={"Help us improve with your feedback"}
                                onclick={() => {navigate("/feedback")}}
                            />
                        </div>
                        <div className="relative h-[300px] w-full overflow-hidden my-10 mx-5 rounded-lg">
                            <img src={cityBG} alt="" className="absolute w-full h-full object-cover z-0" />
                            <div className="absolute w-full h-full z-10 text-white bg-black/50 flex flex-col gap-4 justify-center items-center">
                                <h1>Building Cleaner Cities</h1>
                                <p className="text-lg">Join us in our mission to keep our cities clean and sustainable</p>
                            </div>
                        </div>
                    </div>
                </div>
                : <></>
            }


        </>
    )
}

export default HomePage;