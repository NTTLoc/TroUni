/**
 * Goong Maps Integration Test Component
 * Component để test và kiểm tra hoạt động của Goong Maps API
 */

import React, { useState } from 'react';
import { Card, Button, Input, Space, Alert, Typography, List, Spin, Divider } from 'antd';
import { SearchOutlined, EnvironmentOutlined, ReloadOutlined } from '@ant-design/icons';
import { goongApi } from '../../services/goongApi';
import { reverseGeocode, forwardGeocode } from '../../utils/addressParser';
import { smartSearch } from '../../utils/alternativeMapApis';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const GoongMapsTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [testType, setTestType] = useState('');

  // Test search places
  const testSearchPlaces = async (query) => {
    setLoading(true);
    setError(null);
    setTestType('Search Places');
    
    try {
      const searchResults = await goongApi.searchPlaces(query, { limit: 5 });
      setResults(searchResults);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Test search with detail
  const testSearchWithDetail = async (query) => {
    setLoading(true);
    setError(null);
    setTestType('Search with Detail');
    
    try {
      const results = await goongApi.searchPlacesWithDetail(query, { limit: 3 });
      setResults(results);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Test reverse geocoding
  const testReverseGeocode = async () => {
    setLoading(true);
    setError(null);
    setTestType('Reverse Geocoding');
    
    try {
      // Test với tọa độ TP.HCM
      const result = await reverseGeocode(10.8231, 106.6297);
      setResults([result]);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Test forward geocoding
  const testForwardGeocode = async (query) => {
    setLoading(true);
    setError(null);
    setTestType('Forward Geocoding');
    
    try {
      const result = await forwardGeocode(query);
      setResults([result]);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Test smart search
  const testSmartSearch = async (query) => {
    setLoading(true);
    setError(null);
    setTestType('Smart Search');
    
    try {
      const results = await smartSearch(query);
      setResults(results);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>🗺️ Goong Maps Integration Test</Title>
      
      <Paragraph>
        Component này để test và kiểm tra hoạt động của Goong Maps API integration.
        Sử dụng API Key: <Text code>bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE</Text>
      </Paragraph>

      {/* Test Controls */}
      <Card title="🧪 Test Controls" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Search Places Test:</Text>
            <Search
              placeholder="Nhập địa điểm để tìm kiếm (VD: Quận 1, TP.HCM)"
              onSearch={testSearchPlaces}
              enterButton={<SearchOutlined />}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>Search with Detail Test:</Text>
            <Search
              placeholder="Nhập địa điểm để tìm kiếm chi tiết"
              onSearch={testSearchWithDetail}
              enterButton={<SearchOutlined />}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>Forward Geocoding Test:</Text>
            <Search
              placeholder="Nhập địa chỉ để lấy tọa độ"
              onSearch={testForwardGeocode}
              enterButton={<SearchOutlined />}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div>
            <Text strong>Smart Search Test:</Text>
            <Search
              placeholder="Nhập từ khóa để test smart search"
              onSearch={testSmartSearch}
              enterButton={<SearchOutlined />}
              style={{ marginTop: '8px' }}
            />
          </div>

          <Button 
            type="primary" 
            icon={<EnvironmentOutlined />}
            onClick={testReverseGeocode}
            style={{ marginTop: '8px' }}
          >
            Test Reverse Geocoding (TP.HCM)
          </Button>
        </Space>
      </Card>

      {/* Results */}
      <Card title={`📊 Test Results - ${testType}`}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '10px' }}>
              <Text>Đang test {testType}...</Text>
            </div>
          </div>
        )}

        {error && (
          <Alert
            message="❌ Test Failed"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {!loading && results.length > 0 && (
          <div>
            <Text strong>✅ Test thành công! Tìm thấy {results.length} kết quả:</Text>
            <List
              dataSource={results}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Card size="small" style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>📍 {item.display_name || item.name || 'N/A'}</Text>
                      </div>
                      
                      {item.lat && item.lng && (
                        <div>
                          <Text type="secondary">
                            Tọa độ: {item.lat.toFixed(6)}, {item.lng.toFixed(6)}
                          </Text>
                        </div>
                      )}

                      {item.address && (
                        <div>
                          <Text type="secondary">
                            Địa chỉ: {JSON.stringify(item.address, null, 2)}
                          </Text>
                        </div>
                      )}

                      {item.place_id && (
                        <div>
                          <Text type="secondary">
                            Place ID: {item.place_id}
                          </Text>
                        </div>
                      )}

                      {item.types && (
                        <div>
                          <Text type="secondary">
                            Types: {item.types.join(', ')}
                          </Text>
                        </div>
                      )}
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}

        {!loading && results.length === 0 && !error && testType && (
          <Alert
            message="ℹ️ No Results"
            description="Không có kết quả nào được trả về."
            type="info"
            showIcon
          />
        )}
      </Card>

      {/* API Status */}
      <Card title="🔧 API Configuration" style={{ marginTop: '20px' }}>
        <Space direction="vertical">
          <div>
            <Text strong>API Key:</Text> <Text code>bYG9pMktkEuiVW9BzrWhvynpDFF3FLaDXxdfFAjE</Text>
          </div>
          <div>
            <Text strong>MapTiles Key:</Text> <Text code>B333MEjdDNZai4gvVpJtAp3rPdX8oebdHsjrLWVI</Text>
          </div>
          <div>
            <Text strong>Base URL:</Text> <Text code>https://rsapi.goong.io</Text>
          </div>
          <div>
            <Text strong>MapTiles URL:</Text> <Text code>https://tiles.goong.io</Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default GoongMapsTest;
