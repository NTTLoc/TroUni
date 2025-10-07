import React, { useState } from "react";
import { Form, Input, InputNumber, Button } from "antd";

const GroupForm = ({ onCreate }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onCreate({
      id: Date.now(),
      ...values,
      members: 1,
    });
    form.resetFields();
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        name="name"
        label="Tên nhóm"
        rules={[{ required: true, message: "Nhập tên nhóm" }]}
      >
        <Input placeholder="Nhóm nữ CNTT..." />
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Số thành viên tối đa"
        rules={[{ required: true }]}
      >
        <InputNumber min={2} max={10} style={{ width: "100%" }} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Tạo nhóm
      </Button>
    </Form>
  );
};

export default GroupForm;
