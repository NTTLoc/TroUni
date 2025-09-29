import React from "react";
import "../../pages/home/HomePage.scss";
import Hero from "../../features/home/hero/Hero";
import FeatureList from "../../features/home/featureList/FeatureList";
import Process from "../../features/home/process/Process";
import Testimonials from "../../features/home/testimonials/Testimonials";
import CallAction from "../../features/home/callAction/CallAction";
import FeaturedRooms from "../../features/home/featuredRooms/FeaturedRooms";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeatureList />
      <FeaturedRooms />
      <Process />
      <Testimonials />
      <CallAction />
    </div>
  );
};

export default Home;
