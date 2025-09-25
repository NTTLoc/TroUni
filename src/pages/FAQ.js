import React from "react";
import { Accordion, Container } from "react-bootstrap";

const FAQ = () => (
  <Container className="py-5">
    <h2 className="mb-4 text-center">Câu hỏi thường gặp (FAQ)</h2>
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Làm sao để đăng tin cho thuê phòng?</Accordion.Header>
        <Accordion.Body>
          Bạn chỉ cần đăng nhập, vào mục "Đăng tin", điền đầy đủ thông tin và
          nhấn "Đăng tin".
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Làm sao để liên hệ chủ phòng?</Accordion.Header>
        <Accordion.Body>
          Ở trang chi tiết phòng, bạn sẽ thấy nút "Liên hệ" hoặc số điện thoại
          của chủ phòng.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>
          Làm sao để tích điểm và nhận thưởng?
        </Accordion.Header>
        <Accordion.Body>
          Bạn sẽ tích điểm khi thực hiện các hành động như đăng tin, đánh giá,
          chia sẻ... Điểm có thể đổi thưởng tại mục "Thành tích & Phần thưởng".
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Container>
);

export default FAQ;
