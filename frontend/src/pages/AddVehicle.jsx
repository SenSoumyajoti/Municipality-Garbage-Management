import { useEffect, useState } from "react"
import NavBarComponent from "../components/NavBarComponent"
import VehicleDetailsComponent from "../components/VehicleDetailsComponent";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const backendURL = import.meta.env.VITE_BACKEND_URL

const AddVehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [isBellowAspect, setIsBellowAspect] = useState();
    const [fromVehicleId, setFromVehicleId] = useState('');
    const [fromVehicleReg, setFromVehicleReg] = useState('');
    const [formCapacity, setFormCapacity] = useState('');
    const [addNewVehicle, setAddNewVehicle] = useState(false);
    const [isBlured, setIsBlured] = useState(false);

    const getAllVehicles = async () => {
        const response = await fetch(
            `${backendURL}/vehicle/getAllVehicles`,
            {
                method: 'GET'
            }
        );
        const data = await response.json();
        if(response.ok){
            setVehicles(data.vehicles);
        }
    }

    const createVehicle = async (e) => {
        e.preventDefault()
        const response = await fetch(`${backendURL}/vehicle/createVehicle`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                vehicleId: fromVehicleId,
                vehicleReg: fromVehicleReg,
                capacity: formCapacity
            })
        });
        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setVehicles(prev => [...prev, data.addedVehicle])
            setAddNewVehicle(false)
            setIsBlured(false)
        }
    }

    const deleteVehicle = async (vehicleId) => {
        // e.preventDefault()
        // const vehicleId = e.currentTarget.getAttribute('vehicleid');
        const response = await fetch(`${backendURL}/vehicle/deleteVehicle`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                vehicleId
            })
        })
        const data = await response.json();
        alert(data.message)
        if(response.ok){
            setVehicles(vehicles.filter(eachVehicle => eachVehicle.vehicleId != vehicleId))
        }
    }

    const openAddVehicleForm = () => {
        setAddNewVehicle(true)
        setIsBlured(true)
    }

    const hideAddVehicleForm = () => {
        setAddNewVehicle(false)
        setIsBlured(false)
    }

    useEffect(() => {
        getAllVehicles()
    },[])

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
            <div
                className={`w-full flex justify-between mt-16 px-5 py-3 relative
                            ${addNewVehicle ? 'h-[calc(100vh-4rem)] overflow-hidden' : ''}`}>
                { (isBellowAspect != undefined) ?
                    <>
                        <div className="w-full">
                            <h1 className="text-3xl font-semibold mb-4">Add or Edit Vehicles</h1>

                            {/* All vehicles container */}
                            <div className="vehicleGrid w-full grid grid-cols-5 gap-6">                   {/* index.css */}
                                <div
                                    className={`addVehicleBtn w-full flex flex-col gap-3 justify-center items-center
                                                ${(vehicles.length == 0) ? 'h-[24.5rem]' : ''}`}
                                    style={{boxShadow: '2px 2px 7px 5px rgba(0,0,0,0.2)'}}
                                    onClick={openAddVehicleForm}
                                >                                                                          {/* index.css */}
                                    <div className="h-24 w-24 text-5xl rounded-full bg-gray-300 overflow-hidden flex justify-center items-center">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                    <div className="">Add New Vehicle</div>
                                </div>

                                {vehicles.map((eachVehicle, idx) => (
                                    <div className="w-full" key={idx}>
                                        <VehicleDetailsComponent vehicle={eachVehicle} onDelete={deleteVehicle}/>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </>

                    : <div></div>
                }

                {/* form for creating new path */}
                <div
                    className={`absolute z-[3] rounded-lg flex flex-col items-center p-5 left-1/2 -translate-x-1/2 transition-all duration-150
                                ${addNewVehicle ? 'top-[50vh] -translate-y-1/2' : 'top-0 -translate-y-full'}`}
                    style={{background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}
                >
                    <h1 className="text-3xl mb-10">Create New Path</h1>
                    <form className="flex flex-col items-center"
                        onSubmit={createVehicle}>
                        <div className="inputsContainer flex flex-col gap-3">
                            <div className="flex flex-col">
                                <label htmlFor="vehicleId">Vehicle ID</label>
                                <input type="text" id='vehicleId' name="vehicleId"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFromVehicleId(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleReg">Registration No.</label>
                                <input type="text" id='vehicleReg' name="vehicleReg"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFromVehicleReg(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="capacity">Capacity</label>
                                <input type="text" id='capacity' name="capacity"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFormCapacity(e.target.value)} />
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

                {/* blured layer */}
                <div
                    className={`bluredLayer w-screen h-[calc(100vh-4rem)] bg-black opacity-50 backdrop-blur-2xl absolute top-0 left-0 z-[2]
                                ${(isBlured) ? 'block' : 'hidden'}`}
                    onClick={hideAddVehicleForm}
                    >
                </div>
            </div>
        </>
    )
}

export default AddVehicle