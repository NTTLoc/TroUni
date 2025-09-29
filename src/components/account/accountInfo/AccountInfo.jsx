import { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Select, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ProfileContext } from "../../context/profile.context";
import "./AccountInfo.scss";

const AccountInfo = () => {
  const { profile, updateProfile } = useContext(ProfileContext);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const email = savedUser?.email || "Không có email";

  // Khởi tạo form với dữ liệu hiện tại
  useEffect(() => {
    form.setFieldsValue({
      ...profile,
      email: email,
    });
  }, [profile, form, email]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateProfile(values);
      message.success("Cập nhật profile thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi lưu profile:", err);
      message.error("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Thông tin cá nhân</h2>

      <div className="profile-avatar">
        <Avatar size={100} src={profile?.avatarUrl} icon={<UserOutlined />} />
        <p>{savedUser?.username || "Không có username"}</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={profile}
        disabled={!isEditing}
      >
        <Form.Item label="Họ và tên" name="fullName">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          {isEditing ? (
            <Select>
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nữ">Nữ</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          ) : (
            <Input disabled />
          )}
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber">
          <Input />
        </Form.Item>

        <Form.Item label="Huy hiệu" name="badge">
          <Input />
        </Form.Item>
      </Form>

      <div style={{ textAlign: "right" }}>
        {isEditing ? (
          <Button type="primary" onClick={handleSave}>
            Lưu
          </Button>
        ) : (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
