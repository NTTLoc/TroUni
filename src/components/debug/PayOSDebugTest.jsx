import React, { useState } from 'react';
import { Button, Input, Form, Card, Alert, Divider, Space, Typography } from 'antd';
import { PlayCircleOutlined, BugOutlined } from '@ant-design/icons';
import paymentApi from '../../services/paymentApi';

const { Title, Text } = Typography;

const PayOSDebugTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [form] = Form.useForm();

  const testPayOSPayment = async (values) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing PayOS payment with values:', values);
      
      const response = await paymentApi.createPayOSPayment({
        amount: parseInt(values.amount),
        description: values.description,
        returnUrl: values.returnUrl,
        cancelUrl: values.cancelUrl,
        roomId: values.roomId || null
      });

       setResult({
         success: true,
         data: response,
         timestamp: new Date().toISOString()
       });
       
       console.log('✅ PayOS test successful:', response);
       
       // Nếu có checkoutUrl, redirect tới PayOS
       if (response.checkoutUrl) {
         console.log('🔄 Redirecting to PayOS checkout:', response.checkoutUrl);
         window.open(response.checkoutUrl, '_blank');
       }
    } catch (err) {
      console.error('❌ PayOS test failed:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

   const quickTest = () => {
     const testData = {
       amount: 3000,
       description: 'Test PayOS payment', // Max 25 chars
       returnUrl: 'http://localhost:5173/payment-success',
       cancelUrl: 'http://localhost:5173/payment-cancel',
       roomId: '4b52ed7d-cd55-4955-9ade-317d8585c5b0'
     };
     
     form.setFieldsValue(testData);
     testPayOSPayment(testData);
   };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>
          <BugOutlined /> PayOS API Debug Test
        </Title>
        
        <Alert
          message="Debug PayOS Payment API"
          description="Test PayOS payment creation với các tham số khác nhau để debug lỗi 402"
          type="info"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={testPayOSPayment}
           initialValues={{
             amount: 3000,
             description: 'Test PayOS payment', // Max 25 chars
             returnUrl: 'http://localhost:5173/payment-success',
             cancelUrl: 'http://localhost:5173/payment-cancel',
             roomId: '4b52ed7d-cd55-4955-9ade-317d8585c5b0'
           }}
        >
          <Form.Item
            name="amount"
            label="Amount (VND)"
            rules={[
              { required: true, message: 'Amount is required' },
              { type: 'number', min: 1000, message: 'Amount must be >= 1000 VND' }
            ]}
          >
             <Input type="number" placeholder="3000" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description (Max 25 characters)"
            rules={[
              { required: true, message: 'Description is required' },
              { max: 25, message: 'Description must be max 25 characters' }
            ]}
          >
            <Input.TextArea 
              placeholder="Test PayOS payment description"
              rows={2}
              maxLength={25}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="returnUrl"
            label="Return URL"
            rules={[{ required: true, message: 'Return URL is required' }]}
          >
            <Input placeholder="http://localhost:5173/payment-success" />
          </Form.Item>

          <Form.Item
            name="cancelUrl"
            label="Cancel URL"
            rules={[{ required: true, message: 'Cancel URL is required' }]}
          >
            <Input placeholder="http://localhost:5173/payment-cancel" />
          </Form.Item>

          <Form.Item
            name="roomId"
            label="Room ID (Optional)"
          >
            <Input placeholder="4b52ed7d-cd55-4955-9ade-317d8585c5b0" />
          </Form.Item>

          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<PlayCircleOutlined />}
            >
              Test PayOS Payment
            </Button>
            
             <Button 
               onClick={quickTest}
               loading={loading}
             >
               Quick Test (3k VND)
             </Button>
          </Space>
        </Form>

        <Divider />

        {/* Error Display */}
        {error && (
          <Alert
            message="❌ Error"
            description={
              <div>
                <p><strong>Status:</strong> {error.status}</p>
                <p><strong>Message:</strong> {error.message}</p>
                {error.data && (
                  <div>
                    <p><strong>Response Data:</strong></p>
                    <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                      {JSON.stringify(error.data, null, 2)}
                    </pre>
                  </div>
                )}
                <p><strong>Timestamp:</strong> {error.timestamp}</p>
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

         {/* Success Display */}
         {result && (
           <Alert
             message="✅ Success"
             description={
               <div>
                 <p><strong>Response:</strong></p>
                 <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                   {JSON.stringify(result.data, null, 2)}
                 </pre>
                 <p><strong>Timestamp:</strong> {result.timestamp}</p>
                 
                 {/* PayOS Checkout Button */}
                 {result.data.checkoutUrl && (
                   <div style={{ marginTop: '16px' }}>
                     <Button 
                       type="primary" 
                       size="large"
                       onClick={() => window.open(result.data.checkoutUrl, '_blank')}
                       style={{ backgroundColor: '#00C851', borderColor: '#00C851' }}
                     >
                       🚀 Mở PayOS Checkout
                     </Button>
                     <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                       Click để mở trang thanh toán PayOS trong tab mới
                     </p>
                   </div>
                 )}
               </div>
             }
             type="success"
             showIcon
             style={{ marginBottom: '20px' }}
           />
         )}

        {/* Debug Info */}
        <Card title="🔍 Debug Information" size="small">
          <div style={{ fontSize: '12px', color: '#666' }}>
            <p><strong>Current URL:</strong> {window.location.href}</p>
            <p><strong>Origin:</strong> {window.location.origin}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default PayOSDebugTest;
