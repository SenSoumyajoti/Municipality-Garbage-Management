import { useState } from "react";
import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import StarRating from "../components/StarRating";
import siteLogo from "../assets/GreenSiteLogo.jpg"
import MapComponent from "../components/MapComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L from "leaflet";
import tempIcon from "../assets/tempDustbinMarker.png";
import { Marker, useMapEvent } from "react-leaflet";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const CollectionRequestPage = () => {
    const [addDustbin, setAddDustbin] = useState(null);

    // Event listeners on map
    const EventListenerComponent = () => {
        useMapEvent("click", (e) => {
            console.log("Clicked on ", e.latlng);
            setAddDustbin({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            })
        })

        return null
    }

    // custom icon for temporaty checkpoint
    const tempMarker = new L.icon({
        iconUrl: tempIcon,
        iconSize: [30, 30],
        iconAnchor: [15, 22],
        popupAnchor: [0, -45]
    });

    return (
        <>
            <div className="w-full top-0 z-10">
                <NavBarComponent />
            </div>

            <div className="feedbackContainer min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-6">
                <div className="relative p-10 pb-7 mt-16 mb-10" style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}>
                    <div
                        className="logoContainer absolute h-24 w-24 flex justify-center items-center rounded-full top-0 left-1/2 -translate-1/2 overflow-hidden"
                        style={{boxShadow: "5px 5px 10px 4px rgb(0 0 0 / 0.1), -5px -5px 10px 4px rgb(0 0 0 / 0.1)"}}
                    >
                        <img src={siteLogo} alt="" className="mix-blend-darken" />
                    </div>
                    <div className="text-green-600 text-center my-3">
                        <h1>Request A Quick Collection</h1>
                    </div>
                    <form className="flex flex-col items-center">
                        <div className="grid grid-cols-2 gap-20">
                            <div className="flex flex-col gap-7">
                                <div className="flex flex-col gap-2">
                                    <p>Full Name</p>
                                    <div className="feedbackOptions p-2 text-lg border-2 border-gray-300 rounded-sm flex gap-10">
                                        <div>
                                            <input type="text" className="outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p>Address</p>
                                    <div className="feedbackOptions p-3 border-2 border-gray-300 rounded-sm">
                                        <input type="text" className="outline-none" />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <p>Garbage Type</p>
                                    <div className="feedbackOptions p-3 border-2 border-gray-300 rounded-sm">
                                        <select className="outline-none w-full">
                                            <option value="dry">Dry</option>
                                            <option value="wet">Wet</option>
                                            <option value="mixed">Mixed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-7">
                                <div className="flex flex-col gap-2">
                                    <p>Phone No.</p>
                                    <div className="feedbackOptions p-2 text-lg border-2 border-gray-300 rounded-sm flex gap-10">
                                        <div>
                                            <input type="text" className="outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p>Estimated Garbage Quantity</p>
                                    <div className="feedbackOptions p-3 border-2 border-gray-300 rounded-sm">
                                        <input type="text" className="outline-none" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p>Date Of Collection</p>
                                    <div className="feedbackOptions p-2 text-lg border-2 border-gray-300 rounded-sm flex gap-10">
                                        <div className="w-full">
                                            <input type="date" className="outline-none w-full"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 w-full">
                            <label htmlFor="">Choose Garbage Collection Point</label>
                            <div className="w-full h-52 border-2 border-gray-300 rounded-md mt-2">
                                <MapComponent zoom={11}>
                                    {addDustbin && addDustbin.lat && addDustbin.lng && (
                                        <Marker icon={tempMarker} position={[addDustbin.lat, addDustbin.lng]}>
                                        </Marker>
                                    )}
                                    <EventListenerComponent />
                                </MapComponent>
                            </div>
                        </div>
                        <input type="submit" className="inline-block w-32 bg-green-700 py-2 font-medium text-white rounded-full mt-5"/>
                    </form>
                </div>

            </div>
        </>
    )
}

export default CollectionRequestPage;