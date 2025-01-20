import { useEffect, useState } from "react";
import NavBarComponent from "../components/NavBarComponent"
import MakeAssignComponent from "../components/MakeAssignComponent";
const backendURL = import.meta.env.VITE_BACKEND_URL

const Assignment = () => {
    const [paths, setPaths] = useState([]);
    const [isBellowAspect, setIsBellowAspect] = useState();

    const getAllPaths = async () => {
        const response = await fetch(`${backendURL}/path/getAllPaths`, {
            method: 'GET'
        });
        const data = await response.json();
        if(response.ok){
            setPaths(data.paths)
            
        }
    }

    useEffect(() => {
        getAllPaths()
    })

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
                className={`w-full flex justify-between mt-16 px-5 py-3 relative`}>
                { (isBellowAspect != undefined) ?
                    <>
                        <div className="w-full">
                            <h1 className="text-3xl font-semibold mb-4">Add or Edit Drivers</h1>

                            {/* All drivers container */}
                            <div className="driverGrid w-full grid grid-cols-4 gap-7">                   {/* index.css */}

                                {paths.map((eachPath, idx) => (
                                    <div className="w-full" key={idx}>
                                        <MakeAssignComponent path={eachPath} />
                                    </div>
                                ))}

                            </div>
                        </div>
                    </>

                    : <div></div>
                }

                
            </div>
        </>
    )
}

export default Assignment