import React from "react";
import { useNavigation } from "react-router-dom";
import "./GlobalLoader.scss";

const GlobalLoader = () => {
  const navigation = useNavigation();

  return navigation.state === "loading" ? (
    <div className="global-loader">
      <div className="spinner"></div>
    </div>
  ) : null;
};

export default GlobalLoader;
