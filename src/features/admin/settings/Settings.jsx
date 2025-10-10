import React from "react";
import { Card, Switch, Divider } from "antd";
// import "./Settings.scss";

const Settings = () => {
  return (
    <div className="settings-page">
      <h2 className="page-title">Cài đặt hệ thống</h2>
      <Card>
        <p>
          🌗 Chế độ tối{" "}
          <Switch
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
            defaultChecked={false}
          />
        </p>
        <Divider />
        <p>
          📢 Thông báo hệ thống{" "}
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </p>
      </Card>
    </div>
  );
};

export default Settings;
