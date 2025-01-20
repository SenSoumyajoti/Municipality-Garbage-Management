import { useState } from "react"
import {useNavigate} from 'react-router-dom'

const AssignCardComponent = ({pathName, pathId, dustbinNo, driverName, vehicleNo, children}) => {
    // const [pathName, serPathName] = useState();
    // const [pathId, setPathId] = useState();
    // const [dustbinNo, setDustbinNo] = useState();
    // const [driverName, setDriverName] = useState();
    // const [vehicleNo, setVehicalNo] = useState();
    const navigate = useNavigate();

    const navigateToTrackMap = () => {
        const url = `/track?pathId=${pathId}`;
        navigate(url);
    }
    

    return(
        <>
            <div className="relative w-full py-10 flex flex-col items-center justify-center gap-8" style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)", background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}>
                <div className="bg-gray-500 h-44 w-44 rounded-full"></div>
                <div className="w-[72%]">
                    <div className="text-2xl font-bold text-green-700 mb-2 truncate">
                        <b>Path Name :</b> {pathName}
                    </div>
                    <div className="text-lg mb-2 truncate">
                        <b>Path ID :</b> {pathId}
                    </div>
                    <div className="text-lg mb-2 truncate">
                        <b>No. of Dustbin :</b> {dustbinNo}
                    </div>
                    <div className="text-lg mb-2 truncate">
                        <b>Driver Name :</b> {driverName}
                    </div>
                    <div className="text-lg truncate">
                        <b>Vehical No. :</b> {vehicleNo}
                    </div>
                </div>
                <button
                    className="inline-block w-32 bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                    onClick={navigateToTrackMap}
                >Track</button>
                {children}
            </div>
            
        </>
    )
}

export default AssignCardComponent;