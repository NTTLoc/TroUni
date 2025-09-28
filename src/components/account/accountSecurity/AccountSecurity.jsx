import { Button } from "antd";
import "./AccountSecurity.scss";

const AccountSecurity = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Bảo mật</h2>
      <p>Đổi mật khẩu, bật xác thực 2 lớp...</p>
      <Button type="primary">Đổi mật khẩu</Button>
    </div>
  );
};

export default AccountSecurity;
