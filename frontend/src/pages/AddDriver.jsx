import { useEffect, useState } from "react"
import NavBarComponent from "../components/NavBarComponent"
import DriverDetailsComponent from "../components/DriverDetailsComponent";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const backendURL = import.meta.env.VITE_BACKEND_URL

const AddDriver = () => {
    const [drivers, setDrivers] = useState([]);
    const [isBellowAspect, setIsBellowAspect] = useState();
    const [fromDriverName, setFromDriverName] = useState('');
    const [fromDriverUsername, setFromDriverUsername] = useState('');
    const [formDriverEmail, setFormDriverEmail] = useState('');
    const [formDriverPassword, setFormDriverPassword] = useState('');
    const [addNewDriver, setAddNewDriver] = useState(false);
    const [isBlured, setIsBlured] = useState(false);

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

    const createDriver = async (e) => {
        e.preventDefault()
        const response = await fetch(`${backendURL}/driver/register`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                fullName: fromDriverName,
                username: fromDriverUsername,
                email: formDriverEmail,
                password: formDriverPassword
            })
        });
        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setDrivers(prev => [...prev, data.addedDriver])
            setAddNewDriver(false)
            setIsBlured(false)
        }
    }

    const deleteDriver = async (driverId) => {
        // e.preventDefault()
        // const driverId = e.currentTarget.getAttribute('driverid');
        const response = await fetch(`${backendURL}/driver/deleteDriver`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                driverId
            })
        })
        const data = await response.json();
        alert(data.message)
        if(response.ok){
            setDrivers(drivers.filter(eachDriver => eachDriver.driverId != driverId))
        }
    }

    const openAddDriverForm = () => {
        setAddNewDriver(true)
        setIsBlured(true)
    }

    const hideAddDriverForm = () => {
        setAddNewDriver(false)
        setIsBlured(false)
    }

    useEffect(() => {
        getAllDrivers()
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
                            ${addNewDriver ? 'h-[calc(100vh-4rem)] overflow-hidden' : ''}`}>
                { (isBellowAspect != undefined) ?
                    <>
                        <div className="w-full">
                            <h1 className="text-3xl font-semibold mb-4">Add or Edit Drivers</h1>

                            {/* All drivers container */}
                            <div className="driverGrid w-full grid grid-cols-5 gap-6">                   {/* index.css */}
                                <div
                                    className={`addDriverBtn w-full flex flex-col gap-3 justify-center items-center
                                                ${(drivers.length == 0) ? 'h-[24.5rem]' : ''}`}
                                    style={{boxShadow: '2px 2px 7px 5px rgba(0,0,0,0.2)'}}
                                    onClick={openAddDriverForm}
                                >                                                                          {/* index.css */}
                                    <div className="h-24 w-24 text-5xl rounded-full bg-gray-300 overflow-hidden flex justify-center items-center">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                    <div className="">Add New Driver</div>
                                </div>

                                {drivers.map((eachDriver, idx) => (
                                    <div className="w-full" key={idx}>
                                        <DriverDetailsComponent driver={eachDriver} />
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
                                ${addNewDriver ? 'top-[50vh] -translate-y-1/2' : 'top-0 -translate-y-full'}`}
                    style={{background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}
                >
                    <h1 className="text-3xl mb-10">Create New Path</h1>
                    <form className="flex flex-col items-center"
                        onSubmit={createDriver}>
                        <div className="inputsContainer flex flex-col gap-3">
                            <div className="flex flex-col">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" id='fullName' name="fullName"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFromDriverName(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="username">Username</label>
                                <input type="text" id='username' name="username"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFromDriverUsername(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email">Driver Email</label>
                                <input type="email" id='email' name="email"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFormDriverEmail(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="password">Password</label>
                                <input type="password" id='password' name="password"
                                    className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                    onChange={(e) => setFormDriverPassword(e.target.value)} />
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
                    onClick={hideAddDriverForm}
                    >
                </div>
            </div>
        </>
    )
}

export default AddDriver