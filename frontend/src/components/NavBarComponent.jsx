import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faIdCard, faListCheck, faUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { faEdit, faXmark, faBars, faClockRotateLeft, faArrowRightFromBracket, faTruckFast, faTrashArrowUp } from "@fortawesome/free-solid-svg-icons"
import { IconLayoutDashboard, IconMap2 } from "@tabler/icons-react"
import { useEffect, useState } from "react"


const NavBarComponent = () => {
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email,setEmail] = useState(null);
    const [expandedProfile, setExpandedProfile] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState(false);
    const [isBlured, setIsBlured] = useState(false);

    const handleLogout = () => {
        localStorage.setItem("token", "");
        navigate("/login")
    }

    const expandProfile = () => {
        setExpandedProfile(true)
    }
    const shrinkProfile = () => {
        setExpandedProfile(false)
    }

    const expandMenu = () => {
        setExpandedMenu(true)
    }
    const shrinkMenu = () => {
        setExpandedMenu(false)
    }

    useEffect(() => {
        const profileDetails = document.querySelector(".profileDetails");
        const menu = document.querySelector(".menu");
        const bluredLayer = document.querySelector(".bluredLayer");

        if(expandedProfile){
            profileDetails.classList.remove("right-[-24rem]")
            profileDetails.classList.add("right-0")
        }
        else{
            profileDetails.classList.remove("right-0")
            profileDetails.classList.add("right-[-24rem]")
        }

        if(expandedMenu){
            menu.classList.remove("left-[-18rem]")
            menu.classList.add("left-0")
        }
        else {
            menu.classList.remove("left-0")
            menu.classList.add("left-[-18rem]")
        }

        if(expandedMenu || expandedProfile) {
            setIsBlured(true)
        }
        else{
            setIsBlured(false)
        }

        bluredLayer.addEventListener("click", () => {
            setExpandedProfile(false)
            setExpandedMenu(false)
        })
    },[expandedMenu, expandedProfile, isBlured])

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if(storedToken){
            try{
                const parsedToken = JSON.parse(storedToken);
                setToken(parsedToken);
                setFullName(parsedToken.fullName);
                setUsername(parsedToken.username);
                setEmail(parsedToken.email);
            } catch(err) {
                console.log("Error while parsing token", err)
            }
            
        }
    }, [])

    const reloadPage = () => {
        window.location.reload()
    }

    const navigateDashboard = () => {
        setExpandedProfile(false)
        setExpandedMenu(false)
        navigate("/dashboard")
    }

    const navigatePath = () => {
        setExpandedProfile(false)
        setExpandedMenu(false)
        navigate("/addPath")
    }
    
    const navigateDustbin = () => {
        setExpandedProfile(false)
        setExpandedMenu(false)
        navigate("/addDustbin")
    }

    const navigateDriver = () => {
        setExpandedProfile(false)
        setExpandedMenu(false)
        navigate("/addDriver")
    }

    const navigateVehicle = () => {
        setExpandedProfile(false)
        setExpandedMenu(false)
        navigate("/addVehicle")
    }

    const navigateAssign = () => {
        setExpandedProfile(false)
        setExpandedMenu(false)
        navigate("/assign")
    }

    return (
        <>
            <div className="w-full h-16 text-white bg-green-800 px-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
                        ? <div className="text-3xl cursor-pointer" onClick={expandMenu}>
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                        : <></>
                    }
                    <p className="navAppName text-3xl font-bold">
                        
                    </p>
                </div>
                {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
                    ? <div className="flex gap-7 items-center">
                        <FontAwesomeIcon icon={faBell} className="text-2xl cursor-pointer" />
                        <FontAwesomeIcon icon={faClockRotateLeft} className="text-2xl cursor-pointer" />
                        <div className={`profileIcon w-9 h-9 text-green-800 text-xl bg-white rounded-full flex justify-center items-center cursor-pointer ${expandedProfile ? 'z-[12]' : ''}`}
                            onClick={ () => (expandedProfile ? shrinkProfile() : expandProfile()) }>
                            <FontAwesomeIcon
                                icon={ expandedProfile ? faXmark : faUser }
                            />
                        </div>
                    </div>
                    : <></>

                }
            </div>

            {/* expand profile */}
            <div className="profileDetails absolute top-16 w-96 p-8 bg-white rounded-lg flex flex-col gap-10 items-center z-[12] transition-all duration-300 ease-in-out">
                <div className="bg-gray-500 h-44 w-44 rounded-full"></div>
                <div className="w-full">
                    <div className="text-2xl font-bold text-green-700 mb-2">
                        <b>Name :</b> {fullName}
                    </div>
                    <div className="text-lg mb-2">
                        <b>Username :</b> {username}
                    </div>
                    <div className="text-lg mb-2">
                        <b>Email ID :</b> {email}
                    </div>
                    <div className="text-lg mb-2">
                        <b>Phone No. :</b> {}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        className="inline-block w-32 bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                        Edit
                    </button>
                    <button
                        className="inline-block w-32 bg-red-700 py-2 text-lg font-medium text-white rounded-full"
                        onClick={handleLogout}
                    >
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2"/>
                        Logout
                    </button>
                </div>
                
            </div>

            {/* expand menu */}
            <div 
                className="menu w-72 h-screen bg-white rounded-r-xl z-[12] absolute top-0 transition-all duration-300 ease-in-out"
                style={{background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}>
                <div className="m-4 flex flex-row-reverse">
                    <div className="navMenuOps w-9 h-9 p-2 text-xl border-2 border-black rounded-full flex justify-center items-center cursor-pointer"
                        onClick={shrinkMenu}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigateDashboard}>
                        <div className="w-10">
                            <IconLayoutDashboard />
                        </div>
                        <p>Dashboard</p>
                    </div>
                    <div className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigatePath}>
                        <div className="w-10">
                            <IconMap2 />
                        </div>
                        <p>Manage Paths</p>
                    </div>
                    <div className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigateDustbin}>
                        <div className="w-10 pl-[4px]">
                        <FontAwesomeIcon icon={faTrashArrowUp}/>
                        </div>
                        <p>Manage Dustbins</p>
                    </div>
                    <div className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigateDriver}>
                        <div className="w-10">
                        <FontAwesomeIcon icon={faIdCard}/>
                        </div>
                        <p>Manage Drivers</p>
                    </div>
                    <div className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigateVehicle}>
                        <div className="w-10">
                            <FontAwesomeIcon icon={faTruckFast}/>
                        </div>
                        <p>Manage Vehicles</p>
                    </div>
                    <div className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigateAssign}>
                        <div className="w-10 text-xl pl-[2px]">
                            <FontAwesomeIcon icon={faListCheck}/>
                        </div>
                        <p>Assign</p>
                    </div>
                </div>
            </div>

            {/* blured layer */}
            <div
                className={`bluredLayer w-screen h-screen bg-black opacity-50 backdrop-blur-2xl z-[11] absolute top-0 left-0 
                            ${(expandedProfile || expandedMenu) ? 'block' : 'hidden'}`}
                >
            </div>
        </>
    )
}

export default NavBarComponent