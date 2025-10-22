/**
 * Goong SDK Test Component
 * Component để test Goong Maps SDK integration
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Alert, Spin } from 'antd';
import { EnvironmentOutlined, ReloadOutlined } from '@ant-design/icons';
import { GOONG_CONFIG, GOONG_MAP_STYLES } from '../../utils/goongConfig';

const { Title, Text } = Typography;

const GoongSDKTest = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Goong Map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initMap = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Import Goong Maps SDK dynamically
        const goongjs = await import('@goongmaps/goong-js');
        
        console.log('✅ Goong Maps SDK loaded successfully');
        
        // Initialize map
        map.current = new goongjs.Map({
          container: mapContainer.current,
          style: GOONG_MAP_STYLES.BASIC,
          center: [106.6297, 10.8231], // TP.HCM [lng, lat]
          zoom: 15,
          accessToken: GOONG_CONFIG.MAPTILES_KEY
        });

        // Add marker
        marker.current = new goongjs.Marker({
          color: '#ff4d4f',
          draggable: true
        })
        .setLngLat([106.6297, 10.8231])
        .addTo(map.current);

        // Add popup
        const popup = new goongjs.Popup({ offset: 25 })
          .setHTML(`
            <div>
              <h5>🗺️ Goong Maps SDK Test</h5>
              <p>TP.HCM Center</p>
              <p>Coordinates: 10.8231, 106.6297</p>
            </div>
          `);

        marker.current.setPopup(popup);

        // Add click event listener
        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat;
          console.log('📍 Map clicked at:', lat, lng);
          
          // Update marker position
          marker.current.setLngLat([lng, lat]);
          
          // Update popup
          const newPopup = new goongjs.Popup({ offset: 25 })
            .setHTML(`
              <div>
                <h5>📍 New Location</h5>
                <p>Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
              </div>
            `);
          
          marker.current.setPopup(newPopup);
        });

        // Add marker drag event listener
        marker.current.on('dragend', () => {
          const lngLat = marker.current.getLngLat();
          console.log('📍 Marker dragged to:', lngLat.lat, lngLat.lng);
        });

        // Map load event
        map.current.on('load', () => {
          console.log('✅ Goong Map loaded successfully');
          setMapLoaded(true);
        });

        setMapLoaded(true);
        
      } catch (error) {
        console.error('❌ Error initializing Goong Map:', error);
        setError(`Không thể khởi tạo bản đồ: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const changeMapStyle = (styleType) => {
    if (!map.current) return;
    
    try {
      map.current.setStyle(GOONG_MAP_STYLES[styleType]);
      console.log(`✅ Map style changed to: ${styleType}`);
    } catch (error) {
      console.error('❌ Error changing map style:', error);
    }
  };

  const resetMap = () => {
    if (!map.current) return;
    
    try {
      map.current.flyTo({ 
        center: [106.6297, 10.8231], 
        zoom: 15 
      });
      marker.current.setLngLat([106.6297, 10.8231]);
      console.log('✅ Map reset to TP.HCM center');
    } catch (error) {
      console.error('❌ Error resetting map:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>🗺️ Goong Maps SDK Test</Title>
      
      <Card title="🧪 SDK Configuration" style={{ marginBottom: '20px' }}>
        <Space direction="vertical">
          <div><Text strong>API Key:</Text> <Text code>{GOONG_CONFIG.API_KEY}</Text></div>
          <div><Text strong>MapTiles Key:</Text> <Text code>{GOONG_CONFIG.MAPTILES_KEY}</Text></div>
          <div><Text strong>Map Style:</Text> <Text code>{GOONG_MAP_STYLES.BASIC}</Text></div>
          <div><Text strong>SDK Version:</Text> <Text code>@goongmaps/goong-js</Text></div>
        </Space>
      </Card>

      <Card title="🎮 Map Controls" style={{ marginBottom: '20px' }}>
        <Space wrap>
          <Button 
            type="primary" 
            icon={<EnvironmentOutlined />}
            onClick={() => changeMapStyle('BASIC')}
            disabled={!mapLoaded}
          >
            Basic Map
          </Button>
          <Button 
            icon={<EnvironmentOutlined />}
            onClick={() => changeMapStyle('SATELLITE')}
            disabled={!mapLoaded}
          >
            Satellite
          </Button>
          <Button 
            icon={<EnvironmentOutlined />}
            onClick={() => changeMapStyle('HYBRID')}
            disabled={!mapLoaded}
          >
            Hybrid
          </Button>
          <Button 
            icon={<ReloadOutlined />}
            onClick={resetMap}
            disabled={!mapLoaded}
          >
            Reset to TP.HCM
          </Button>
        </Space>
      </Card>

      <Card title="🗺️ Goong Map">
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '10px' }}>
              <Text>Đang khởi tạo Goong Maps SDK...</Text>
            </div>
          </div>
        )}

        {error && (
          <Alert
            message="❌ SDK Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {mapLoaded && (
          <Alert
            message="✅ SDK Loaded"
            description="Goong Maps SDK đã được khởi tạo thành công!"
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <div
          ref={mapContainer}
          style={{ 
            height: '500px', 
            width: '100%', 
            borderRadius: '8px',
            border: '1px solid #d9d9d9'
          }}
        />
        
        <div style={{ marginTop: '16px' }}>
          <Text type="secondary">
            💡 Click vào bản đồ để di chuyển marker, hoặc kéo marker để thay đổi vị trí
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default GoongSDKTest;

