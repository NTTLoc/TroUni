import React from "react";
import MyProperties from "../../components/property/MyProperties";

export default function MyPropertiesPage() {
  return (
    <div className="container py-4">
      <h2 className="mb-4">Quản lý phòng của tôi</h2>
      <MyProperties />
    </div>
  );
}
