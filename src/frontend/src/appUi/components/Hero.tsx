import React from "react";
import Button from "./ui/Button";
import { Input } from "postcss";

const HeroPage = () => {
  return (
    <section className="w-full min-h-[80vh] mx-auto px-32 flex items-center justify-center pr-11 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-30"
          style={{ width: "600px", height: "400px" }}
        >
          <svg
            className="animation-circleFlow"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              fill="#8A3FFC"
              d="M48.2,-58.7C60.7,-46.9,67.8,-30.1,68.5,-13.9C69.3,2.4,63.7,17.9,55.7,32.5C47.7,47.1,37.4,60.7,23.8,65.8C10.2,70.9,-6.6,67.5,-18.9,59.7C-31.2,51.8,-39.1,39.5,-47.4,26.6C-55.7,13.8,-64.5,0.4,-62.4,-11C-60.4,-22.4,-47.6,-31.9,-35.4,-43.7C-23.2,-55.6,-11.6,-69.7,3.1,-73.5C17.8,-77.2,35.7,-70.5,48.2,-58.7Z"
              transform="translate(100 100)"
            >
              <animate
                attributeName="d"
                dur="20s"
                repeatCount="indefinite"
                values="M48.2,-58.7C60.7,-46.9,67.8,-30.1,68.5,-13.9C69.3,2.4,63.7,17.9,55.7,32.5C47.7,47.1,37.4,60.7,23.8,65.8C10.2,70.9,-6.6,67.5,-18.9,59.7C-31.2,51.8,-39.1,39.5,-47.4,26.6C-55.7,13.8,-64.5,0.4,-62.4,-11C-60.4,-22.4,-47.6,-31.9,-35.4,-43.7C-23.2,-55.6,-11.6,-69.7,3.1,-73.5C17.8,-77.2,35.7,-70.5,48.2,-58.7Z; M43.4,-51.4C57.6,-39.9,71.2,-27.4,74.8,-12.4C78.3,2.7,72,20.3,60.2,29.3C48.5,38.4,31.5,39,16.5,43.8C1.5,48.6,-11.4,57.6,-24.4,57.2C-37.4,56.7,-50.5,46.7,-59.5,33.3C-68.4,19.9,-73.2,3.1,-69.6,-11.4C-66,-25.9,-54,-38,-41,-49.7C-28,-61.4,-14,-72.7,0.3,-73C14.7,-73.4,29.3,-62.9,43.4,-51.4Z; M29.9,-34.7C43.7,-24.1,63.2,-19.3,72.5,-6.8C81.9,5.8,81.2,26.1,70.8,37.8C60.4,49.6,40.3,52.7,22,58.5C3.7,64.3,-13,72.8,-27.3,69.8C-41.6,66.8,-53.6,52.3,-61.9,36.5C-70.1,20.6,-74.6,3.3,-72,-12.9C-69.3,-29,-59.5,-44.1,-46.3,-54.8C-33.1,-65.4,-16.5,-71.7,-4.2,-66.6C8.1,-61.6,16.1,-45.2,29.9,-34.7Z; M48.2,-58.7C60.7,-46.9,67.8,-30.1,68.5,-13.9C69.3,2.4,63.7,17.9,55.7,32.5C47.7,47.1,37.4,60.7,23.8,65.8C10.2,70.9,-6.6,67.5,-18.9,59.7C-31.2,51.8,-39.1,39.5,-47.4,26.6C-55.7,13.8,-64.5,0.4,-62.4,-11C-60.4,-22.4,-47.6,-31.9,-35.4,-43.7C-23.2,-55.6,-11.6,-69.7,3.1,-73.5C17.8,-77.2,35.7,-70.5,48.2,-58.7Z;"
              />
            </path>
          </svg>
        </div>
      </div>
      <div
        className="absolute right-0 top-[50%] transform -translate-y-1/2 opacity-30"
        style={{ width: "600px", height: "800px" }}
      >
        <svg
          className="animation-circleFlow"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%" }}
        >
          <path
            fill="#ECDFCC"
            d="M48.2,-58.7C60.7,-46.9,67.8,-30.1,68.5,-13.9C69.3,2.4,63.7,17.9,55.7,32.5C47.7,47.1,37.4,60.7,23.8,65.8C10.2,70.9,-6.6,67.5,-18.9,59.7C-31.2,51.8,-39.1,39.5,-47.4,26.6C-55.7,13.8,-64.5,0.4,-62.4,-11C-60.4,-22.4,-47.6,-31.9,-35.4,-43.7C-23.2,-55.6,-11.6,-69.7,3.1,-73.5C17.8,-77.2,35.7,-70.5,48.2,-58.7Z"
            transform="translate(100 100)"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
          M48.2,-58.7C60.7,-46.9,67.8,-30.1,68.5,-13.9C69.3,2.4,63.7,17.9,55.7,32.5C47.7,47.1,37.4,60.7,23.8,65.8C10.2,70.9,-6.6,67.5,-18.9,59.7C-31.2,51.8,-39.1,39.5,-47.4,26.6C-55.7,13.8,-64.5,0.4,-62.4,-11C-60.4,-22.4,-47.6,-31.9,-35.4,-43.7C-23.2,-55.6,-11.6,-69.7,3.1,-73.5C17.8,-77.2,35.7,-70.5,48.2,-58.7Z;
          M43.4,-51.4C57.6,-39.9,71.2,-27.4,74.8,-12.4C78.3,2.7,72,20.3,60.2,29.3C48.5,38.4,31.5,39,16.5,43.8C1.5,48.6,-11.4,57.6,-24.4,57.2C-37.4,56.7,-50.5,46.7,-59.5,33.3C-68.4,19.9,-73.2,3.1,-69.6,-11.4C-66,-25.9,-54,-38,-41,-49.7C-28,-61.4,-14,-72.7,0.3,-73C14.7,-73.4,29.3,-62.9,43.4,-51.4Z"
              keyTimes="0; 1"
              keySplines="0.25 0.46 0.45 0.94"
            />
          </path>
        </svg>
      </div>

      <div className="flex relative z-10 items-center justify-center flex-col gap-10">
        <h1 className="text-center  leading-[50px] lg:w-[600px] text-largeTextColor font-bold text-5xl">
          Get The{" "}
          <span className="text-primaryBlueColor"> Right candidate </span> you
          deserve <br></br>
        </h1>
        <p className="text-center text-normalTextColor text-sm">
          3,600 candidates, their profiles are listed here you can hire who you
          want{" "}
        </p>
        <div>
          <form className="mt-6">
            <div className="relative max-w-lg">
              <label className="sr-only" htmlFor="name">
                name
              </label>

              <input
                className="w-full rounded-full border-gray-200 bg-gray-100 p-4 pe-32 text-sm font-medium focus:border-primaryBlueColor focus:border-2 focus:outline-none focus:border-opacity-50 transition-colors duration-200"
                id="name"
                type="name"
                placeholder="search candidate"
              />
              <button className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-primaryBlueColor px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
                search candidate
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
