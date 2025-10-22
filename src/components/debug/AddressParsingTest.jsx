/**
 * Address Parsing Test Component
 * Component để test việc parse địa chỉ với các viết tắt khác nhau
 */

import React, { useState } from 'react';
import { Card, Button, Input, Space, Alert, Typography, List, Divider } from 'antd';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { goongApi } from '../../services/goongApi';

const { Title, Text, Paragraph } = Typography;

const AddressParsingTest = () => {
  const [testAddress, setTestAddress] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testAddresses = [
    '15 P. Hàng Gai, Hàng Trống, Hoàn Kiếm, Hà Nội',
    '123 Đường Nguyễn Huệ, P. Bến Nghé, Q. 1, TP.HCM',
    '456 Lê Lợi, Phường 1, Quận 3, Thành phố Hồ Chí Minh',
    '789 Trần Hưng Đạo, P. 14, Q. 5, TP.HCM',
    '321 Hoàng Hoa Thám, Phường 12, Quận Tân Bình, TP.HCM'
  ];

  const testAddressParsing = async (address) => {
    setLoading(true);
    setTestAddress(address);
    
    try {
      // Test với tọa độ TP.HCM
      const testLat = 10.8231;
      const testLng = 106.6297;
      
      // Mock reverse geocoding với địa chỉ test
      const mockResult = {
        display_name: address,
        address: {
          city: 'Thành phố Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          street: 'Đường Nguyễn Huệ',
          country: 'Việt Nam'
        },
        raw_data: {
          formatted_address: address
        }
      };

      // Test normalize function
      const normalizedAddress = goongApi.normalizeAddress(address);
      
      // Test parse function
      const parsedAddress = goongApi.parseFromFormattedAddress(address, 'ward');
      const parsedDistrict = goongApi.parseFromFormattedAddress(address, 'district');
      const parsedCity = goongApi.parseFromFormattedAddress(address, 'city');

      setResults([
        {
          test: 'Normalize Address',
          input: address,
          output: normalizedAddress,
          status: normalizedAddress !== address ? 'PASS' : 'INFO'
        },
        {
          test: 'Parse Ward',
          input: address,
          output: parsedAddress,
          status: parsedAddress ? 'PASS' : 'FAIL'
        },
        {
          test: 'Parse District',
          input: address,
          output: parsedDistrict,
          status: parsedDistrict ? 'PASS' : 'FAIL'
        },
        {
          test: 'Parse City',
          input: address,
          output: parsedCity,
          status: parsedCity ? 'PASS' : 'FAIL'
        }
      ]);

    } catch (error) {
      setResults([{
        test: 'Error',
        input: address,
        output: error.message,
        status: 'FAIL'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    const allResults = [];
    
    for (const address of testAddresses) {
      try {
        const normalizedAddress = goongApi.normalizeAddress(address);
        const parsedWard = goongApi.parseFromFormattedAddress(address, 'ward');
        const parsedDistrict = goongApi.parseFromFormattedAddress(address, 'district');
        const parsedCity = goongApi.parseFromFormattedAddress(address, 'city');
        
        allResults.push({
          address,
          normalized: normalizedAddress,
          ward: parsedWard,
          district: parsedDistrict,
          city: parsedCity,
          status: parsedWard && parsedDistrict && parsedCity ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        allResults.push({
          address,
          error: error.message,
          status: 'FAIL'
        });
      }
    }
    
    setResults(allResults);
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>🧪 Address Parsing Test</Title>
      
      <Paragraph>
        Component này để test việc parse địa chỉ với các viết tắt khác nhau như "P.", "Q.", "TP.".
      </Paragraph>

      <Card title="🔍 Test Address Parsing" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Test Address:</Text>
            <Input
              value={testAddress}
              onChange={(e) => setTestAddress(e.target.value)}
              placeholder="Nhập địa chỉ để test (VD: 15 P. Hàng Gai, Hàng Trống, Hoàn Kiếm, Hà Nội)"
              style={{ marginTop: '8px' }}
            />
          </div>
          
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={() => testAddressParsing(testAddress)}
            loading={loading}
            disabled={!testAddress}
          >
            Test Parse
          </Button>

          <Button 
            icon={<CheckOutlined />}
            onClick={runAllTests}
            loading={loading}
          >
            Run All Tests
          </Button>
        </Space>
      </Card>

      <Card title="📋 Test Addresses" style={{ marginBottom: '20px' }}>
        <List
          dataSource={testAddresses}
          renderItem={(address, index) => (
            <List.Item>
              <Space>
                <Text strong>{index + 1}.</Text>
                <Text code>{address}</Text>
                <Button 
                  size="small" 
                  onClick={() => testAddressParsing(address)}
                  loading={loading}
                >
                  Test
                </Button>
              </Space>
            </List.Item>
          )}
        />
      </Card>

      {results.length > 0 && (
        <Card title="📊 Test Results">
          {Array.isArray(results[0]) ? (
            // All tests results
            <div>
              {results.map((result, index) => (
                <Card key={index} size="small" style={{ marginBottom: '16px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Address {index + 1}:</Text> <Text code>{result.address}</Text>
                    </div>
                    
                    {result.error ? (
                      <Alert message="Error" description={result.error} type="error" showIcon />
                    ) : (
                      <div>
                        <div><Text strong>Normalized:</Text> {result.normalized}</div>
                        <div><Text strong>Ward:</Text> {result.ward || 'N/A'}</div>
                        <div><Text strong>District:</Text> {result.district || 'N/A'}</div>
                        <div><Text strong>City:</Text> {result.city || 'N/A'}</div>
                        <div>
                          <Text strong>Status:</Text> 
                          <Alert 
                            message={result.status} 
                            type={result.status === 'PASS' ? 'success' : 'error'}
                            showIcon
                            style={{ marginTop: '8px' }}
                          />
                        </div>
                      </div>
                    )}
                  </Space>
                </Card>
              ))}
            </div>
          ) : (
            // Single test results
            <div>
              {results.map((result, index) => (
                <Alert
                  key={index}
                  message={result.test}
                  description={
                    <div>
                      <div><strong>Input:</strong> {result.input}</div>
                      <div><strong>Output:</strong> {result.output}</div>
                    </div>
                  }
                  type={result.status === 'PASS' ? 'success' : result.status === 'FAIL' ? 'error' : 'info'}
                  showIcon
                  style={{ marginBottom: '8px' }}
                />
              ))}
            </div>
          )}
        </Card>
      )}

      <Card title="📝 Expected Results" style={{ marginTop: '20px' }}>
        <Space direction="vertical">
          <Text>✅ <strong>P. → Phường:</strong> "P. Hàng Gai" → "Phường Hàng Gai"</Text>
          <Text>✅ <strong>Q. → Quận:</strong> "Q. 1" → "Quận 1"</Text>
          <Text>✅ <strong>TP. → Thành phố:</strong> "TP.HCM" → "Thành phố Hồ Chí Minh"</Text>
          <Text>✅ <strong>Parse Ward:</strong> Extract phường/xã correctly</Text>
          <Text>✅ <strong>Parse District:</strong> Extract quận/huyện correctly</Text>
          <Text>✅ <strong>Parse City:</strong> Extract thành phố correctly</Text>
        </Space>
      </Card>
    </div>
  );
};

export default AddressParsingTest;


