import UniverCard from "../ui/UniverCard";
import { universities } from "../../constants";
import React, { useEffect, useState } from "react";
const UniversitiesList = () => {
  // const [universities, setUniversities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUniversities();
  }, []);

  const getUniversities = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${(import.meta as any).env.VITE_CANISTER_ORIGIN}/universities`
    );
    const responseJson = await response.json();
    console.log("responseJson", responseJson);
    setIsLoading(false);
    // setUniversities(responseJson);
  };

  return (
    <section className="w-full grid grid-cols-4 gap-4">
      {/* {isLoading ? <p>Loading...</p> : null} */}
      {universities.map((university, index) => (
        <UniverCard
          key={index}
          name={university.name}
          description={university?.description}
          establishedYear={university?.establishedYear}
          location={university?.location}
          departments={university?.departments}
        />
      ))}
    </section>
  );
};

export default UniversitiesList;
