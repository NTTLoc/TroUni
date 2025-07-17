import React from "react";

const privateRoutes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return <div>privateRoutes</div>;
};

export default privateRoutes;
