import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesRef = collection(db, "properties");
        const q = query(propertiesRef, where("ownerId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const propertiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProperties(propertiesList);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProperties();
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Properties</h2>
        <Link to="/post-property">
          <Button variant="primary">Post New Property</Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center">
          <p>You haven't posted any properties yet.</p>
          <Link to="/post-property">
            <Button variant="primary">Post Your First Property</Button>
          </Link>
        </div>
      ) : (
        <Row>
          {properties.map((property) => (
            <Col key={property.id} md={4} className="mb-4">
              <Card>
                {property.images && property.images.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={property.images[0]}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{property.title}</Card.Title>
                  <Card.Text>
                    <strong>Price:</strong> ${property.price}/month
                    <br />
                    <strong>Type:</strong> {property.type}
                    <br />
                    <strong>Location:</strong> {property.address},{" "}
                    {property.district}, {property.city}
                  </Card.Text>
                  <Link to={`/property/${property.id}`}>
                    <Button variant="primary" className="me-2">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/edit-property/${property.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default MyProperties;
