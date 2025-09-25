import React from "react";
import "../../pages/home/HomePage.scss";
import Hero from "../../components/home/hero/Hero";
import FeatureList from "../../components/home/featureList/FeatureList";
import Process from "../../components/home/process/Process";
import Testimonials from "../../components/home/testimonials/Testimonials";
import CallAction from "../../components/home/callAction/CallAction";
import FeaturedRooms from "../../components/home/featuredRooms/FeaturedRooms";

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
