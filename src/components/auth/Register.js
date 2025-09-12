import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "tenant", // 'tenant' or 'owner'
    province: "",
    district: "",
    ward: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  // Fetch provinces on mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province) {
      fetch(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`)
        .then((res) => res.json())
        .then((data) => setDistricts(data.districts || []));
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));
      setWards([]);
    }
  }, [formData.province]);

  // Fetch wards when district changes
  useEffect(() => {
    if (formData.district) {
      fetch(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
        .then((res) => res.json())
        .then((data) => setWards(data.wards || []));
      setFormData((prev) => ({ ...prev, ward: "" }));
    }
  }, [formData.district]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.province || !formData.district || !formData.ward) {
      setError("Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã");
      return;
    }
    try {
      setError("");
      setLoading(true);

      const provinceObj = provinces.find(
        (p) => String(p.code) === String(formData.province)
      );
      const districtObj = districts.find(
        (d) => String(d.code) === String(formData.district)
      );
      const wardObj = wards.find(
        (w) => String(w.code) === String(formData.ward)
      );

      console.log("formData:", formData);
      console.log("provinceObj:", provinceObj);
      console.log("districtObj:", districtObj);
      console.log("wardObj:", wardObj);

      // Create user account
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile
      await updateProfile(user, {
        displayName: formData.name,
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        province: provinceObj?.name || "",
        district: districtObj?.name || "",
        ward: wardObj?.name || "",
        createdAt: new Date().toISOString(),
      });

      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (error) {
      setError("Đăng ký thất bại: " + error.message);
      toast.error("Đăng ký thất bại!");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center position-relative"
        style={{
          minHeight: "40vh",
          background: "linear-gradient(120deg, #60efff 0%, #00ff87 100%)",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.45)",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        ></div>
        <div className="container" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-md-7 text-center">
              <h1 className="display-4 fw-bold mb-3">Đăng ký tài khoản</h1>
              <p className="lead mb-4">
                Tham gia Trọ UNI để trải nghiệm dịch vụ tìm phòng trọ hiện đại,
                an toàn, tiện lợi và đăng tin miễn phí!
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body>
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus fs-1 text-primary"></i>
                </div>
                <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Bạn là</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="tenant">Người thuê trọ</option>
                      <option value="owner">Chủ trọ</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Tỉnh/Thành phố</Form.Label>
                    <Form.Select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Quận/Huyện</Form.Label>
                    <Form.Select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      disabled={!formData.province}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phường/Xã</Form.Label>
                    <Form.Select
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      required
                      disabled={!formData.district}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    disabled={
                      loading ||
                      !formData.province ||
                      !formData.district ||
                      !formData.ward
                    }
                    className="w-100"
                    type="submit"
                    variant="primary"
                    size="lg"
                  >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
