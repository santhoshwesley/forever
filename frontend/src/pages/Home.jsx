import React from 'react'
import Herosection from '../components/Herosection'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'



const Home = () => {
  return (
    <div>
      <Herosection />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
      
    </div>
  )
}

export default Home