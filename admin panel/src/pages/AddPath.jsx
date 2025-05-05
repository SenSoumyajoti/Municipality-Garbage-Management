import { useEffect, useRef, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Marker, Popup, useMap, useMapEvent } from "react-leaflet";
import L from 'leaflet'
import 'leaflet-routing-machine'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash, faAngleDown, faXmark, faPlus, faAngleUp } from "@fortawesome/free-solid-svg-icons"
import carIcon from "../assets/carMarker.png"
import checkpointIcon from "../assets/checkPoint1.png"
import tempIcon from "../assets/tempDustbinMarker.png"
import dustbinIcon from "../assets/dustbinMarker.png"
import { socket } from "../App";
import RoutingComponent from "../components/RoutingComponent";
import NavBarComponent from "../components/NavBarComponent";
import AllPathsComponent from "../components/AllPathsComponent";
import { useLocation, useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL

const AddPath = () => {
    const [formPathId, setFromPathId] = useState('');
    const [formPathName, setFormPathName] = useState('')
    const [addNewPath, setAddNewPath] = useState(false)
    const [currPath, setCurrPath] = useState();
    const [pathId, setPathId] = useState();
    const [refreshPaths, setRefreshPaths] = useState(true);
    const [checkPoints, setCheckPoints] = useState([]);
    let [addCheckPoint, setAddCheckPoint] = useState({allow: false});
    let [isBellowAspect, setIsBellowAspect] = useState();
    const [isBlured, setIsBlured] = useState(false);
    const [isExpandedPathList, setIsExpandedPathList] = useState(false);
    const [isExpandedCurrPathDetails, setIsExpandedCurrPathDetails] = useState(false);
    const navigate = useNavigate();
    const ref = useRef()
    
    const getQueryParameter = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = urlParams.get(name);
        return params;
    }

    const handleCreatePathClick = () => {
        setIsExpandedPathList(false)
        navigate("/addPath")
    }

    const createPath = async (e) => {
        e.preventDefault()
        const response = await fetch(`${backendURL}/path/createPath`,{
            method: 'POST',
            headers: {
                'Content-type' : "application/json"
            },
            body: JSON.stringify({
                pathId: formPathId,
                pathName: formPathName
            })
        })
        const data = await response.json();
        alert(data.message);
        if(response.ok) {
            navigate(`/addPath?pathId=${data.createdPath.pathId}`)
            setRefreshPaths(prev => !prev)
        }
    }

    const handleNavigation = (pathId) => {
        setIsExpandedPathList(false)
        navigate(`/addPath?pathId=${pathId}`)
    }

    const expandPathlist = () => {
        setIsExpandedPathList(true)
        setIsBlured(true)
    }

    const shrinkPathlist = () => {
        setIsExpandedPathList(false)
        setIsBlured(false)
    }

    const expandCurrPathDetails = () => {
        setIsExpandedCurrPathDetails(true)
    }

    const shrinkCurrPathDetails = () => {
        setIsExpandedCurrPathDetails(false)
    }

    // custom icon for checkpoint
    const checkpointMarker = new L.icon({
        iconUrl: checkpointIcon,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -45]
    });

    // custom icon for temporaty checkpoint
    const tempMarker = new L.icon({
        iconUrl: tempIcon,
        iconSize: [30, 30],
        iconAnchor: [15, 22],
        popupAnchor: [0, -45]
    })

    // fetch all checkpoints of the path
    const getCurrPathDetails = async (pathId) => {
        const response = await fetch(
            `${backendURL}/path/getAllPaths/${pathId}`,
            {
                method: 'GET'
            }
        );
        const data = await response.json();
        if(response.ok){
            setCurrPath(data.path)
            setCheckPoints(data.path.checkPoints);
        }
    }

    // const getPath = async () => {
    //     const map = useMap();

    //     if(!map) return;

    //     const routingControl = L.Routing.control({
    //         waypoints: checkPoints.map(({lat, lng}) => L.latLng(lat, lng)),
    //         routeWhileDragging: true
    //     }).addTo(map);
    // }

    const allowAddCheckPoint = () => {
        setAddCheckPoint(prevState => ({
            ...prevState,
            allow: true
        }));
    }

    // create new checkpoint
    const createCheckPoint = async (e) => {
        console.log(addCheckPoint)
        e.preventDefault();
        const response = await fetch(
            `${backendURL}/path/addCheckPoint`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    checkPoint: {
                        CPId: `${pathId}-CP-${checkPoints.length + 1}`,
                        lat: addCheckPoint.lat,
                        lng: addCheckPoint.lng
                    },
                    pathId: pathId
                })
            }
        )

        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setAddCheckPoint({allow: false});
            setCheckPoints(prevCheckPoints => [ ...prevCheckPoints, data.addedCheckPoint ]);
        }
    }

    const deleteCheckPoint = async (e) => {
        const CPId = e.currentTarget.getAttribute("cpid");
        const pathId = e.currentTarget.getAttribute("pathid");
        const response = await fetch(
            `${backendURL}/path/deleteCheckPoint`,
            {
                method: 'DELETE',
                headers: {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({
                    CPId,
                    pathId
                })
            }
        )

        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setCheckPoints(prevCheckPoints => prevCheckPoints.filter(checkPoint => checkPoint.CPId != CPId));
        }
    }

    // Event listeners on map
    const EventListenerComponent = () => {
        if(addCheckPoint.allow){
            useMapEvent("click", (e) => {
                console.log("Clicked on ", e.latlng);
                setAddCheckPoint({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    allow: true
                })
            })
        }

        return null
    }

    // useEffect(() => {
    //     const map = useMap();

    //     const routingControl = L.Routing.control({
    //         waypoints: 
    //             checkPoints.map((eachCheckPoint) => 
    //                 L.latLng(eachCheckPoint.lat, eachCheckPoint.lng)
    //             )
    //         ,
    //         routeWhileDragging: true
    //     }).addTo(map)

    //     return () => map.removeControl(routingControl);
    // }, [])

    useEffect(()=>{
        const pathId = getQueryParameter('pathId')
        setPathId(pathId);
        if(pathId == null){
            setAddNewPath(true)
            setIsBlured(true)
            setCheckPoints([])
        }
        else{
            setAddNewPath(false)
            setIsBlured(false)
            getCurrPathDetails(pathId);
        }
    }, [useLocation().search]);

    useEffect(() => {
        const checkAspectRatio = () => {
            setIsBellowAspect( window.innerHeight < window.innerWidth );
        }

        checkAspectRatio();
        window.addEventListener('resize', checkAspectRatio);

        return () => window.removeEventListener('resize', checkAspectRatio);
    }, []);
    

    return (
        <>
            <div className='fixed w-full top-0 z-10'>
                <NavBarComponent />
            </div>
            <div className="flex justify-between mt-16 relative">
                { (isBellowAspect != undefined) ?
                    <>
                        {(isBellowAspect || isExpandedPathList)
                            // side bar of path list container
                            ? <div className={`sidePathListContainer h-full bg-white ${isBellowAspect ? 'w-96' : 'absolute w-80'} z-[5] overflow-y-auto`}>    {/* index.css */}
                                {!isBellowAspect
                                    ? <div className="m-4 flex flex-row-reverse">
                                        <div className="w-9 h-9 p-2 text-xl border-2 border-black rounded-full flex justify-center items-center cursor-pointer"
                                            onClick={shrinkPathlist}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                    </div>
                                    : <></>
                                }

                                {/* side bar of path list */}
                                <div className={`sidePathList  ${isBellowAspect ? 'h-[calc(100vh-4rem)]' : 'h-[calc(100vh-4rem-3.25rem)]'}`}>  {/* to handle the height*/}
                                    <div className="py-5">
                                        {/* create new path div */}
                                        <div className="w-full px-5 mb-3 flex flex-col">
                                            <div
                                                className={`w-full h-40 ${(pathId == null) ? 'border-4' : 'border-2'} border-green-700 rounded-lg flex flex-col gap-2 justify-center items-center relative`}
                                                style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}
                                                onClick={handleCreatePathClick}
                                            >
                                                <div className="h-20 w-20 text-4xl rounded-full bg-gray-300 overflow-hidden flex justify-center items-center">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </div>
                                                <div className="">Create New Path</div>
                                                
                                                {/* <div>Checkpoints No. : {eachPath.checkPoints.length}</div>
                                                <div>Dustbins No. : {eachPath.dustbins.length}</div> */}
                                            </div>
                                        </div>

                                        {/* fetching all the paths */}
                                        <AllPathsComponent currentPathId={pathId} onPathClick={handleNavigation} refreshPaths={refreshPaths} />
                                    </div>
                                </div>
                            </div>

                            // expand path list button for mobiles only
                            : <div className="absolute top-0 left-0 w-10 h-10 bg-white flex justify-center items-center z-[3]"
                                onClick={expandPathlist}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        }

                        {/* main page portion */}
                        <div className={`w-full flex ${ isBellowAspect ? 'flex-row' : 'flex-col h-[calc(100vh-4rem)]' } relative`}>
                            {/* form for creating new path */}
                            <div
                                className={`absolute z-[3] rounded-lg flex flex-col items-center p-5 left-1/2 -translate-x-1/2 transition-all duration-150
                                            ${addNewPath ? 'top-1/2 -translate-y-1/2' : 'top-0 -translate-y-full'}`}
                                style={{background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}
                            >
                                <h1 className="text-3xl mb-10">Create New Path</h1>
                                <form className="flex flex-col items-center"
                                    onSubmit={createPath}>
                                    <div className="inputsContainer flex flex-col gap-3">    {/* index.css */}
                                        <div className="flex flex-col">
                                            <label htmlFor="pathId">Path ID</label>
                                            <input type="text" id='pathId' name="pathId"
                                                className="inputFields px-3 py-2 w-80 border-2 border-black rounded-md"
                                                onChange={(e) => setFromPathId(e.target.value)} />    {/* index.css */}
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="pathName">Path Name</label>
                                            <input type="text" id='pathName' name="pathName"
                                                className="inputFields px-3 py-2 w-80 border-2 border-black rounded-md"
                                                onChange={(e) => setFormPathName(e.target.value)} />
                                        </div>
                                    </div>
                                    {/* {formErr != ''
                                        ? <div className="mt-3 text-red-600">{formErr}</div>
                                        : <></>
                                    } */}
                                    <div className="inline-block w-32 mt-7 bg-green-700 py-2 text-lg font-medium text-white rounded-full text-center cursor-pointer">
                                        <input type="submit" value={'Create'} />
                                    </div>
                                </form>
                            </div>

                            {/* map portion */}
                            <div className={`map z-0 ${ isBellowAspect ? ('w-[100%] h-[calc(100vh-4rem)]') : ('h-[calc(58vh-2rem)] w-full')}`}>
                                <MapComponent>
                                    {/* Marker for all dustbins */}
                                    {checkPoints.map((eachCheckPoint, idx) => (
                                        <Marker key={idx} position={[eachCheckPoint.lat, eachCheckPoint.lng]} icon={checkpointMarker}>
                                            <Popup>
                                                <div className="flex gap-2 justify-end mb-1">
                                                    <button><FontAwesomeIcon icon={faPencil} /></button>
                                                    <button cpid={eachCheckPoint.CPId} pathid={`${pathId}`} onClick={deleteCheckPoint}><FontAwesomeIcon icon={faTrash} /></button>
                                                </div>
                                                <pre>ID  : {eachCheckPoint.CPId}</pre>
                                                <pre>Lat : {eachCheckPoint.lat}</pre>
                                                <pre>Lng : {eachCheckPoint.lng}</pre>
                                            </Popup>
                                        </Marker>
                                    ))}

                                    {/* Temporary Marker for new dustbin */}
                                    {addCheckPoint.lat && addCheckPoint.lng && (
                                        <Marker icon={tempMarker} position={[addCheckPoint.lat, addCheckPoint.lng]}>
                                            <Popup>Add Checkpoint Here ?</Popup>
                                        </Marker>
                                    )}

                                    {/* Marker for car */}
                                    {/* {carPosition.lat != undefined ?
                                        <Marker  position={[carPosition.lat, carPosition.lng]} icon={carMarker}>
                                            <Popup>
                                                
                                            </Popup>
                                        </Marker>
                                        : <></>
                                    } */}
                                    
                                    <RoutingComponent checkPoints={checkPoints} />
                                    <EventListenerComponent/>
                                </MapComponent>
                            </div>
                            
                            {/* control portion */}
                            <div
                                className={`controls p-10 z-[1] absolute bg-white rounded-xl
                                            ${ isBellowAspect ? 'w-[42%] min-h-[9rem] right-3 bottom-3' : 'min-h-[calc(42vh-2rem)] w-full right-0 bottom-0 rounded-b-none'}`}
                                style={{ boxShadow: "-10px 0px 20px -5px rgba(0, 0, 0, 0.3) , 10px 0px 20px 5px rgba(0, 0, 0, 0.3)" }}
                            >
                                <div className="relative">
                                    <div
                                        className={`absolute top-0 right-0 text-3xl text-green-700 transition-all duration-300 ease-out cursor-pointer
                                                    ${isExpandedCurrPathDetails ? 'rotate-180' : ''}`}
                                        onClick={isExpandedCurrPathDetails ? shrinkCurrPathDetails : expandCurrPathDetails }
                                    >
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>

                                    <div className="w-[calc(100%-30px)] text-2xl mb-2 text-green-700 truncate">
                                        <p className="inline font-bold">Path ID : </p>
                                        <p className="inline">{pathId}</p>
                                    </div>
                                    
                                    <div
                                        ref={ref}
                                        className={`overflow-hidden transition-[all] duration-300 ease-out`}
                                        style={{
                                            maxHeight: isExpandedCurrPathDetails ? `${ref.current?.scrollHeight}px` : '0',
                                            opacity: isExpandedCurrPathDetails ? '100%' : '0%'
                                        }}
                                    >
                                        {currPath && (
                                            <div className="text-lg">
                                                <div className="truncate mb-1">
                                                    <p className="inline font-bold">Path Name : </p>
                                                    <p className="inline">{currPath.pathName}</p>
                                                </div>
                                                <div className="truncate mb-1">
                                                    <p className="inline font-bold">No Of Checkpoints : </p>
                                                    <p className="inline">{currPath.checkPoints.length}</p>
                                                </div>
                                                <div className="truncate mb-1">
                                                    <p className="inline font-bold">No Of Dustbins : </p>
                                                    <p className="inline">{currPath.noOfDustbins}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <hr className="my-7 border-t-green-600"/>

                                <div className="inline-block w-fit">
                                    { addCheckPoint.allow
                                        ? addCheckPoint.lat
                                            ? <div>
                                                <div>Add checkpoint at
                                                    <div className="ml-8 flex flex-col">
                                                        <p>{addCheckPoint.lat}</p>
                                                        <p>{addCheckPoint.lng}</p>
                                                    </div>
                                                </div>
                                                <form  className="my-10">
                                                    {/* <input
                                                        className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                        type="text" placeholder="Dustbin ID" name="dustbinId" value={addCheckPointFormData.dustbinId}
                                                        onChange={handleInputChange} /> */}
                                                    {/* <input
                                                        className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                        type="number" placeholder="Dustbin No" name="dustbinNo" value={addCheckPointFormData.dustbinNo}
                                                        onChange={handleInputChange} /> */}
                                                    {/* <input
                                                        className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                        type="text" placeholder="Path ID" name="pathId" value={addCheckPointFormData.pathId}
                                                        onChange={handleInputChange} /> */}
                                                    <div className="flex gap-2 mt-10">
                                                        <button onClick={createCheckPoint} type="submit" className="w-32 text-center text-white text-lg px-5 py-2 bg-green-700 rounded-full cursor-pointer">Add</button>
                                                        <div onClick={ () => setAddCheckPoint({allow: true}) } className="w-32 text-center text-white text-lg px-5 py-2 bg-red-700 rounded-full cursor-pointer">Cancel</div>
                                                    </div>
                                                </form>
                                            </div> 
                                            
                                            : <div>
                                                <div>Drop pin to add...</div>
                                                <div onClick={ () => setAddCheckPoint({allow: false}) } className="w-32 text-center text-white text-lg px-5 py-2 bg-red-700 rounded-full cursor-pointer">Cancel</div>
                                            </div>
                                        : <div className="px-5 py-3 border-black border-2 rounded-full cursor-pointer" onClick={allowAddCheckPoint}>Add Checkpoint</div>
                                    }
                                </div>
                            </div>
                        </div>
                    </>

                    : <div></div>
                }
            </div>

            {/* blured layer */}
            <div
                className={`bluredLayer w-screen h-screen bg-black opacity-50 backdrop-blur-2xl absolute top-0 left-0 
                            ${(isBlured) ? 'block' : 'hidden'}
                            ${(!isBellowAspect && isExpandedPathList) ? 'z-[4]' : 'z-[2]'}`}
                >
            </div>

        </>
    )
}

export default AddPath