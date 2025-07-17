import React from "react";
import "../../pages/home/HomePage.scss";
import Hero from "../../components/hero/Hero";
import FeatureList from "../../components/feature/FeatureList";

const Home = () => {
  return (
    <div className="page-container">
      <main className="page-content home-page">
        <Hero />
        <FeatureList />
      </main>
    </div>
  );
};

export default Home;
