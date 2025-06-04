import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faIdCard, faListCheck, faUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { faEdit, faXmark, faBars, faClockRotateLeft, faArrowRightFromBracket, faTruckFast, faTrashArrowUp, faUpload } from "@fortawesome/free-solid-svg-icons"
// import { IconLayoutDashboard, IconMap2 } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { useRef } from "react"
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL

const NavBarComponent = () => {
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [profilePic, setProfilePic] = useState();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [editProfilePic, setEditProfilePic] = useState(null)
    const [editFullName, setEditFullName] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [expandedProfile, setExpandedProfile] = useState(false);
    const [expandedEditProfile, setExpandedEditProfile] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState(false);
    const [isBlured, setIsBlured] = useState(false);

    const handleLogout = () => {
        localStorage.setItem("token", "");
        navigate("/login")
    }

    // Function to update token in localStorage
    const updateTokenInLocalStorage = (updatedFields) => {
        const storedToken = localStorage.getItem("token");
        
        if (storedToken) {
            try {
                // Parse the token
                const parsedToken = JSON.parse(storedToken);

                // Update fields in the token
                const updatedToken = {
                    ...parsedToken,
                    ...updatedFields, // Merge the updated fields
                };

                // Save the updated token back to localStorage
                localStorage.setItem("token", JSON.stringify(updatedToken));

                console.log("Updated token:", updatedToken);
            } catch (err) {
                console.error("Error parsing or updating the token:", err);
            }
        } else {
            console.warn("No token found in localStorage to update.");
        }
    };

    const fileInputRef = useRef(null);
    const handlePicUploadClick = () => {
        if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger the hidden file input
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            setEditProfilePic(formData); // Save FormData to state
        }
    };
    
    

    const handleEditProfile = () => {
        setExpandedProfile(false);
        setExpandedEditProfile(true);
    }

    const saveProfileEdit = async (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page

        setFullName(editFullName);
        setUsername(editUsername)
        setEmail(editEmail)

        setExpandedEditProfile(false)
    
        const formData = new FormData();
        formData.append("image", editProfilePic.get("image")); // Attach the image
        formData.append("fullName", editFullName);
        formData.append("username", editUsername);
        formData.append("email", editEmail);
    
        try {
            const response = await axios.post(`${backendURL}/admin/edit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

    
            if (response.data.message) {
                console.log("Profile updated successfully:", response.data.user);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
        }

        
    };
    

    const cancelEditProfile = () => {
        setEditFullName(fullName)
        setEditUsername(username)
        setEditEmail(email)

        setExpandedEditProfile(false)
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

        // if(expandedMenu){
        //     menu.classList.remove("left-[-18rem]")
        //     menu.classList.add("left-0")
        // }
        // else {
        //     menu.classList.remove("left-0")
        //     menu.classList.add("left-[-18rem]")
        // }

        if(expandedMenu || expandedProfile || expandedEditProfile) {
            setIsBlured(true)
        }
        else{
            setIsBlured(false)
        }

        bluredLayer.addEventListener("click", () => {
            setExpandedProfile(false)
            setExpandedMenu(false)
        })
    },[expandedMenu, expandedProfile, expandedEditProfile, isBlured])

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if(storedToken){
            try{
                const parsedToken = JSON.parse(storedToken);
                console.log(parsedToken)
                setToken(parsedToken);
                setFullName(parsedToken.fullName);
                setUsername(parsedToken.username);
                setEmail(parsedToken.email);
                setProfilePic(parsedToken.profilePic)

                setEditFullName(parsedToken.fullName)
                setEditUsername(parsedToken.username)
                setEditEmail(parsedToken.email)
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
                    {/* {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
                        ? <div className="text-3xl cursor-pointer" onClick={expandMenu}>
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                        : <></>
                    } */}
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
                <div className=" h-44 w-44 rounded-full overflow-hidden">
                    <img src={`data:image/webp;base64,${profilePic}`} alt="" />
                </div>
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
                        onClick={handleEditProfile}
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

            {/* edit profile pop-up */}
            <div
                className={`profileDetails absolute left-1/2 -translate-x-1/2 w-[30rem] p-8 bg-white rounded-lg flex flex-col gap-10 items-center z-[12] transition-all duration-300 ease-in-out
                            ${expandedEditProfile ? 'top-24' : '-top-[40rem]'}`}>
                <form  className="w-full flex flex-col items-center gap-3">
                    <div className="bg-gray-500 h-44 w-44 rounded-full relative overflow-hidden">
                        <div
                            className="text-white text-2xl absolute bottom-1 left-1/2 -translate-x-1/2"
                            onClick={handlePicUploadClick}
                        >
                            <FontAwesomeIcon icon={faUpload}/>
                        </div>
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="w-full">
                        <div className="text-2xl font-bold text-green-700 mb-2">
                            <b>Name :</b> <input type="text" value={editFullName} id="fullName" onChange={e => setEditFullName(e.target.value)} />
                        </div>
                        <div className="text-lg mb-2">
                            <b>Username :</b> <input type="text" value={editUsername} id="username" onChange={e => setEditUsername(e.target.value)} /> 
                        </div>
                        <div className="text-lg mb-2">
                            <b>Email ID :</b> <input type="text" value={editEmail} id="email" onChange={e => setEditEmail(e.target.value)} />
                        </div>
                        <div className="text-lg mb-2">
                            <b>Phone No. :</b> {}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="inline-block w-32 bg-red-700 py-2 text-lg font-medium text-white rounded-full"
                            onClick={cancelEditProfile}
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                            Cancel
                        </button>
                        <button
                            className="inline-block w-32 bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                            onClick={saveProfileEdit}
                        >
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2"/>
                            Save
                        </button>
                    </div>
                </form>
            </div>

            {/* expand menu */}
            {/* <div 
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
                    <button className="navMenuOps w-60 py-2 px-4 text-lg text-start rounded-r-full flex items-center cursor-pointer" onClick={navigateAssign}>
                        <div className="w-10 text-xl pl-[2px]">
                            <FontAwesomeIcon icon={faListCheck}/>
                        </div>
                        <p>Assign</p>
                    </button>
                </div>
            </div> */}

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