import Hero from "../appUi/components/Hero";
import React, { useState, useEffect } from "react";
import Institution from "../appUi/components/institution";

const Home = () => {
  return (
    <main className="">
      <>
        <Hero />
        <Institution />
      </>
    </main>
  );
};

export default Home;
