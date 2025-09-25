import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

// Replace with your Stripe publishable key
const stripePromise = loadStripe("your_publishable_key");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

function PaymentForm({ property, amount }) {
  const { currentUser } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thanh toán!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Create payment intent
      const response = await fetch(
        "http://localhost:5000/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency: "vnd",
          }),
        }
      );

      const { clientSecret } = await response.json();

      if (!stripe || !elements) {
        throw new Error("Stripe not initialized");
      }

      // Confirm the payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: currentUser.displayName || "Guest",
              email: currentUser.email,
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Record the payment in Firestore
      await addDoc(collection(db, "payments"), {
        userId: currentUser.uid,
        propertyId: property.id,
        amount,
        paymentMethod,
        status: paymentIntent.status,
        createdAt: serverTimestamp(),
      });

      toast.success("Thanh toán thành công!");
    } catch (error) {
      setError("Thanh toán thất bại: " + error.message);
      toast.error("Thanh toán thất bại!");
    }
    setLoading(false);
  };

  return (
    <Card>
      <Card.Header>
        <h4>Thanh toán</h4>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="mb-4">
          <h5>Thông tin thanh toán</h5>
          <p>Số tiền: {amount.toLocaleString("vi-VN")} VNĐ</p>
          <p>Phòng: {property.title}</p>
        </div>

        <Form onSubmit={handlePayment}>
          <Form.Group className="mb-3">
            <Form.Label>Phương thức thanh toán</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="card">Thẻ tín dụng/ghi nợ</option>
              <option value="momo">Ví MoMo</option>
              <option value="zalopay">Ví ZaloPay</option>
              <option value="bank">Chuyển khoản ngân hàng</option>
            </Form.Select>
          </Form.Group>

          {paymentMethod === "card" && (
            <div className="mb-3">
              <Form.Label>Thông tin thẻ</Form.Label>
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="mb-3">
              <Form.Label>Thông tin chuyển khoản</Form.Label>
              <p>Ngân hàng: Vietcombank</p>
              <p>Số tài khoản: 1234567890</p>
              <p>Chủ tài khoản: Công ty TNHH Rental Housing</p>
              <p>Nội dung chuyển khoản: [Mã phòng]_[Tên người thuê]</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading || !stripe}
          >
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

function Payment(props) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}

export default Payment;
