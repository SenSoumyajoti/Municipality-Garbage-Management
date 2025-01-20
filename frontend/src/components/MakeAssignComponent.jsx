import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
const backendURL = import.meta.env.VITE_BACKEND_URL

const MakeAssignComponent = ({path}) => {
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [assignment, setAssignment] = useState({});
    const [selectedDriverUsername, setSelectedDriverUsername] = useState('');
    const [selectedVehicleReg, setSelectedVehicleReg] = useState('');

    const getAllDrivers = async () => {
        const response = await fetch(
            `${backendURL}/driver/getAllDrivers`,
            {
                method: 'GET'
            }
        );
        const data = await response.json();
        if(response.ok){
            setDrivers(data.drivers);
        }
    }

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

    const getAllAssignments = async () => {
        try {
            const response = await fetch(`${backendURL}/assign/getAllAssigns/${path.pathId}`, {
                method: 'GET',
            });
            const data = await response.json();
            if(response.ok){
                setAssignment(data.assignment);
            }
        } catch (error) {
            console.error('Error fetching assigns:', error);
        }
    }

    const handleDriverChange = (e) => {
        setSelectedDriverUsername(e.target.value)
    }

    const handleVehicleChange = (e) => {
        setSelectedVehicleReg(e.target.value)
    }

    const saveAssignment = async () => {
        const response = await fetch(`${backendURL}/assign/save/${path.pathId}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                driverUsername: selectedDriverUsername,
                vehicleReg: selectedVehicleReg
            })
        });

        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setAssignment(data.assigned)
        }
    }

    const deleteAssignment = async () => {
        const response = await fetch(`${backendURL}/assign/delete/${path.pathId}`, {
            method: 'DELETE'
        })
        const data = await response.json();
        alert(data.message)
        if(response.ok){
            setAssignment({})
        }
    }

    useEffect(() => {
        console.log(selectedDriverUsername, selectedVehicleReg)
    }, [selectedDriverUsername, selectedVehicleReg])

    useEffect(() => {
        getAllDrivers();
        getAllVehicles();
        getAllAssignments();
    },[])

    return (
        <>
            <div className="w-full flex flex-col rounded-lg p-8"
                style={{boxShadow: '2px 2px 7px 5px rgba(0,0,0,0.2)'}}
            >
                <div className="w-full flex flex-col pb-8 gap-5"
                    // onClick={() => onDriverClick(driver.username)}
                >
                    <div className="text-2xl text-green-700 truncate">
                        <p className="inline font-bold">Path ID : </p>
                        <p className="inline">{path.pathId}</p>
                    </div>

                    <div className="truncate">
                        <p className="font-bold">Driver Username : </p>
                        <select name="" id="" className="w-full p-2 rounded-md border-[1px] border-black" onChange={handleDriverChange}>
                            <option value='' selected={!assignment.driverUsername ? true : false}>Select</option>
                            {drivers.map((eachDriver, idx) => (
                                <option key={idx} value={`${eachDriver.username}`}
                                selected={(assignment.driverUsername == eachDriver.username) ? true : false }
                            >
                                {eachDriver.username}
                            </option>
                            ))}
                        </select>
                    </div>

                    <div className="truncate">
                        <p className="font-bold">Driver Username : </p>
                        <select name="" id="" className="w-full p-2 rounded-md border-[1px] border-black" onChange={handleVehicleChange}>
                            <option value=''>Select</option>
                            {vehicles.map((eachVehicle, idx) => (
                                <option key={idx} value={`${eachVehicle.vehicleReg}`}
                                    selected={(assignment.vehicleReg == eachVehicle.vehicleReg) ? true : false }
                                >
                                    {eachVehicle.vehicleReg}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="flex gap-2 pt-0">
                    <button
                        className="saveBtn inline-block w-full bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                        onClick={saveAssignment}
                        disabled={(selectedDriverUsername == '' || selectedVehicleReg == '' ? true : false)}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} className="mr-2"/>
                        Save
                    </button>
                    <button
                        className="deleteBtn inline-block w-full bg-red-700 py-2 text-lg font-medium text-white rounded-full"
                        onClick={deleteAssignment}
                    >Delete</button>
                </div>
            </div>
        </>
    )
}

export default MakeAssignComponent