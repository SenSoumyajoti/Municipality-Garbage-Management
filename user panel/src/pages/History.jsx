import { useState } from "react";
import React from "react";
import NavBarComponent from "../components/NavBarComponent";
import siteLogo from "../assets/GreenSiteLogo.jpg";

const HistoryPage = () => {
    return (
        <>
            <div className="w-full top-0 z-10">
                <NavBarComponent />
            </div>

            <div className="reqHistoryContainer min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center px-6">
                <div className="relative p-10 pb-7 mt-16" style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}>
                    <div
                        className="logoContainer absolute h-24 w-24 flex justify-center items-center rounded-full top-0 left-1/2 -translate-1/2 overflow-hidden"
                        style={{boxShadow: "5px 5px 10px 4px rgb(0 0 0 / 0.1), -5px -5px 10px 4px rgb(0 0 0 / 0.1)"}}
                    >
                        <img src={siteLogo} alt="" className="mix-blend-darken" />
                    </div>

                    <div className="text-green-600 text-center my-3">
                        <h1>Your Collection Request History</h1>
                    </div>

                    <table className="reqHistoryTable w-[60vw] border-2 border-gray-500">
                        <tr className="text-green-700">
                            <th>Date of Request</th>
                            <th>Address</th>
                            <th>Garbage Type</th>
                            <th>Garbage Quantity</th>
                            <th>Status</th>
                            <th>Date of Collection</th>
                        </tr>
                        <tr>
                            <td>17:40 07/05/2025</td>
                            <td>Puabagan, Bankura</td>
                            <td>Dry</td>
                            <td>100KG</td>
                            <td className={``}>Pending</td>
                            <td>17:40 09/05/2025</td>
                        </tr>
                        <tr>
                            <td>17:40 07/05/2025</td>
                            <td>Saltora, Bankura, W.B</td>
                            <td>Dry</td>
                            <td>100KG</td>
                            <td>Pending</td>
                            <td>17:40 09/05/2025</td>
                        </tr>
                        <tr>
                            <td>17:40 07/05/2025</td>
                            <td>Rajagram, Bankura, 722146</td>
                            <td>Dry</td>
                            <td>100KG</td>
                            <td>Pending</td>
                            <td>17:40 09/05/2025</td>
                        </tr>
                    </table>
                    
                </div>

            </div>
        </>
    )
}

export default HistoryPage;