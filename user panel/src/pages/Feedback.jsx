import { useState } from "react";
import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import StarRating from "../components/StarRating";
import siteLogo from "../assets/GreenSiteLogo.jpg";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const FeedbackPage = () => {
    const [isCleanedToday, setIsCleanedToday] = useState();
    const [wasOnTime, setWasOnTime] = useState();
    const [feedbackImg, setFeedbackImg] = useState();
    const [rating, setRating] = useState();
    const [suggestion, setSuggestion] = useState('');

    const handleIsCleanedToday = (e) => {
        // console.log(e.target.value);
        if(e.target.value == 'yes') {
            setIsCleanedToday(true);
        }
        else {
            setIsCleanedToday(false);
        }
    }

    const handleWasOnTime = (e) => {
        if(e.target.value == 'yes') {
            setWasOnTime(true);
        }
        else {
            setWasOnTime(false);
        }
    }

    // const handleImg = () => {

    // }

    const handleRating = (e) => {
        // console.log(e)
        setRating(e);
    }

    const handleSuggestion = (e) => {
        setSuggestion(e.target.value)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if(isCleanedToday == null) {
            alert("Select if the dustbin is cleaned today or not");
            return;
        }
        else if(wasOnTime == null) {
            alert("Select if the cleaning vehicle arrived on time or not");
            return;
        }
        else if(!rating) {
            alert("Please rate our service");
            return;
        }

        const response = await fetch(`${backendURL}/feedback/submit`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                cleanedtoday: isCleanedToday,
                onTime: wasOnTime,
                feedbackPic: feedbackImg,
                rating,
                suggestion
            })
        });

        const data = await response.json();

        if(response.ok) {
            alert("Thanks for your feedback");
            setIsCleanedToday(null);
            setWasOnTime(null);
            setFeedbackImg(null);
            setRating(null);
            setSuggestion('');
        }
        else {
            alert(data.message);
        }
    }

    return (
        <>
            <div className="w-full top-0 z-10">
                <NavBarComponent />
            </div>

            <div className="feedbackContainer min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-6">
                <div className="relative p-10 pb-7 mt-16" style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}>
                    <div
                        className="logoContainer absolute h-24 w-24 flex justify-center items-center rounded-full top-0 left-1/2 -translate-1/2 overflow-hidden"
                        style={{boxShadow: "5px 5px 10px 4px rgb(0 0 0 / 0.1), -5px -5px 10px 4px rgb(0 0 0 / 0.1)"}}
                    >
                        <img src={siteLogo} alt="" className="mix-blend-darken" />
                    </div>
                    <div className="text-green-600 text-center my-3">
                        <h1>Drop Us A Feedback</h1>
                    </div>
                    <form className="flex flex-col items-center" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-2 gap-20">
                            <div className="flex flex-col gap-7">
                                <div className="flex flex-col gap-2">
                                    <p>Has your nearby dustbin been cleaned properly today?</p>
                                    <div className="feedbackOptions p-2 text-lg border-2 border-gray-300 rounded-sm flex gap-10">
                                        <div>
                                            <input
                                                type="radio" value="yes" id="cleanedYes" name="isCleaned"
                                                checked={isCleanedToday === true}
                                                onChange={handleIsCleanedToday}
                                            />
                                            <label htmlFor="cleanedYes">Yes</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio" value="no" id="cleanedNo" name="isCleaned"
                                                checked={isCleanedToday === false}
                                                onChange={handleIsCleanedToday}
                                            />
                                            <label htmlFor="cleanedNo">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p>Upload image of the dustbin</p>
                                    <div className="feedbackOptions p-3 border-2 border-gray-300 rounded-sm">
                                        <input type="file" className="feedbackImg" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-7">
                                <div className="flex flex-col gap-2">
                                    <p>Did the vehicle arrive on time?</p>
                                    <div className="feedbackOptions p-2 text-lg border-2 border-gray-300 rounded-sm flex gap-10">
                                        <div>
                                            <input
                                                type="radio" value="yes" id="arrivedYes" name="wasOnTime"
                                                checked={wasOnTime === true}
                                                onChange={handleWasOnTime}
                                            />
                                            <label htmlFor="arrivedYes">Yes</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio" value="no" id="arrivedNo" name="wasOnTime"
                                                checked={wasOnTime === false}
                                                onChange={handleWasOnTime}
                                            />
                                            <label htmlFor="arrivedNo">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <p>Rate overall experience</p>
                                    <div className="feedbackOptions p-1 border-2 border-gray-300 rounded-sm">
                                        <StarRating onRatingChange={handleRating} value={rating} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 w-full">
                            <label htmlFor="">Any suggestion?</label>
                            <textarea name="" id="" className="feedbackOptions p-1 bg-gray-200 rounded-sm w-full h-32 mt-2" value={suggestion} onChange={handleSuggestion}></textarea>
                        </div>
                        <input type="submit" className="inline-block w-32 bg-green-700 py-2 font-medium text-white rounded-full mt-5"/>
                    </form>
                </div>

            </div>
        </>
    )
}

export default FeedbackPage;