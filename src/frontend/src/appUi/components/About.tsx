import React from "react";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { FaDrawPolygon } from "react-icons/fa";
import { GiHumanPyramid } from "react-icons/gi";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { GrUserPolice } from "react-icons/gr";
import { FaHandshake } from "react-icons/fa6";
import { FcCustomerSupport } from "react-icons/fc";
import { RiFolderSettingsLine } from "react-icons/ri";
const About = () => {

    const AboutData = [
        {
            icon: <HiOutlineSpeakerphone className="text-orange-400" />,
            title: "Marketing & Communication",
            description:
                "58 Jobs Available",
        },
        {
            icon: <FaDrawPolygon className="text-blue-500" />,
            title: "Design & Development",
            description:
                "128 Jobs Available",
        },
        {
            icon: <GiHumanPyramid className="text-blue-300" />,
            title: "Human Research  & Development",
            description:
                "199 Jobs Available",
        },
        {
            icon: <FaHandHoldingDollar className="text-yellow-300" />,
            title: "Finance Management",
            description:
                "237 Jobs Available",
        },
        {
            icon: <GrUserPolice className="text-violet-500" />,
            title: "ArmForce Guide & security",
            description:
                "120 Jobs Available",
        },
        {
            icon: <FaHandshake className="text-red-400" />,
            title: "Business & consulting",
            description:
                "47 Jobs Available",
        }, {
            icon: <FcCustomerSupport />,
            title: "Customer Support Care",
            description:
                "38 Jobs Available",
        },

        {
            icon: <RiFolderSettingsLine className="text-green-500" />,
            title: "Project Management",
            description:
                "87 Jobs Available",
        }
    ];
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    return (
        <div className=" ml-10 mr-10 h-full px-20 py-32   round-sm  bg-AboutBgColor">
            <div className="flex flex-col mb-8 h-full items-center justify-center">
                <h1 className="text-largeTextColor font-bold text-5xl lg:w-[400px]">
                    One Platform Many{" "}
                    <span className="text-primaryBlueColor">Solution</span>
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mx-auto gap-4  lg:grid-cols-4 2xl:grid-cols-4">
                {AboutData.map((item, index) => (
                    <div
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        key={index}
                        className="flex flex-col duration-300 transition-all p-4 hover:bg-primaryBlueColor cursor-pointer   rounded-md shadow-sm items-center  justify-center bg-whiteColor"
                    >
                        <div className="flex items-center w-[230px] justify-center">
                            <div className="text-primaryBlueColor text-xl">
                                {item.icon}
                            </div>
                            <div className="ml-4">
                                <h1 className={`${hoveredIndex === index ? "text-whiteColor" : ""} text-largeTextColor font-bold text-xl`}>
                                    {item.title}
                                </h1>
                                <p className={`text-sm ${hoveredIndex === index ? "text-whiteColor" : ""} text-normalTextColor`}>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
