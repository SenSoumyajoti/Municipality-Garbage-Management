import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const backendURL = import.meta.env.VITE_BACKEND_URL

const VehicleDetailsComponent = ({vehicle, onVehicleClick, onDelete}) => {

    const deleteVehicle = async (e) => {
        // e.preventDefault()
        const vehicleId = e.currentTarget.getAttribute('vehicleid');
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

        }
    }

    return (
        <>
            <div className="w-full flex flex-col"
                style={{boxShadow: '2px 2px 7px 5px rgba(0,0,0,0.2)'}}
            >
                <div className="w-full flex flex-col"
                    onClick={() => onVehicleClick(vehicle.vehicleId)}
                >
                    <div className="h-60 bg-gray-700"></div>
                    <div className="flex flex-col p-3">
                        <div className="truncate">
                            <p className="inline font-bold">Vehicle ID : </p>
                            <p className="inline">{vehicle.vehicleId}</p>
                        </div>
                        <div className="truncate">
                            <p className="inline font-bold">Registration No. : </p>
                            <p className="inline">{vehicle.vehicleReg}</p>
                        </div>
                        <div className="truncate">
                            <p className="inline font-bold">Capacity : </p>
                            <p className="inline">{vehicle.capacity}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 p-3 pt-0">
                    <button
                        className="inline-block w-full bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                        // onClick={navigateToTrackMap}
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                        Edit
                    </button>
                    <button
                        // vehicleid={`${vehicle.vehicleId}`}
                        className="inline-block w-full bg-red-700 py-2 text-lg font-medium text-white rounded-full"
                        onClick={() => onDelete(vehicle.vehicleId)}
                    >Delete</button>
                </div>
            </div>
        </>
    )
}

export default VehicleDetailsComponent