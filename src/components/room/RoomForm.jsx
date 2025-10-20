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
  Space,
  Divider,
  Typography,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  SaveOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useRoomManagement } from "../../hooks/useRooms";
import {
  uploadImageFileApi,
  generateMockImageUrl,
} from "../../services/postApi";
import { uploadToCloudinary } from "../../services/cloudinaryApi";
import AmenitySelector from "../amenity/AmenitySelector";
import GoongMapSelector from "../map/GoongMapSelector";
import { parseAddress } from "../../utils/addressParser";
import {
  ROOM_TYPE,
  ROOM_STATUS,
  ROOM_TYPE_LABELS,
  ROOM_STATUS_LABELS,
  VIETNAM_CITIES,
  HCM_DISTRICTS,
  HN_DISTRICTS,
  ROOM_VALIDATION,
} from "../../utils/roomConstants";
import { convertAddressForBackend } from "../../utils/addressMapping";
import {
  formatNumberWithCommas,
  removeCommasFromNumber,
  isValidPrice,
  isValidArea,
} from "../../utils/numberFormatting";
import useMessage from "../../hooks/useMessage";
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
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const message = useMessage();

  // Debug amenity list changes
  useEffect(() => {
    console.log("🏠 Amenity list updated:", amenityList);
  }, [amenityList]);

  const {
    createRoom,
    updateRoom,
    loading: apiLoading,
    error,
  } = useRoomManagement();

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

  // Parse address for form fields
  const parseAddressForForm = (locationData) => {
    const { address, addressDetails } = locationData;
    const parsed = parseAddress(address, addressDetails);
    
    return {
      ...parsed,
      fullAddress: address,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    };
  };

  // Handle location selection from map
  const handleLocationSelect = (locationData) => {
    console.log("🗺️ Location selected:", locationData);
    setSelectedLocation(locationData);
    
    // Parse address using utility function
    const { city, district, ward, fullAddress } = parseAddressForForm(locationData);
    
    // Update form fields
    if (city) {
      setSelectedCity(city);
      form.setFieldsValue({ city });
    }
    
    if (district) {
      setSelectedDistrict(district);
      form.setFieldsValue({ district });
    }
    
    if (ward) {
      form.setFieldsValue({ ward });
    }
    
    form.setFieldsValue({ streetAddress: fullAddress });
    
    // Hide map after selection
    setShowMap(false);
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    let newFileList = [...info.fileList];

    // Limit to 10 images
    newFileList = newFileList.slice(-10);

    // Handle upload status and file processing
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }

      // Ensure we have the file object
      if (file.originFileObj) {
        // File is ready for upload
        return file;
      } else if (file.url) {
        // File already has URL (previously uploaded)
        return file;
      }

      return file;
    });

    console.log("📸 Updated image list:", newFileList);
    setImageList(newFileList);
  };

  // Remove image
  const removeImage = (file) => {
    const newList = imageList.filter((item) => item.uid !== file.uid);
    setImageList(newList);
  };

  // Handle form submission
  // const handleSubmit = async (values) => {
  //   try {
  //     setLoading(true);

  //     // Debug: Log form values
  //     console.log("📝 Form values:", values);
  //     console.log("🖼️ Image list:", imageList);
  //     console.log("🏠 Amenity list:", amenityList);

  //     // Prepare room data (không bao gồm images)
  //     const roomData = {
  //       ...values,
  //       amenityIds: amenityList.map(amenity => amenity.id),
  //       images: []
  //     };

  //     // Convert address format cho backend
  //     if (values.city || values.district || values.ward) {
  //       const addressData = convertAddressForBackend({
  //         city: values.city,
  //         district: values.district,
  //         ward: values.ward
  //       });
  //       roomData.city = addressData.city;
  //       roomData.district = addressData.district;
  //       roomData.ward = addressData.ward;
  //     }

  //     // Clean price data - loại bỏ dấu phẩy
  //     if (roomData.pricePerMonth) {
  //       roomData.pricePerMonth = removeCommasFromNumber(roomData.pricePerMonth);
  //     }
  //     if (roomData.areaSqm) {
  //       roomData.areaSqm = removeCommasFromNumber(roomData.areaSqm);
  //     }

  //     console.log("📤 Final room data to send:", roomData);

  //     let result;
  //     if (isEditMode) {
  //       result = await updateRoom(roomId, roomData);
  //       message.success("Cập nhật phòng trọ thành công!");
  //     } else {
  //       result = await createRoom(roomData);
  //       message.success("Tạo phòng trọ thành công!");

  //       console.log("🔍 Debug - result:", result);
  //       console.log("🔍 Debug - result.data:", result?.data);
  //       console.log("🔍 Debug - result.data.id:", result?.data?.id);
  //       console.log("🔍 Debug - result.id:", result?.id);
  //       console.log("🔍 Debug - imageList.length:", imageList.length);
  //       console.log("🔍 Debug - condition check:", imageList.length > 0 && (result?.data?.id || result?.id));

  //       // Nếu có ảnh, upload ảnh sau khi tạo phòng thành công
  //       const roomId = result?.data?.id || result?.id;
  //       if (imageList.length > 0 && roomId) {
  //         try {
  //           console.log("🖼️ Image list for upload:", imageList);
  //           console.log("🏠 Room created successfully, ID:", roomId);
  //           console.log("📊 Full result data:", result);

  //           const imageUrls = [];

  //           // Xử lý từng ảnh để lấy URL
  //           for (const img of imageList) {
  //             console.log("📸 Processing image:", img);

  //             // Nếu có URL sẵn (đã upload trước đó)
  //             if (img.url && !img.originFileObj) {
  //               imageUrls.push(img.url);
  //               continue;
  //             }

  //             // Nếu có originFileObj, cần tạo URL
  //             if (img.originFileObj) {
  //               try {
  //                 console.log("📤 Processing file:", img.originFileObj.name);

  //                 // Thử upload lên Cloudinary trước
  //                 try {
  //                   console.log("📤 Trying Cloudinary upload...");
  //                   const cloudinaryResult = await uploadToCloudinary(img.originFileObj);

  //                   if (cloudinaryResult?.secure_url) {
  //                     imageUrls.push(cloudinaryResult.secure_url);
  //                     console.log("✅ Real Cloudinary URL:", cloudinaryResult.secure_url);
  //                     continue;
  //                   }
  //                 } catch (cloudinaryError) {
  //                   console.warn("⚠️ Cloudinary upload failed:", cloudinaryError.message);
  //                 }

  //                 // Fallback: thử upload server nếu có
  //                 try {
  //                   const uploadResult = await uploadImageFileApi(img.originFileObj);
  //                   console.log("✅ Upload result:", uploadResult);

  //                   if (uploadResult?.data?.url) {
  //                     imageUrls.push(uploadResult.data.url);
  //                     continue;
  //                   } else if (uploadResult?.data?.imageUrl) {
  //                     imageUrls.push(uploadResult.data.imageUrl);
  //                     continue;
  //                   }
  //                 } catch (uploadError) {
  //                   console.warn("⚠️ Server upload failed:", uploadError.message);
  //                 }

  //                 // Fallback: tạo mock URL
  //                 const mockUrl = generateMockImageUrl(img.originFileObj);
  //                 console.log("🔗 Using mock URL:", mockUrl);
  //                 imageUrls.push(mockUrl);

  //               } catch (error) {
  //                 console.error("❌ Error processing image:", error);
  //                 message.error(`Lỗi xử lý ảnh ${img.originFileObj.name}: ${error.message}`);
  //               }
  //             }
  //           }

  //           console.log("🔗 Final image URLs:", imageUrls);

  //           if (imageUrls.length > 0) {
  //             const imageData = { imageUrl: imageUrls };
  //             console.log("📤 Sending image data to room:", imageData);
  //             console.log("🔍 Room ID to send:", roomId);
  //             console.log("🔍 Image URLs to send:", imageUrls);

  //             const imageResult = await createRoomImagesApi(roomId, imageData);
  //             console.log("🎉 Image upload result:", imageResult);
  //             message.success(`Lưu thành công ${imageUrls.length} ảnh vào database!`);
  //           } else {
  //             console.warn("⚠️ No valid image URLs found");
  //             message.warning("Không có ảnh nào được xử lý thành công.");
  //           }
  //         } catch (imageError) {
  //           console.error("❌ Upload images error:", imageError);
  //           message.warning("Phòng trọ đã tạo nhưng upload ảnh thất bại. Vui lòng thử lại sau.");
  //         }
  //       }
  //     }

  //     // Reset form
  //     form.resetFields();
  //     setImageList([]);
  //     setAmenityList([]);
  //     setSelectedCity("");
  //     setSelectedDistrict("");

  //     // Call success callback
  //     if (onSuccess) {
  //       onSuccess(result);
  //     }
  //   } catch (err) {
  //     console.error("❌ Form submission error:", err);

  //     // Show detailed error message
  //     let errorMessage = "Có lỗi xảy ra!";

  //     if (err.message) {
  //       errorMessage = err.message;
  //     } else if (err.errors && Array.isArray(err.errors)) {
  //       errorMessage = err.errors.join(", ");
  //     } else if (typeof err === 'string') {
  //       errorMessage = err;
  //     }

  //     message.error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Debug: Log form values
      console.log("📝 Form values:", values);
      console.log("🖼️ Image list:", imageList);
      console.log("🏠 Amenity list:", amenityList);
      console.log("🗺️ Selected location:", selectedLocation);

      // Prepare base room data (without images yet)
      const roomData = {
        ...values,
        amenityIds: amenityList, // ✅ Gửi full amenity objects thay vì chỉ IDs
        // Add location data if available
        ...(selectedLocation && {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        }),
        // DO NOT set images: [] here -- only attach if we have urls
      };

      // Convert address and clean numbers
      if (values.city || values.district || values.ward) {
        const addressData = convertAddressForBackend({
          city: values.city,
          district: values.district,
          ward: values.ward,
        });
        roomData.city = addressData.city;
        roomData.district = addressData.district;
        roomData.ward = addressData.ward;
      }
      if (roomData.pricePerMonth)
        roomData.pricePerMonth = removeCommasFromNumber(roomData.pricePerMonth);
      if (roomData.areaSqm)
        roomData.areaSqm = removeCommasFromNumber(roomData.areaSqm);

      // -------------------------
      // 1) UPLOAD ALL IMAGES FIRST
      // -------------------------
      const imageUrls = [];

      if (imageList && imageList.length > 0) {
        for (const img of imageList) {
          try {
            // If file already has URL (uploaded earlier), reuse it
            if (img.url && !img.originFileObj) {
              imageUrls.push(img.url);
              continue;
            }

            // If we have file object, attempt Cloudinary first
            if (img.originFileObj) {
              try {
                const cloudinaryResult = await uploadToCloudinary(
                  img.originFileObj
                );
                if (cloudinaryResult?.secure_url) {
                  imageUrls.push(cloudinaryResult.secure_url);
                  continue;
                }
              } catch (err) {
                console.warn("Cloudinary failed:", err?.message || err);
              }

              // fallback: server upload endpoint
              try {
                const uploadResult = await uploadImageFileApi(
                  img.originFileObj
                );
                // adapt to your server response shapes
                const url =
                  uploadResult?.data?.url || uploadResult?.data?.imageUrl;
                if (url) {
                  imageUrls.push(url);
                  continue;
                }
              } catch (err) {
                console.warn("Server upload failed:", err?.message || err);
              }

              // final fallback: mock
              imageUrls.push(generateMockImageUrl(img.originFileObj));
            }
          } catch (err) {
            console.error("Error processing image:", err);
          }
        } // end for
      }

      console.log("🔗 imageUrls after upload attempts:", imageUrls);

      // If we have image URLs, attach to payload so createRoom gets them in one request
      if (imageUrls.length > 0) {
        roomData.images = imageUrls;
      }

      // -------------------------
      // 2) CALL createRoom ON BACKEND (once)
      // -------------------------
      let result;
      if (isEditMode) {
        result = await updateRoom(roomId, roomData);
        message.success("Cập nhật phòng trọ thành công");
      } else {
        result = await createRoom(roomData);
        message.success("Tạo phòng trọ thành công");
      }

      // If backend returns room id and you didn't attach images in createRoom,
      // you could still call createRoomImagesApi(resultId, { imageUrl: imageUrls })
      // but since we attached image URLs in payload above, usually not necessary.

      // Reset & callback
      form.resetFields();
      setImageList([]);
      setAmenityList([]);
      setSelectedCity("");
      setSelectedDistrict("");
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error("❌ Form submission error:", err);
      // show backend message if exists
      const backendMsg = err?.response?.data?.message || err?.message;
      message.error(backendMsg || "Có lỗi xảy ra!");
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
              : "Điền thông tin chi tiết để đăng phòng trọ"}
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: ROOM_STATUS.AVAILABLE,
            roomType: ROOM_TYPE.PHONG_TRO, // Default là PHONG_TRO thay vì APARTMENT
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
                      message: `Tiêu đề phải có ít nhất ${ROOM_VALIDATION.TITLE.MIN_LENGTH} ký tự`,
                    },
                    {
                      max: ROOM_VALIDATION.TITLE.MAX_LENGTH,
                      message: `Tiêu đề không được quá ${ROOM_VALIDATION.TITLE.MAX_LENGTH} ký tự`,
                    },
                  ]}
                >
                  <Input placeholder="VD: Phòng trọ đẹp gần trường đại học" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="roomType"
                  label="Loại phòng"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại phòng" },
                  ]}
                >
                  <Select placeholder="Chọn loại phòng">
                    {Object.entries(ROOM_TYPE_LABELS).map(([key, label]) => (
                      <Option key={key} value={key}>
                        {label}
                      </Option>
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
                      message: `Mô tả không được quá ${ROOM_VALIDATION.DESCRIPTION.MAX_LENGTH} ký tự`,
                    },
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
                  rules={[
                    { required: true, message: "Vui lòng chọn thành phố" },
                  ]}
                >
                  <Select
                    placeholder="Chọn thành phố"
                    onChange={handleCityChange}
                    value={selectedCity}
                  >
                    {VIETNAM_CITIES.map((city) => (
                      <Option key={city} value={city}>
                        {city}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[
                    { required: true, message: "Vui lòng chọn quận/huyện" },
                  ]}
                >
                  <Select
                    placeholder="Chọn quận/huyện"
                    value={selectedDistrict}
                    onChange={setSelectedDistrict}
                    disabled={!selectedCity}
                  >
                    {getDistricts().map((district) => (
                      <Option key={district} value={district}>
                        {district}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[
                    { required: true, message: "Vui lòng nhập phường/xã" },
                  ]}
                >
                  <Input placeholder="VD: Phường 1" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="streetAddress"
                  label="Địa chỉ chi tiết"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ chi tiết",
                    },
                    {
                      max: ROOM_VALIDATION.ADDRESS.MAX_LENGTH,
                      message: `Địa chỉ không được quá ${ROOM_VALIDATION.ADDRESS.MAX_LENGTH} ký tự`,
                    },
                  ]}
                >
                  <Space.Compact style={{ width: "100%" }}>
                    <Input 
                      placeholder="VD: 123 Đường ABC, Phường 1, Quận 1"
                      readOnly={selectedLocation}
                      value={selectedLocation ? selectedLocation.address : undefined}
                    />
                    <Button 
                      type="primary" 
                      icon={<EnvironmentOutlined />}
                      onClick={() => setShowMap(!showMap)}
                    >
                      {showMap ? "Ẩn bản đồ" : "Chọn trên bản đồ"}
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </Col>

              {/* Map Selector */}
              {showMap && (
                <Col xs={24}>
                  <GoongMapSelector
                    onLocationSelect={handleLocationSelect}
                    initialPosition={selectedLocation ? [selectedLocation.latitude, selectedLocation.longitude] : [10.8231, 106.6297]}
                    initialAddress={selectedLocation ? selectedLocation.address : ""}
                    height="350px"
                  />
                </Col>
              )}

              {/* <Col xs={24} md={12}>
                <Form.Item name="latitude" label="Vĩ độ (Latitude)">
                  <Input
                    placeholder="VD: 10.762622"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="longitude" label="Kinh độ (Longitude)">
                  <Input
                    placeholder="VD: 106.660172"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col> */}
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
                        if (!value)
                          return Promise.reject("Vui lòng nhập giá thuê");
                        if (!isValidPrice(value))
                          return Promise.reject("Giá thuê phải là số hợp lệ");
                        return Promise.resolve();
                      },
                    },
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
                        if (!isValidArea(value))
                          return Promise.reject("Diện tích phải là số hợp lệ");
                        return Promise.resolve();
                      },
                    },
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
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái" },
                  ]}
                >
                  <Select placeholder="Chọn trạng thái">
                    {Object.entries(ROOM_STATUS_LABELS).map(([key, label]) => (
                      <Option key={key} value={key}>
                        {label}
                      </Option>
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
            <AmenitySelector
              selectedAmenities={amenityList}
              onSelectionChange={setAmenityList}
              roomId={roomId}
              showCreateForm={false}
              maxSelection={20}
            />
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
