import React, { useState, useEffect } from "react";
import { Card, Form, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

const MOCK_REVIEWS_BY_PROPERTY = {
  1: [
    {
      id: "r1",
      userName: "Nguyễn Văn A",
      rating: 5,
      comment: "Phòng đẹp, chủ thân thiện, gần trường!",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r2",
      userName: "Trần Thị B",
      rating: 4,
      comment: "Tiện nghi đầy đủ, an ninh tốt.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r3",
      userName: "Lê Văn C",
      rating: 5,
      comment: "Vị trí thuận tiện, giá cả hợp lý với sinh viên.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  2: [
    {
      id: "r4",
      userName: "Phạm Thị D",
      rating: 4,
      comment: "Ký túc xá sạch sẽ, an ninh tốt.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r5",
      userName: "Hoàng Văn E",
      rating: 5,
      comment: "Môi trường học tập tốt, bạn bè thân thiện.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r6",
      userName: "Vũ Thị F",
      rating: 4,
      comment: "Wifi ổn định, phòng rộng rãi.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  3: [
    {
      id: "r7",
      userName: "Đỗ Văn G",
      rating: 5,
      comment: "Nhà rộng rãi, nội thất đẹp và mới.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r8",
      userName: "Bùi Thị H",
      rating: 5,
      comment: "Khu vực yên tĩnh, an ninh tốt.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  4: [
    {
      id: "r9",
      userName: "Trịnh Văn I",
      rating: 5,
      comment: "View đẹp, thang máy nhanh.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r10",
      userName: "Lý Thị K",
      rating: 4,
      comment: "Căn hộ đẹp, đầy đủ tiện nghi.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r11",
      userName: "Mai Văn L",
      rating: 5,
      comment: "Vị trí thuận tiện, gần trung tâm.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  5: [
    {
      id: "r12",
      userName: "Đinh Thị M",
      rating: 3,
      comment: "Giá rẻ phù hợp sinh viên, nhưng hơi xa trung tâm.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r13",
      userName: "Ngô Văn N",
      rating: 4,
      comment: "Chủ nhà dễ tính, wifi ổn định.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  6: [
    {
      id: "r14",
      userName: "Phan Thị O",
      rating: 5,
      comment: "Căn hộ đẹp, thiết kế hiện đại.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r15",
      userName: "Vũ Văn P",
      rating: 4,
      comment: "An ninh tốt, bảo vệ nhiệt tình.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r16",
      userName: "Lê Thị Q",
      rating: 5,
      comment: "Vị trí đắc địa, gần trường đại học.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  7: [
    {
      id: "r17",
      userName: "Trần Văn R",
      rating: 5,
      comment: "Gần biển, không khí trong lành.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r18",
      userName: "Bùi Thị S",
      rating: 4,
      comment: "Phòng thoáng mát, giá hợp lý.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  8: [
    {
      id: "r19",
      userName: "Đỗ Văn T",
      rating: 5,
      comment: "Nhà rộng rãi, sân vườn đẹp.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r20",
      userName: "Lý Thị U",
      rating: 5,
      comment: "Vị trí trung tâm, tiện nghi đầy đủ.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r21",
      userName: "Mai Văn V",
      rating: 4,
      comment: "Phù hợp cho gia đình lớn.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  9: [
    {
      id: "r22",
      userName: "Trịnh Thị X",
      rating: 5,
      comment: "View biển tuyệt đẹp, tiện nghi cao cấp.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r23",
      userName: "Bùi Văn Y",
      rating: 5,
      comment: "Hồ bơi và gym rất tốt.",
      createdAt: { toDate: () => new Date() },
    },
  ],
  10: [
    {
      id: "r24",
      userName: "Phan Thị Z",
      rating: 4,
      comment: "Phòng đẹp, đầy đủ tiện nghi.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r25",
      userName: "Vũ Văn AA",
      rating: 5,
      comment: "Vị trí thuận tiện, chủ nhà nhiệt tình.",
      createdAt: { toDate: () => new Date() },
    },
    {
      id: "r26",
      userName: "Đinh Thị BB",
      rating: 4,
      comment: "Giá cả hợp lý với vị trí.",
      createdAt: { toDate: () => new Date() },
    },
  ],
};

function Reviews({ propertyId }) {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // where("propertyId", "==", propertyId),
    //   orderBy("createdAt", "desc")
    // );

    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   let newReviews = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   // Nếu không có review thật, dùng mock review riêng cho từng propertyId
    //   if (newReviews.length === 0) {
    //     newReviews = MOCK_REVIEWS_BY_PROPERTY[propertyId] || [];
    //   }
    //   setReviews(newReviews);
    // });

    // return () => unsubscribe();
    setReviews(MOCK_REVIEWS_BY_PROPERTY[propertyId] || []);
  }, [propertyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "reviews"), {
        propertyId,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp(),
      });

      setNewReview({ rating: 5, comment: "" });
      toast.success("Đánh giá thành công!");
    } catch (error) {
      toast.error("Đánh giá thất bại!");
    }
    setLoading(false);
  };

  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  return (
    <Card className="mt-4">
      <Card.Header>
        <h4>Đánh giá và bình luận</h4>
        <div className="d-flex align-items-center">
          <div className="me-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                color={
                  index < Math.round(averageRating) ? "#ffc107" : "#e4e5e9"
                }
              />
            ))}
          </div>
          <span className="ms-2">
            {averageRating} ({reviews.length} đánh giá)
          </span>
        </div>
      </Card.Header>
      <Card.Body>
        {currentUser && (
          <Form onSubmit={handleSubmit} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Đánh giá của bạn</Form.Label>
              <div className="d-flex align-items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <FaStar
                    key={rating}
                    className="me-1"
                    style={{ cursor: "pointer" }}
                    color={rating <= newReview.rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating }))
                    }
                  />
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bình luận</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </Form>
        )}

        <ListGroup>
          {reviews.map((review) => (
            <ListGroup.Item key={review.id}>
              <Row>
                <Col md={8}>
                  <h6>{review.userName}</h6>
                  <div className="d-flex align-items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        color={index < review.rating ? "#ffc107" : "#e4e5e9"}
                      />
                    ))}
                  </div>
                  <p className="mb-1">{review.comment}</p>
                  <small className="text-muted">
                    {review.createdAt?.toDate().toLocaleString()}
                  </small>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default Reviews;
