import React from "react";
import ButtonOne from "./ui/ButtonOne";

const HeroPage = () => {
  return (
    <section className="max-h-[40rem] h-screen w-screen rounded-md flex md:items-center md:justify-center bg-white dark:bg-black/[0.96] relative px-32">
      <div className="overflow-hidden h-full max-h-[40rem] relative w-full flex md:items-center md:justify-center">
        <div className="absolute md:left-0 left-0 top-20 h-full pointer-events-none opacity-20 flex flex-col space-y-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#D2FBEF"
              d="M34,-37.1C50,-27.1,73,-22,81.9,-8.9C90.9,4.3,85.9,25.5,72.2,34.7C58.6,43.9,36.3,41.1,20.1,40.8C3.9,40.5,-6.2,42.7,-19.4,42.5C-32.6,42.4,-48.9,40,-60.3,30C-71.7,20.1,-78.3,2.6,-74.7,-12.3C-71,-27.1,-57.1,-39.3,-43,-49.6C-28.8,-60,-14.4,-68.5,-2.7,-65.3C9,-62.1,18,-47.2,34,-37.1Z"
              transform="translate(100 100)"
            />
          </svg>

          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#24A148"
              d="M42,-30C57.4,-14.2,75,3.5,73.7,19.9C72.4,36.4,52.3,51.7,33.8,54.6C15.3,57.5,-1.6,47.9,-16.8,39C-31.9,30.1,-45.3,21.8,-48.7,10.2C-52,-1.3,-45.2,-16,-35.5,-30.5C-25.7,-45,-12.8,-59.3,0.2,-59.5C13.3,-59.7,26.6,-45.8,42,-30Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="w-48 h-48"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#D2FBEF"
              d="M34,-37.1C50,-27.1,73,-22,81.9,-8.9C90.9,4.3,85.9,25.5,72.2,34.7C58.6,43.9,36.3,41.1,20.1,40.8C3.9,40.5,-6.2,42.7,-19.4,42.5C-32.6,42.4,-48.9,40,-60.3,30C-71.7,20.1,-78.3,2.6,-74.7,-12.3C-71,-27.1,-57.1,-39.3,-43,-49.6C-28.8,-60,-14.4,-68.5,-2.7,-65.3C9,-62.1,18,-47.2,34,-37.1Z"
              transform="translate(50 50)"
            />
          </svg>
        </div>

        <div className=" absolute md:right-0 -right-20 top-20 h-full pointer-events-none opacity-20 flex flex-col space-y-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#D2FBEF"
              d="M34,-37.1C50,-27.1,73,-22,81.9,-8.9C90.9,4.3,85.9,25.5,72.2,34.7C58.6,43.9,36.3,41.1,20.1,40.8C3.9,40.5,-6.2,42.7,-19.4,42.5C-32.6,42.4,-48.9,40,-60.3,30C-71.7,20.1,-78.3,2.6,-74.7,-12.3C-71,-27.1,-57.1,-39.3,-43,-49.6C-28.8,-60,-14.4,-68.5,-2.7,-65.3C9,-62.1,18,-47.2,34,-37.1Z"
              transform="translate(100 100)"
            />
          </svg>

          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#24A148"
              d="M42,-30C57.4,-14.2,75,3.5,73.7,19.9C72.4,36.4,52.3,51.7,33.8,54.6C15.3,57.5,-1.6,47.9,-16.8,39C-31.9,30.1,-45.3,21.8,-48.7,10.2C-52,-1.3,-45.2,-16,-35.5,-30.5C-25.7,-45,-12.8,-59.3,0.2,-59.5C13.3,-59.7,26.6,-45.8,42,-30Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="w-48 h-48"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#D2FBEF"
              d="M34,-37.1C50,-27.1,73,-22,81.9,-8.9C90.9,4.3,85.9,25.5,72.2,34.7C58.6,43.9,36.3,41.1,20.1,40.8C3.9,40.5,-6.2,42.7,-19.4,42.5C-32.6,42.4,-48.9,40,-60.3,30C-71.7,20.1,-78.3,2.6,-74.7,-12.3C-71,-27.1,-57.1,-39.3,-43,-49.6C-28.8,-60,-14.4,-68.5,-2.7,-65.3C9,-62.1,18,-47.2,34,-37.1Z"
              transform="translate(50 50)"
            />
          </svg>
        </div>
        <svg
          className="h-48 w-48 absolute top-20 left-0 right-0 fill-secondary/10"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M34,-37.1C50,-27.1,73,-22,81.9,-8.9C90.9,4.3,85.9,25.5,72.2,34.7C58.6,43.9,36.3,41.1,20.1,40.8C3.9,40.5,-6.2,42.7,-19.4,42.5C-32.6,42.4,-48.9,40,-60.3,30C-71.7,20.1,-78.3,2.6,-74.7,-12.3C-71,-27.1,-57.1,-39.3,-43,-49.6C-28.8,-60,-14.4,-68.5,-2.7,-65.3C9,-62.1,18,-47.2,34,-37.1Z"
            transform="translate(100 100)"
          />
        </svg>
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0 flex flex-col justify-center items-center">
          <h2 className="text-4xl font-semibold bg-clip-text bg-gradient-to-b text-transparent from-secondary to-primary">
            Welcome
          </h2>
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-500 to-neutral-900">
            AI-Powered Reputation Tracker
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-500 max-w-lg text-center mx-auto">
            Connect with top professionals in any field through our AI and Web3
            blockchain-powered reputation system. Recruiters can easily find and
            select high-reputation individuals, ensuring quality and trust in
            every hire.
          </p>
          <ButtonOne title="Find Top Candidates" className="mt-4" />
        </div>
      </div>
      <div className="absolute top-[28rem] left-0 w-full h-[40rem] md:px-0 px-4">
        <div className="relative w-full h-full max-w-5xl mx-auto">
          {/* <img src="/images/mockup.webp" alt="" className="w-full h-[80vh]"/> */}
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
