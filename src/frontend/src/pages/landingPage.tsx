import About from "../appUi/components/About";
import Hero from "../appUi/components/Hero";
import UnivSection from "../appUi/components/UnivSection";
import React, { useState, useEffect } from "react";
import Institution from "../appUi/components/institution";

const Home = () => {
  return (
    <main className="">
      <>
        <Hero />
        <About />
        <Institution />
      </>
    </main>
  );
};

export default Home;
