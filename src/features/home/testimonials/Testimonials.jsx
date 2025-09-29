import React from "react";
import { Card, Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import "./Testimonials.scss";

const testimonials = [
  {
    name: "Lê Văn C",
    rating: 5,
    content:
      "Vị trí thuận tiện, giá cả hợp lý với sinh viên. Đặc biệt thích tính năng chat trực tiếp.",
  },
  {
    name: "Nguyễn Thị B",
    rating: 4,
    content: "Trang web dễ dùng, nhanh chóng tìm được phòng ưng ý.",
  },
  {
    name: "Phạm Văn A",
    rating: 5,
    content: "Giao diện hiện đại, dễ thao tác, tìm trọ rất nhanh.",
  },
  {
    name: "Trần Thị D",
    rating: 4,
    content: "Có nhiều lựa chọn, mình tìm được phòng đúng nhu cầu.",
  },
  {
    name: "Ngô Minh E",
    rating: 5,
    content: "Đăng tin miễn phí, tiết kiệm chi phí cho chủ trọ.",
  },
];

const Testimonials = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // hiển thị 3 feedback
    slidesToScroll: 1,
    arrows: true, // hiện mũi tên
    responsive: [
      {
        breakpoint: 992, // tablet
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 576, // mobile
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="testimonials">
      <h2>Khách hàng nói gì về Trọ UNI?</h2>
      <Slider {...settings}>
        {testimonials.map((t, i) => (
          <Card key={i} className="testimonial-card">
            <Avatar size={64} icon={<UserOutlined />} />
            <h4>{t.name}</h4>
            <Rate
              disabled
              defaultValue={t.rating}
              className="star-with-border"
            />
            <p>{t.content}</p>
          </Card>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonials;
