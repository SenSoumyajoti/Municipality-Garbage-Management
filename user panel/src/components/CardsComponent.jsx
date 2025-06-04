import { faCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import React from "react";

const CardsComponent = ({icon, heading, message, onclick}) => {
    return (
        <>
            <div
                className="border-gray-300 border-2 p-5 rounded-md flex flex-col gap-4 items-center"
                onClick={onclick}
            >
                <div className="text-5xl text-green-600">
                    <FontAwesomeIcon icon={icon} />
                </div>
                <h3 className="">{heading}</h3>
                <p className="text-center text-gray-700">{message}</p>
            </div>
        </>

    )
}

export default CardsComponent;