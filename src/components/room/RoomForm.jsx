import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Upload,
  message,
  Space,
  Divider,
  Typography
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined
} from "@ant-design/icons";
import { useRoomManagement } from "../../hooks/useRooms";
import {
  ROOM_TYPE,
  ROOM_STATUS,
  ROOM_TYPE_LABELS,
  ROOM_STATUS_LABELS,
  VIETNAM_CITIES,
  HCM_DISTRICTS,
  HN_DISTRICTS,
  ROOM_VALIDATION
} from "../../utils/roomConstants";
import { convertAddressForBackend } from "../../utils/addressMapping";
import { formatNumberWithCommas, removeCommasFromNumber, isValidPrice, isValidArea } from "../../utils/numberFormatting";
import "./RoomForm.scss";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const RoomForm = ({ roomId, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [amenityList, setAmenityList] = useState([]);
  
  const { createRoom, updateRoom, loading: apiLoading, error } = useRoomManagement();

  const isEditMode = !!roomId;

  // Load room data for editing
  useEffect(() => {
    if (isEditMode) {
      // TODO: Load room data and populate form
      // fetchRoomData(roomId);
    }
  }, [roomId, isEditMode]);

  // Handle city change
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedDistrict("");
    form.setFieldsValue({ district: undefined });
  };

  // Get districts based on selected city
  const getDistricts = () => {
    if (selectedCity === "Hồ Chí Minh") return HCM_DISTRICTS;
    if (selectedCity === "Hà Nội") return HN_DISTRICTS;
    return [];
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    let newFileList = [...info.fileList];
    
    // Limit to 10 images
    newFileList = newFileList.slice(-10);
    
    // Handle upload status
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    
    setImageList(newFileList);
  };

  // Remove image
  const removeImage = (file) => {
    const newList = imageList.filter(item => item.uid !== file.uid);
    setImageList(newList);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Debug: Log form values
      console.log("📝 Form values:", values);
      console.log("🖼️ Image list:", imageList);
      console.log("🏠 Amenity list:", amenityList);
      
      // Prepare room data
      const roomData = {
        ...values,
        images: imageList.map(img => ({
          imageUrl: img.url || img.thumbUrl,
          isPrimary: img.uid === imageList[0]?.uid
        })),
        amenityIds: amenityList.map(amenity => amenity.id)
      };

      // Convert address format cho backend
      if (values.city || values.district || values.ward) {
        const addressData = convertAddressForBackend({
          city: values.city,
          district: values.district,
          ward: values.ward
        });
        roomData.city = addressData.city;
        roomData.district = addressData.district;
        roomData.ward = addressData.ward;
      }

      // Clean price data - loại bỏ dấu phẩy
      if (roomData.pricePerMonth) {
        roomData.pricePerMonth = removeCommasFromNumber(roomData.pricePerMonth);
      }
      if (roomData.areaSqm) {
        roomData.areaSqm = removeCommasFromNumber(roomData.areaSqm);
      }

      console.log("📤 Final room data to send:", roomData);

      let result;
      if (isEditMode) {
        result = await updateRoom(roomId, roomData);
        message.success("Cập nhật phòng trọ thành công!");
      } else {
        result = await createRoom(roomData);
        message.success("Tạo phòng trọ thành công!");
      }

      // Reset form
      form.resetFields();
      setImageList([]);
      setAmenityList([]);
      setSelectedCity("");
      setSelectedDistrict("");

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("❌ Form submission error:", err);
      
      // Show detailed error message
      let errorMessage = "Có lỗi xảy ra!";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.join(", ");
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="room-form-container">
      <Card className="room-form-card">
        <div className="form-header">
          <Title level={3}>
            {isEditMode ? "Cập nhật phòng trọ" : "Đăng phòng trọ mới"}
          </Title>
          <p className="form-description">
            {isEditMode 
              ? "Cập nhật thông tin phòng trọ của bạn"
              : "Điền thông tin chi tiết để đăng phòng trọ"
            }
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: ROOM_STATUS.AVAILABLE,
            roomType: ROOM_TYPE.PHONG_TRO  // Default là PHONG_TRO thay vì APARTMENT
          }}
        >
          {/* Basic Information */}
          <div className="form-section">
            <Title level={4}>Thông tin cơ bản</Title>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="title"
                  label="Tiêu đề"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề" },
                    { 
                      min: ROOM_VALIDATION.TITLE.MIN_LENGTH, 
                      message: `Tiêu đề phải có ít nhất ${ROOM_VALIDATION.TITLE.MIN_LENGTH} ký tự` 
                    },
                    { 
                      max: ROOM_VALIDATION.TITLE.MAX_LENGTH, 
                      message: `Tiêu đề không được quá ${ROOM_VALIDATION.TITLE.MAX_LENGTH} ký tự` 
                    }
                  ]}
                >
                  <Input placeholder="VD: Phòng trọ đẹp gần trường đại học" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="roomType"
                  label="Loại phòng"
                  rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
                >
                  <Select placeholder="Chọn loại phòng">
                    {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="description"
                  label="Mô tả chi tiết"
                  rules={[
                    { 
                      max: ROOM_VALIDATION.DESCRIPTION.MAX_LENGTH, 
                      message: `Mô tả không được quá ${ROOM_VALIDATION.DESCRIPTION.MAX_LENGTH} ký tự` 
                    }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Mô tả chi tiết về phòng trọ, tiện ích, môi trường xung quanh..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Location Information */}
          <div className="form-section">
            <Title level={4}>Thông tin địa chỉ</Title>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="city"
                  label="Thành phố"
                  rules={[{ required: true, message: "Vui lòng chọn thành phố" }]}
                >
                  <Select
                    placeholder="Chọn thành phố"
                    onChange={handleCityChange}
                    value={selectedCity}
                  >
                    {VIETNAM_CITIES.map(city => (
                      <Option key={city} value={city}>{city}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    value={selectedDistrict}
                    onChange={setSelectedDistrict}
                    disabled={!selectedCity}
                  >
                    {getDistricts().map(district => (
                      <Option key={district} value={district}>{district}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
                >
                  <Input placeholder="VD: Phường 1" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="streetAddress"
                  label="Địa chỉ chi tiết"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                    { 
                      max: ROOM_VALIDATION.ADDRESS.MAX_LENGTH, 
                      message: `Địa chỉ không được quá ${ROOM_VALIDATION.ADDRESS.MAX_LENGTH} ký tự` 
                    }
                  ]}
                >
                  <Input placeholder="VD: 123 Đường ABC, Phường 1, Quận 1" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="latitude"
                  label="Vĩ độ (Latitude)"
                >
                  <Input
                    placeholder="VD: 10.762622"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="longitude"
                  label="Kinh độ (Longitude)"
                >
                  <Input
                    placeholder="VD: 106.660172"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Room Details */}
          <div className="form-section">
            <Title level={4}>Chi tiết phòng</Title>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="pricePerMonth"
                  label="Giá thuê/tháng (VNĐ)"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá thuê" },
                    { 
                      validator: (_, value) => {
                        if (!value) return Promise.reject('Vui lòng nhập giá thuê');
                        if (!isValidPrice(value)) return Promise.reject('Giá thuê phải là số hợp lệ');
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    placeholder="VD: 3,000,000"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      const formatted = formatNumberWithCommas(e.target.value);
                      e.target.value = formatted;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="areaSqm"
                  label="Diện tích (m²)"
                  rules={[
                    { 
                      validator: (_, value) => {
                        if (!value) return Promise.resolve(); // Area có thể để trống
                        if (!isValidArea(value)) return Promise.reject('Diện tích phải là số hợp lệ');
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    placeholder="VD: 25"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      const formatted = formatNumberWithCommas(e.target.value);
                      e.target.value = formatted;
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    {Object.entries(ROOM_STATUS_LABELS).map(([key, label]) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* Images */}
          <div className="form-section">
            <Title level={4}>Hình ảnh phòng trọ</Title>
            <p className="section-description">
              Tải lên tối đa 10 hình ảnh. Hình đầu tiên sẽ là ảnh đại diện.
            </p>
            
            <Form.Item name="images">
              <Upload
                listType="picture-card"
                fileList={imageList}
                onChange={handleImageUpload}
                onRemove={removeImage}
                multiple
                maxCount={10}
                beforeUpload={() => false} // Prevent auto upload
              >
                {imageList.length >= 10 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          {/* Amenities */}
          <div className="form-section">
            <Title level={4}>Tiện ích</Title>
            <p className="section-description">
              Chọn các tiện ích có sẵn trong phòng trọ
            </p>
            
            {/* TODO: Implement amenities selection */}
            <div className="amenities-placeholder">
              <p>Chức năng chọn tiện ích sẽ được thêm sau</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Space>
              <Button onClick={onCancel} disabled={loading || apiLoading}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || apiLoading}
                icon={<SaveOutlined />}
              >
                {isEditMode ? "Cập nhật" : "Đăng phòng"}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RoomForm;
