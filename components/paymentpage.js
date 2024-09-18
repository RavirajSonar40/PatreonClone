"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { initiate } from "@/actions/useractions";
import toast from "react-hot-toast";
import Sidebar from "@/components/sidebar"; // Ensure correct import

const PaymentPage = ({ username = "" }) => {
    
    const [supporters, setSupporters] = useState([]);
    const [paymentform, setPaymentForm] = useState({
        name: "",
        email: "",
        amount: "",
        message: "",
    });
    const [showSidebar, setShowSidebar] = useState(false); // State to control sidebar visibility

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                const response = await fetch("/api/supporters");
                const data = await response.json();
                setSupporters(data);
            } catch (error) {
                console.error("Failed to fetch supporters", error);
            }
        };

        fetchSupporters();
    }, []);

    const handleChange = (e) => {
        setPaymentForm({ ...paymentform, [e.target.name]: e.target.value });
    };

    const pay = async (amount) => {
        try {
            let response = await initiate(amount, username, paymentform);
            let orderId = response.id;

            var options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
                amount: amount * 100,
                currency: "INR",
                name: "BUY ME A VADAPAV",
                description: "Test Transaction",
                image: "/public/icons8-user-48.png",
                order_id: orderId,
                prefill: {
                    name: paymentform.name,
                    email: paymentform.email,
                    contact: "9000090000",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
                handler: function (response) {
                    toast.success("Payment Success!");

                    setSupporters((prev) => [
                        ...prev,
                        {
                            name: paymentform.name,
                            message: paymentform.message,
                            amount: amount,
                        },
                    ]);

                    fetch("/api/supporters", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: paymentform.name,
                            message: paymentform.message,
                            amount: amount,
                        }),
                    }).catch((err) =>
                        console.error("Error saving supporter:", err)
                    );
                },
                modal: {
                    ondismiss: function () {
                        toast.error("Payment Cancelled");
                    },
                },
            };

            if (typeof window !== "undefined" && window.Razorpay) {
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                console.error("Razorpay script not loaded");
            }
        } catch (error) {
            console.error("Payment initiation error:", error);
        }
    };

    const toggleSidebar = () => setShowSidebar((prev) => !prev); // Toggle sidebar visibility

    if (!username) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="relative">
                {/* Sidebar Toggle Button */}
                <button
                    className="absolute my-64 top-4 left-4 bg-slate-900 text-white p-2 rounded z-40" // Adjust z-index to be above other elements
                    onClick={toggleSidebar}
                >
                    <img className="invert" src="hamburger.png" width={20} height={20} />
                    
                </button>

                {/* Sidebar Component */}
                {showSidebar && (
                    <Sidebar
                        onClose={toggleSidebar}
                        className="fixed top-[250px] right-4 w-80 h-[calc(100vh-250px)] bg-gray-800 text-white p-4"
                    />
                )}

                <div className="cover w-full bg-red-50 relative">
                    <div className="border-[1px] border-slate-700">
                        <img
                            className="object-cover w-full h-[250px]"
                            src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/2999360/f8abab04222e4cf799290ca24236b128/eyJ3Ijo5NjAsIndlIjoxfQ%3D%3D/3.jpg?token-time=1725408000&token-hash=r60mNrk9BHOZ8NI2a01uK5jodabh2xjImzg_PdmCm4M%3D"
                            alt="Cover img"
                        />
                    </div>
                    <div className="absolute -bottom-10 border-[3px] border-fuchsia-100 rounded-lg right-[46%]">
                        <img
                            width={100}
                            height={100}
                            className="rounded-lg"
                            src="https://i.pinimg.com/originals/a4/95/29/a495296c0fcdb215b9329eee51b558ff.jpg"
                            alt="nothing"
                        />
                    </div>
                </div>

                <div className="info flex flex-col items-center my-11 gap-1">
                    <div className="font-bold text-lg">@{username}</div>
                    <div className="text-slate-600">Creating the Joe Budden Network</div>
                    <div className="text-slate-600">898 Posts</div>

                    <div className="payment flex gap-5 justify-center w-[80%] mx-auto my-12">
                        <div className="leaderboard w-1/2 p-6 rounded-3xl opacity-80 bg-slate-900">
                            <h2 className="font-bold text-3xl py-4">Supporters</h2>
                            <ul className="max-w-md divide-y py-3 divide-gray-200 dark:divide-gray-700">
                                {supporters.map((supporter, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center py-3 space-x-3"
                                    >
                                        <div className="flex-shrink-0">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src="/icons8-user-48.png"
                                                alt={supporter.name}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500">
                                                {supporter.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {supporter.message}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ₹{supporter.amount}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pay now w-1/2 bg-slate-900 rounded-3xl opacity-80 p-4">
                            <h2 className="font-bold text-3xl py-3">Make your payment!!!</h2>
                            <h2 className="font-bold text-xl px-3">
                                Support me @{username} by making your payment
                            </h2>
                            <div className="py-4 flex gap-3">
                                <input
                                    name="name"
                                    onChange={handleChange}
                                    value={paymentform.name}
                                    type="text"
                                    className="rounded-lg p-2 w-1/2 bg-slate-800"
                                    placeholder="Enter your Name"
                                />
                                <input
                                    name="email"
                                    onChange={handleChange}
                                    value={paymentform.email}
                                    type="email"
                                    className="rounded-lg p-2 w-1/2 bg-slate-800"
                                    placeholder="Enter your Email"
                                />
                            </div>
                            <div className="py-2">
                                <textarea
                                    name="message"
                                    onChange={handleChange}
                                    value={paymentform.message}
                                    className="rounded-lg p-2 w-full h-24 bg-slate-800"
                                    placeholder="Enter your message"
                                />
                            </div>
                            <div className="flex gap-2 py-2">
                                <input
                                    name="amount"
                                    onChange={handleChange}
                                    value={paymentform.amount}
                                    type="text"
                                    className="w-full rounded-lg p-2 bg-slate-800"
                                    placeholder="Enter your amount"
                                />
                            </div>
                            <div className="py-2 w-full">
                                <button
                                    className="relative w-full text-center inline-flex items-center justify-center px-5 py-3 overflow-hidden font-bold rounded-lg group"
                                    onClick={() => pay(paymentform.amount)}
                                >
                                    <span className="absolute inset-0 w-full h-full bg-white opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100"></span>
                                    <span className="relative text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">
                                        Pay now
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;
