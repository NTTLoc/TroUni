import React, { useState } from 'react';
import { Button, Input, Form, Card, Alert, Divider, Space, Typography } from 'antd';
import { BugOutlined, StopOutlined } from '@ant-design/icons';
import paymentApi from '../../services/paymentApi';

const { Title, Text } = Typography;

const PaymentCancelDebugTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [form] = Form.useForm();

  const testCancelPayment = async (values) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing PayOS cancel payment with values:', values);
      
      const response = await paymentApi.handlePayOSCancel(
        values.orderCode,
        values.status
      );

      setResult({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ PayOS cancel test successful:', response);
    } catch (err) {
      console.error('❌ PayOS cancel test failed:', err);
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
      orderCode: '1761066858',
      status: 'CANCELLED'
    };
    
    form.setFieldsValue(testData);
    testCancelPayment(testData);
  };

  const testWithRealParams = () => {
    // Test với tham số thực từ URL
    const testData = {
      orderCode: '1761066858',
      status: 'CANCELLED'
    };
    
    form.setFieldsValue(testData);
    testCancelPayment(testData);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>
          <StopOutlined /> PayOS Cancel Debug Test
        </Title>
        
        <Alert
          message="Debug PayOS Cancel Payment API"
          description="Test PayOS payment cancellation để debug lỗi status không cập nhật"
          type="warning"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={testCancelPayment}
          initialValues={{
            orderCode: '1761066858',
            status: 'CANCELLED'
          }}
        >
          <Form.Item
            name="orderCode"
            label="Order Code"
            rules={[{ required: true, message: 'Order code is required' }]}
          >
            <Input placeholder="1761066858" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Status is required' }]}
          >
            <Input placeholder="CANCELLED" />
          </Form.Item>

          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<StopOutlined />}
            >
              Test Cancel Payment
            </Button>
            
            <Button 
              onClick={quickTest}
              loading={loading}
            >
              Quick Test (Real Order Code)
            </Button>

            <Button 
              onClick={testWithRealParams}
              loading={loading}
            >
              Test With Real Params
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
            <p><strong>URL Params:</strong> {window.location.search}</p>
            <p><strong>Origin:</strong> {window.location.origin}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default PaymentCancelDebugTest;
