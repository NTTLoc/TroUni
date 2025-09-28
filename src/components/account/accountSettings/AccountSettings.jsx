import { Button } from "antd";
import "./AccountSettings.scss";

const AccountSettings = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Cài đặt</h2>
      <p>Ngôn ngữ, theme, thông báo...</p>
      <Button>Cài đặt chung</Button>
    </div>
  );
};

export default AccountSettings;
