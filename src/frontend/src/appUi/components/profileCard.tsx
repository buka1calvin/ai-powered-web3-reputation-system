import React, { useEffect } from "react";
import { FaChartLine, FaLightbulb, FaNetworkWired, FaUserTie } from "react-icons/fa";

export const ProfileImpactCard = () => {
    const impacts = [
        {
            icon: <FaNetworkWired className="h-6 w-6 text-blue-500" />,
            background: "bg-blue-100",
            title: "Expand Your Network",
            description: "Connect with industry professionals and potential employers."
        },
        {
            icon: <FaChartLine className="h-6 w-6 text-green-500" />,
            background: "bg-green-100",
            title: "Career Visibility",
            description: "Showcase your achievements and professional journey."
        },
        {
            icon: <FaUserTie className="h-6 w-6 text-purple-500" />,
            background: "bg-purple-100",
            title: "Personal Branding",
            description: "Craft a unique professional identity that stands out."
        },
        {
            icon: <FaLightbulb className="h-6 w-6 text-yellow-500" />,
            background: "bg-yellow-100",
            title: "Opportunity Discovery",
            description: "Attract recruiters and unlock new career prospects."
        }
    ];

    return (
        <div className="w-1/3 bg-whiteColor p-6 h-fit border rounded-lg ">
            <div className="sticky top-6">
                <h2 className="text-2xl font-bold mb-6 text-blue-800">Why a Professional Profile Matters</h2>

                <div className="space-y-6">
                    {impacts.map((impact, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`w-10 h-10 ${impact.background} rounded-full flex items-center justify-center mr-4`}>
                                {impact.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{impact.title}</h3>
                                <p className="text-gray-600 text-sm">{impact.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-primaryBlueColor italic">
                        "Your professional profile is your digital business card. Make it count!"
                    </p>
                </div>
            </div>
        </div>
    );
};