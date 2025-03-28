import Header from './universities/Header'
import UniversitiesList from './universities/UniversitiesList'
import React from 'react'
const UnivSection = () => {
  return (
    <section className='min-h-screen w-full pt-10 bg-white md:px-20 px-4 flex flex-col gap-8 py-8'>
      <Header/>
      <UniversitiesList/>
    </section>
  )
}

export default UnivSection 
