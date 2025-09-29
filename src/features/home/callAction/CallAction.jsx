import React from "react";
import { Button } from "antd";
import "./CallAction.scss";

const CallAction = () => {
  return (
    <section className="cta">
      <h2>Bạn đã sẵn sàng tìm phòng trọ lý tưởng?</h2>
      <p>
        Tham gia Trọ UNI ngay hôm nay để trải nghiệm dịch vụ tìm kiếm và cho
        thuê phòng trọ hiện đại, an toàn, tiện lợi!
      </p>
      <div className="cta-buttons">
        <Button type="primary" size="large">
          🚀 Đăng ký miễn phí
        </Button>
        <Button type="default" size="large">
          🏠 Đăng tin cho thuê
        </Button>
      </div>
    </section>
  );
};

export default CallAction;
