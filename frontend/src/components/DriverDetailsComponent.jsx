import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
const backendURL = import.meta.env.VITE_BACKEND_URL

const DriverDetailsComponent = ({driver, onDriverClick, onDelete}) => {

    return (
        <>
            <div className="w-full flex flex-col rounded-md"
                style={{boxShadow: '2px 2px 7px 5px rgba(0,0,0,0.2)'}}
            >
                <div className="w-full flex flex-col"
                    onClick={() => onDriverClick(driver.username)}
                >
                    <div className="h-60 flex justify-center items-center">
                        <div className="w-48 h-48 rounded-full bg-gray-700"></div>
                    </div>
                    <div className="flex flex-col p-3">
                        <div className="truncate">
                            <p className="inline font-bold">Name : </p>
                            <p className="inline">{driver.fullName}</p>
                        </div>
                        <div className="truncate">
                            <p className="inline font-bold">Username : </p>
                            <p className="inline">{driver.username}</p>
                        </div>
                        <div className="truncate">
                            <p className="inline font-bold">Email : </p>
                            <p className="inline">{driver.email}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 p-3 pt-0">
                    <button
                        className="inline-block w-full bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                        Edit
                    </button>
                    <button
                        className="inline-block w-full bg-red-700 py-2 text-lg font-medium text-white rounded-full"
                        onClick={() => onDelete(driver.driverId)}
                    >Delete</button>
                </div>
            </div>
        </>
    )
}

export default DriverDetailsComponent