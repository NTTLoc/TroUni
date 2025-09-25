import React, { useState } from "react";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function SearchFilter() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    district: "",
    amenities: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((item) => item !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    navigate(`/properties?${queryParams.toString()}`);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Property Type</Form.Label>
                <Form.Select
                  name="type"
                  value={filters.type}
                  onChange={handleChange}
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="room">Room</option>
                  <option value="studio">Studio</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Price Range</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Control
                  type="text"
                  name="district"
                  placeholder="Enter district"
                  value={filters.district}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Amenities</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {[
                  "wifi",
                  "parking",
                  "aircon",
                  "furnished",
                  "pets",
                  "gym",
                  "pool",
                ].map((amenity) => (
                  <Form.Check
                    key={amenity}
                    type="checkbox"
                    id={amenity}
                    label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    value={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                  />
                ))}
              </div>
            </Col>
          </Row>

          <div className="text-center">
            <Button variant="primary" type="submit" size="lg">
              Search Properties
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default SearchFilter;
