import React from "react";

const features = [
  {
    title: "Phòng trọ giá rẻ",
    desc: "Phù hợp với ngân sách sinh viên",
  },
  {
    title: "An toàn & tiện nghi",
    desc: "Thông tin xác minh, rõ ràng",
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Chăm sóc tận tình",
  },
];

const FeatureList = () => {
  return (
    <section className="features">
      <h2>Lý do chọn TroUni?</h2>
      <div className="features__list">
        {features.map((item, index) => (
          <div className="feature" key={index}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureList;
