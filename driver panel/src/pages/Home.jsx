import { useEffect, useRef, useState } from "react";
import {Navigate, useNavigate} from 'react-router-dom'
import MapComponent from "../components/MapComponent";
import { Marker, Popup, useMapEvent } from "react-leaflet";
import L from 'leaflet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash, faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons"
// import tempDustbinIcon from "../assets/tempDustbinMarker.png"
import dustbinIcon from "../assets/dustbinMarker.png"
import dustbinIcon1 from '../assets/dustbin1.png'
import carIcon from "../assets/carMarker.png"
import { io } from "socket.io-client";
import { socket } from "../App";
import NavBarComponent from "../components/NavBarComponent";
import RoutingComponent from "../components/RoutingComponent";
const backendURL = import.meta.env.VITE_BACKEND_URL

function Home() {
    const [pathId, setPathId] = useState();
    const [driver, setDriver] = useState();
    const [vehicle, setVehicle] = useState();
    const [dustbins, setDustbins] = useState([]);
    const [checkPoints, setCheckPoints] = useState([]);
    const [assignment, setAssignment] = useState();

    const [isBellowAspect, setIsBellowAspect] = useState();
    const [mapCenter, setMapCenter] = useState({ lat: 23.526208, lng: 86.923270});
    const [carPosition, setCarPosition] = useState({lat: undefined, lng: undefined})
    const [isStarted, setIsStarted] = useState(false);
    const [watchId, setWatchId] = useState();
    const [lcnShrCnt, setLcnShrCnt] = useState(0);
    const [isExpandedCurrPathDetails, setIsExpandedCurrPathDetails] = useState(false);
    const navigate = useNavigate();
    const ref = useRef();

    // custom icon for dustbin
    const dustbinMarker = new L.icon({
        iconUrl: dustbinIcon,
        iconSize: [50, 50],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });

    // custom icon for car
    const carMarker = new L.icon({
        iconUrl: carIcon,
        iconSize: [35, 35],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });

    const expandCurrPathDetails = () => {
        setIsExpandedCurrPathDetails(true)
    }

    const shrinkCurrPathDetails = () => {
        setIsExpandedCurrPathDetails(false)
    }

    const createStartJrnyStatus = async () => {
        const response = await fetch(`${backendURL}/trackingStatus/create`, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                title: 'Started Journey',
                message: `Vehicle no. ${vehicle.vehicleReg}, driven by ${driver.fullName}, started journey on path ID ${pathId.pathId}`,
                pathId: pathId.pathId,
                driverUsername: driver.username,
                vehicleReg: vehicle.vehicleReg
            })
        })
        if(response.ok){
            socket.emit('status created');
        }
    }

    const createEndJrnyStatus = async () => {
        const response = await fetch(`${backendURL}/trackingStatus/create`, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                title: 'Ended Journey',
                message: `Vehicle no. ${vehicle.vehicleReg}, driven by ${driver.fullName}, ended journey on path ID ${pathId.pathId}`,
                pathId: pathId.pathId,
                driverUsername: driver.username,
                vehicleReg: vehicle.vehicleReg
            })
        })
        if(response.ok){
            socket.emit('status created');
        }
    }

    const createDustbinMatchStatus = async (currLat, currLng) => {
        dustbins.map(async (eachDustbin) => {
            if(((eachDustbin.coords.lat - currLat <= 0.0001) && (eachDustbin.coords.lat - currLat >= -0.0001)) && ((eachDustbin.coords.lng - currLng <= 0.0001) && (eachDustbin.coords.lng - currLng >= -0.0001))){
                const response = await fetch(`${backendURL}/trackingStatus/create`, {
                    method: 'POST',
                    headers: {
                        'Content-type' : 'application/json'
                    },
                    body: JSON.stringify({
                        title: 'Dustbin Reached',
                        message: `Vehicle no. ${vehicle.vehicleReg}, driven by ${driver.fullName}, reached dustbin ID ${eachDustbin.dustbinId}, located on path ID ${pathId.pathId}`,
                        pathId: pathId.pathId,
                        dustbinId: eachDustbin.dustbinId,
                        driverUsername: driver.username,
                        vehicleReg: vehicle.vehicleReg
                    })
                })
                if(response.ok){
                    socket.emit('status created');
                }
            }
        })
    }

    const startJrny = () => {
        setIsStarted(true);
        createStartJrnyStatus()
        const id = navigator.geolocation.watchPosition((position)=>{
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLcnShrCnt(prev => (prev+1));
            socket.emit("send location", {location: position.coords, pathId: pathId});
            setMapCenter({lat: lat, lng: lng});
            setCarPosition({lat: lat, lng: lng});
            createDustbinMatchStatus(lat, lng);
        });

        setWatchId(id);

        return () => navigator.geolocation.clearWatch(id);
    }

    const endJrny = () => {
        setIsStarted(false);
        createEndJrnyStatus();
        navigator.geolocation.clearWatch(watchId);
        setCarPosition({lat: undefined, lng: undefined});
        setLcnShrCnt(0)
        socket.emit("stop location", {pathId: pathId})
    }

    const getAssignDetails = async (driverUsername) => {
        const response = await fetch(
            `${backendURL}/assign/getAllAssigns/_/${driverUsername}?populatePath=true&populateDustbin=true&populateDriver=true&populateVehicle=true`,
            {
                method: 'GET',
            }
        )

        const data = await response.json();
        console.log(data)
        if(response.ok){
            setAssignment(data.assignment);
            setPathId(data.assignment.pathId);
            setDriver(data.assignment.driverUsername);
            setVehicle(data.assignment.vehicleReg);
            setDustbins(data.assignment.pathId.dustbins);
            setCheckPoints(data.assignment.pathId.checkPoints);
        }
    }

    useEffect(() => {
        const checkAspectRatio = () => {
            setIsBellowAspect( window.innerHeight / window.innerWidth < 1 )
        }

        checkAspectRatio();
        window.addEventListener('resize', checkAspectRatio);

        socket.on('disconnect', () => {
            setIsStarted(false);
            createEndJrnyStatus();
            navigator.geolocation.clearWatch(watchId);
            setCarPosition({lat: undefined, lng: undefined});
            socket.emit("stop location", {pathId: pathId});
        })

        return () => {
            window.removeEventListener('resize', checkAspectRatio);
            socket.disconnect()
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if(storedToken){
            const parsedToken = JSON.parse(storedToken);

            console.log(parsedToken)
            getAssignDetails(parsedToken.username);
        }
        
    },[]);

    return (
        <>
            {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
                ? <div>
                    <div className='fixed w-full top-0 z-10'>
                        <NavBarComponent />
                    </div>
                    <div className="flex justify-between mt-16 relative">
                        { (isBellowAspect != undefined) ?
                            <div className={`w-full flex ${ isBellowAspect ? 'flex-row' : 'flex-col h-[calc(100vh-4rem)]' } relative`}>
                                {/* map portion */}
                                <div className={`map z-0 ${ isBellowAspect ? ('w-[100%] h-[calc(100vh-4rem)]') : ('h-[calc(58vh-2rem)] w-full')}`}>
                                    <MapComponent center={mapCenter}>
                                        {/* Marker for all dustbins */}
                                        {dustbins.map((eachDustbin, idx) => (
                                            <Marker key={idx} position={[eachDustbin.coords.lat, eachDustbin.coords.lng]} icon={dustbinMarker}>
                                                <Popup>
                                                    {/* <div className="flex gap-2 justify-end mb-1">
                                                        <button><FontAwesomeIcon icon={faPencil} /></button>
                                                        <button dustbinid={eachDustbin.dustbinId} pathid="PB101" onClick={deleteDustbin}><FontAwesomeIcon icon={faTrash} /></button>
                                                    </div> */}
                                                    <pre>ID  : {eachDustbin.dustbinId}</pre>
                                                    <pre>No. : {eachDustbin.dustbinNo}</pre>
                                                </Popup>
                                            </Marker>
                                        ))}

                                        {/* Marker for car */}
                                        {carPosition.lat != undefined ?
                                            <Marker  position={[carPosition.lat, carPosition.lng]} icon={carMarker}>
                                                <Popup>
                                                    
                                                </Popup>
                                            </Marker>
                                            : <></>
                                        }
                                        

                                        {/* Temporary Marker for new dustbin */}
                                        {/* {addDustbin.lat && addDustbin.lng && (
                                            <Marker icon={tempAddDustbinMarker} position={[addDustbin.lat, addDustbin.lng]}>
                                                <Popup>Add Dustbin Here ?</Popup>
                                            </Marker>
                                        )} */}
                                        {console.log(checkPoints)}
                                        {checkPoints && (
                                        <RoutingComponent checkPoints={checkPoints} />
                                        )}
                                        {/* <EventListenerComponent/> */}
                                    </MapComponent>
                                </div>
                                
                                {/* control portion */}
                                <div
                                    className={`controls p-10 z-[1] absolute bg-white rounded-xl flex flex-col gap-5
                                                ${ isBellowAspect ? 'w-[42%] min-h-[9rem] right-3 bottom-3' : 'min-h-[calc(42vh-2rem)] w-full right-0 bottom-0 rounded-b-none'}`}
                                    style={{ boxShadow: "-10px 0px 20px -5px rgba(0, 0, 0, 0.3) , 10px 0px 20px 5px rgba(0, 0, 0, 0.3)" }}
                                >
                                    {/* <div className="inline-block">
                                        { addDustbin.allow
                                            ? addDustbin.lat
                                                ? <div>
                                                    <div>Add dustbin at {addDustbin.lat}, {addDustbin.lng} ?</div>
                                                    <form onSubmit={addToDustbins} className="my-10">
                                                        <input
                                                            className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                            type="text" placeholder="Dustbin ID" name="dustbinId" value={addDustbinFormData.dustbinId}
                                                            onChange={handleInputChange} />
                                                        <input
                                                            className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                            type="number" placeholder="Dustbin No" name="dustbinNo" value={addDustbinFormData.dustbinNo}
                                                            onChange={handleInputChange} />
                                                        <input
                                                            className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                            type="text" placeholder="path ID" name="pathId" value={addDustbinFormData.pathId}
                                                            onChange={handleInputChange} />
                                                        <div className="flex gap-2 mt-10">
                                                            <button type="submit" className="w-32 text-center text-white text-lg px-5 py-2 bg-green-700 rounded-full cursor-pointer">Add</button>
                                                            <div onClick={ () => setAddDustbin({allow: true}) } className="w-32 text-center text-white text-lg px-5 py-2 bg-red-700 rounded-full cursor-pointer">Cancel</div>
                                                        </div>
                                                    </form>
                                                </div> 
                                                
                                                : <div>
                                                    <div>Drop pin to add...</div>
                                                    <div onClick={ () => setAddDustbin({allow: false}) } className="w-32 text-center text-white text-lg px-5 py-2 bg-red-700 rounded-full cursor-pointer">Cancel</div>
                                                </div>
                                            : <div className="px-5 py-3 border-black border-2 rounded-full cursor-pointer" onClick={allowAddDustbin}>Add Dustbin</div>
                                        }
                                    </div> */}
                                    {assignment
                                        ? <div className="relative">
                                            <div
                                                className={`absolute top-0 right-0 text-3xl text-green-700 transition-all duration-300 ease-out cursor-pointer
                                                            ${isExpandedCurrPathDetails ? 'rotate-180' : ''}`}
                                                onClick={isExpandedCurrPathDetails ? shrinkCurrPathDetails : expandCurrPathDetails }
                                            >
                                                <FontAwesomeIcon icon={faAngleUp}/>
                                            </div>
        
                                            {/* Path Details */}
                                            <div className="w-[calc(100%-30px)] text-2xl mb-2 text-green-700 truncate">
                                                <p className="inline font-bold">Path ID : </p>
                                                <p className="inline">{pathId.pathId}</p>
                                            </div>
                                            
                                            <div
                                                ref={ref}
                                                className={`overflow-hidden transition-[all] duration-300 ease-out mb-4`}
                                                style={{
                                                    maxHeight: isExpandedCurrPathDetails ? `${ref.current?.scrollHeight}px` : '0',
                                                    opacity: isExpandedCurrPathDetails ? '100%' : '0%'
                                                }}
                                            >
                                                {pathId && (
                                                    <div className="text-lg">
                                                        <div className="truncate mb-1">
                                                            <p className="inline font-bold">Path Name : </p>
                                                            <p className="inline">{pathId.pathName}</p>
                                                        </div>
                                                        <div className="truncate mb-1">
                                                            <p className="inline font-bold">No Of Dustbins : </p>
                                                            <p className="inline">{pathId.noOfDustbins}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* vehicle details */}
                                            <div className="w-[calc(100%-30px)] text-2xl mb-2 text-green-700 truncate">
                                                <p className="inline font-bold">Vehicle Reg : </p>
                                                <p className="inline">{vehicle.vehicleReg}</p>
                                            </div>
                                            
                                            <div
                                                ref={ref}
                                                className={`overflow-hidden transition-[all] duration-300 ease-out`}
                                                style={{
                                                    maxHeight: isExpandedCurrPathDetails ? `${ref.current?.scrollHeight}px` : '0',
                                                    opacity: isExpandedCurrPathDetails ? '100%' : '0%'
                                                }}
                                            >
                                                {pathId && (
                                                    <div className="text-lg">
                                                        <div className="truncate mb-1">
                                                            <p className="inline font-bold">Vehicle ID : </p>
                                                            <p className="inline">{vehicle.vehicleId}</p>
                                                        </div>
                                                        <div className="truncate mb-1">
                                                            <p className="inline font-bold">No Of Checkpoints : </p>
                                                            <p className="inline">{vehicle.capacity}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        : <></>
                                    }
                                    {isStarted
                                        ? <div className="w-52 text-center text-white text-xl px-5 py-3 bg-red-600 rounded-full cursor-pointer" onClick={endJrny}>
                                            End Journey
                                        </div>
                                        : <div className="w-52 text-center text-white text-xl px-5 py-3 bg-green-700 rounded-full cursor-pointer" onClick={startJrny}>
                                            Start Journey
                                        </div>
                                    }

                                    {/* <div>
                                        <p>No. of times Location Shared : {lcnShrCnt}</p>
                                    </div> */}
                                    
                                </div>
                            </div>

                            : <div></div>
                        }
                    </div>
                </div>

                : <>{navigate("/login")}</>
            }
        </>
    )
}

export default Home