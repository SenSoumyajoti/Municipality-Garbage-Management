import { useState } from "react";
import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import dustbinIcon from "../assets/dustbinMarker.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import MapComponent from "../../../user panel/src/components/MapComponent";
import { Marker } from "react-leaflet";
// import siteLogo from "../assets/GreenSiteLogo.jpg";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const CollectionRequests = () => {
    const [userId, setUserId] = useState('');
    const [prevRequests, setPrevRequests] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // custom icon for dustbin
    const dustbinMarker = new L.icon({
        iconUrl: dustbinIcon,
        iconSize: [50, 50],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });

    const fetchPrevRequests = async () => {
        const response = await fetch(`${backendURL}/reqCollection/getAllReqCollections`, {
            method: 'GET',
            headers: {
                'content-type' : 'application/json'
            }
        });

        const data = await response.json();
        console.log(data.reqCollections)

        if(response.ok) {
            setPrevRequests(data.reqCollections);
        }
    }

    const openMapPopup = (location) => {
        console.log("hii");
        
        setSelectedLocation({lat: location.lat, lng: location.lng});
        console.log("there");
        
    }

    const closeMapPopup = () => {
        setSelectedLocation(null);
    }

    useEffect(() => {
        fetchPrevRequests();
    }, []);

    return (
        <>
            <div className="w-full top-0 z-10">
                <NavBarComponent />
            </div>

            <div className="reqHistoryContainer min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-6">
                <div className="relative p-10 pb-7 mt-16" style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}>
                    {/* <div
                        className="logoContainer absolute h-24 w-24 flex justify-center items-center rounded-full top-0 left-1/2 -translate-1/2 overflow-hidden"
                        style={{boxShadow: "5px 5px 10px 4px rgb(0 0 0 / 0.1), -5px -5px 10px 4px rgb(0 0 0 / 0.1)"}}
                    >
                        <img src={siteLogo} alt="" className="mix-blend-darken" />
                    </div> */}

                    <div className="text-green-600 text-center my-3">
                        <h1 className="text-3xl font-bold">All Collection Requests</h1>
                    </div>

                    <table className="reqHistoryTable w-[60vw] border-2 border-gray-500">
                        <thead>
                            <tr className="text-green-700">
                                <th>Date of Request</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Garbage Type</th>
                                <th>Garbage Quantity</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Date of Collection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prevRequests.map((eachReq, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(eachReq.createdAt).toLocaleTimeString()} {new Date(eachReq.createdAt).toLocaleDateString()}</td>
                                    <td>{eachReq.fullName}</td>
                                    <td>{eachReq.address}</td>
                                    <td>{eachReq.garbageType}</td>
                                    <td>{eachReq.quantity}KG</td>
                                    <td className="flex gap-3 items-center">
                                        <div>
                                            <p>{eachReq.location.lat.toFixed(5)}</p>
                                            <p>{eachReq.location.lng.toFixed(5)}</p>
                                        </div>
                                        <div className="text-xl text-green-800 cursor-pointer" onClick={() => openMapPopup(eachReq.location)}>
                                            <FontAwesomeIcon icon={faLocationDot}/>
                                        </div>
                                    </td>
                                    <td className={``}>{eachReq.status}</td>
                                    <td>{new Date(eachReq.collectionDate).toLocaleTimeString()} {new Date(eachReq.collectionDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>

                {selectedLocation && (
                    <div
                        className={`absolute w-[60vw] h-[70vh] rounded-lg overflow-hidden top-1/2 -translate-y-1/2 z-[15] `}
                        style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}
                    >
                        <div className="absolute w-8 h-8 text-white text-2xl flex justify-center items-center cursor-pointer bg-black opacity-50 top-5 right-5 rounded-full z-[20]" onClick={closeMapPopup}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </div>
                        <MapComponent position={{lat:selectedLocation.lat, lng:selectedLocation.lng}}>
                            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={dustbinMarker} />
                        </MapComponent>
                    </div>
                )}

            </div>

            {/* blured layer */}
            <div
                className={`bluredLayer w-screen h-screen bg-black opacity-50 backdrop-blur-2xl z-[11] absolute top-0 left-0 
                            ${selectedLocation == null ? 'hidden' : 'block'}`}
                >
            </div>
        </>
    )
}

export default CollectionRequests;