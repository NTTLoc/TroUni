import React from "react";
import { Form, Select, Slider, Button } from "antd";

const FilterPanel = ({ onFilter }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Filter:", values);
    onFilter([]); // TODO: gọi API lọc
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Giới tính" name="gender">
        <Select placeholder="Chọn giới tính">
          <Select.Option value="Nam">Nam</Select.Option>
          <Select.Option value="Nữ">Nữ</Select.Option>
          <Select.Option value="Khác">Khác</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Ngân sách" name="budget">
        <Slider range min={1000000} max={6000000} step={500000} />
      </Form.Item>

      <Form.Item label="Trường/Địa điểm" name="university">
        <Select placeholder="Chọn trường">
          <Select.Option value="ĐH Bách Khoa">ĐH Bách Khoa</Select.Option>
          <Select.Option value="ĐH Kinh tế">ĐH Kinh tế</Select.Option>
          <Select.Option value="ĐH CNTT">ĐH CNTT</Select.Option>
        </Select>
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Áp dụng bộ lọc
      </Button>
    </Form>
  );
};

export default FilterPanel;
