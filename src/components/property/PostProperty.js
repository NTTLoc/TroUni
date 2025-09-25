import React, { useState } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function PostProperty() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({
    lat: 10.762622,
    lng: 106.660172,
  });

  const [formData, setFormData] = useState({
    title: "",
    type: "phong-tro",
    price: "",
    area: "",
    address: "",
    district: "",
    city: "TP.HCM",
    description: "",
    amenities: [],
    contactPhone: "",
    contactName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((item) => item !== value),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleMapClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      // Upload images
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(
            storage,
            `properties/${Date.now()}_${image.name}`
          );
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      // Add property to Firestore
      const propertyData = {
        ...formData,
        images: imageUrls,
        location,
        ownerId: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      await addDoc(collection(db, "properties"), propertyData);

      toast.success("Đăng tin thành công!");
      navigate("/my-properties");
    } catch (error) {
      setError("Đăng tin thất bại: " + error.message);
      toast.error("Đăng tin thất bại!");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Đăng tin cho thuê</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Loại phòng</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="phong-tro">Phòng trọ</option>
                <option value="ky-tuc-xa">Ký túc xá</option>
                <option value="nha-nguyen-can">Nhà nguyên căn</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá thuê (VNĐ/tháng)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Diện tích (m²)</Form.Label>
                  <Form.Control
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quận/Huyện</Form.Label>
                  <Form.Control
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thành phố</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tiện nghi</Form.Label>
              <div className="row">
                {[
                  "Điều hòa",
                  "Nóng lạnh",
                  "Wifi",
                  "Tủ lạnh",
                  "Máy giặt",
                  "Bảo vệ 24/7",
                  "Thang máy",
                  "Chỗ để xe",
                ].map((amenity) => (
                  <Col key={amenity} md={3}>
                    <Form.Check
                      type="checkbox"
                      label={amenity}
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={handleAmenityChange}
                    />
                  </Col>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vị trí trên bản đồ</Form.Label>
              <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px" }}
                  center={location}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  <Marker position={location} />
                </GoogleMap>
              </LoadScript>
            </Form.Group>

            <h4 className="mt-4 mb-3">Thông tin liên hệ</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên người liên hệ</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              disabled={loading}
              className="w-100 mt-4"
              type="submit"
              variant="primary"
            >
              {loading ? "Đang đăng tin..." : "Đăng tin"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PostProperty;
