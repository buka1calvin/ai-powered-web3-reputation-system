import React from "react";
import {
    FaAmazon,
    FaApple,
    FaMicrosoft,
    FaGoogle,
    FaFacebook,
    FaPlayCircle,
    FaCar,
    FaSpotify,
    FaUber,
    FaAirbnb,
} from "react-icons/fa";

const companies = [
    {
        name: "Apple Inc",
        logo: FaApple,
        color: "#555555", // Apple gray
        description:
            "Global technology company known for iPhone, Mac, and innovative consumer electronics",
        location: "Cupertino, California",
        establishedYear: 1976,
    },
    {
        name: "Microsoft Corporation",
        logo: FaMicrosoft,
        color: "#00A4EF", // Microsoft blue
        description:
            "Leading software company known for Windows OS and Office suite",
        location: "Redmond, Washington",
        establishedYear: 1975,
    },
    {
        name: "Amazon",
        logo: FaAmazon,
        color: "#FF9900", // Amazon orange
        description:
            "World's largest e-commerce platform and cloud computing leader",
        location: "Seattle, Washington",
        establishedYear: 1994,
    },
    {
        name: "Google",
        logo: FaGoogle,
        color: "#4285F4", // Google blue
        description:
            "Technology giant specializing in internet-related services and AI",
        location: "Mountain View, California",
        establishedYear: 1998,
    },
    {
        name: "Meta (Facebook)",
        logo: FaFacebook,
        color: "#1877F2", // Facebook blue
        description:
            "Social media conglomerate focusing on metaverse and connectivity",
        location: "Menlo Park, California",
        establishedYear: 2004,
    },
    {
        name: "Netflix",
        logo: FaPlayCircle,
        color: "#E50914", // Netflix red
        description: "Leading streaming service and content production company",
        location: "Los Gatos, California",
        establishedYear: 1997,
    },
    {
        name: "Tesla",
        logo: FaCar,
        color: "#CC0000", // Tesla red
        description: "Electric vehicle and clean energy company",
        location: "Austin, Texas",
        establishedYear: 2003,
    },
    {
        name: "Spotify",
        logo: FaSpotify,
        color: "#1DB954", // Spotify green
        description: "Global music and podcast streaming platform",
        location: "Stockholm, Sweden",
        establishedYear: 2006,
    },
    // {
    //     name: "Uber",
    //     logo: FaUber,
    //     color: "#000000", // Uber black
    //     description: "Ride-hailing and delivery technology platform",
    //     location: "San Francisco, California",
    //     establishedYear: 2009,
    // },
    // {
    //     name: "Airbnb",
    //     logo: FaAirbnb,
    //     color: "#FF5A5F", // Airbnb coral
    //     description: "Online marketplace for lodging and tourism experiences",
    //     location: "San Francisco, California",
    //     establishedYear: 2008,
    // },
];

const Institution = () => {
    return (
        <section className="py-32 bg-white">
            <h1 className="text-3xl text-center font-bold mb-16">
                <span className="text-primaryBlueColor">Company That Certifying</span>{" "}
                Our Candidate
            </h1>
            <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 max-w-7xl mx-auto">
                {companies.map((company, index) => {
                    const IconComponent = company.logo;
                    return (
                        <div
                            key={index}
                            className="border rounded-lg px-4 py-8 hover:border-none hover:scale-100 cursor-pointer hover:shadow-xl transition-shadow  duration-300 flex flex-col h-full w-[280px]"
                        >
                            <div className="flex gap-4 items-center mb-14">
                                <IconComponent
                                    className="w-8 h-8"
                                    style={{ color: company.color }}
                                />
                                <div className="flex flex-col">
                                    <h4 className="text-md font-semibold">{company.name}</h4>
                                    <p className="text-normalTextColor text-[10px]">
                                        {company.location}
                                    </p>
                                </div>
                            </div>
                            <p className="text-normalTextColor text-md font-normal font-serif flex-grow">
                                {company.description}
                            </p>
                            <div className="mt-auto pt-12 flex justify-around items-center">
                                <p className="text-blackColor font-semibold">
                                    {company.establishedYear} Year
                                </p>
                                <button className=" hover:bg-primaryBlueColor transition-all duration-300 hover:text-whiteColor bg-grayColor text-primaryBlueColor text-sm font-normal px-4 py-2 rounded-sm">
                                    Visit Site
                                </button>
                            </div>
                        </div>
                    );
                })}
            </main>
            <div className="flex justify-center mt-12">
                <button
                    className="
           border-2 border-primaryBlueColor text-primaryBlueColor px-6 py-4 rounded-[100px] hover:bg-primaryBlueColor hover:text-white  transition-colors duration-300 "
                >
                    Find More companies
                </button>
            </div>
        </section>
    );
};

export default Institution;
