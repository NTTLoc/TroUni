/**
 * Cloudinary Upload API Service
 * Using signed upload with API credentials
 */
const CLOUDINARY_CONFIG = {
  cloudName: 'dqpenxi97',
  apiKey: '518116952671396',
  apiSecret: 'cawKWsbsLec1F9IDZJL_DaR78S8'
};

// Generate timestamp for signature
const getTimestamp = () => Math.round(new Date().getTime() / 1000);

// Generate signature for signed upload
const generateSignature = (params) => {
  // Cloudinary signature format: sha1(string_to_sign + api_secret)
  const stringToSign = params.sort().join('&');
  // For simplicity, we'll use unsigned upload with upload preset
  // Signed upload requires crypto library or server-side signature generation
  return null;
};

export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    // Check if file exists
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // Generate unique public_id
    const timestamp = Date.now();
    const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const publicId = `tro-uni/rooms/${timestamp}_${fileName}`;

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
    formData.append('timestamp', getTimestamp().toString());
    formData.append('public_id', publicId);
    formData.append('folder', 'tro-uni');
    formData.append('upload_preset', 'tro-uni-upload'); // Your unsigned preset
    
    console.log('📤 Uploading to Cloudinary:', file.name);
    console.log('📤 File size:', file.size, 'bytes');
    console.log('📤 File type:', file.type);
    
    // Upload to Cloudinary
    fetch(`https://api.cloudinary.com/v1_1/dqpenxi97/image/upload`, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log('📡 Cloudinary response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      
      return response.json();
    })
    .then(result => {
      console.log('✅ Cloudinary upload success:', result);
      console.log('🔗 Image URL:', result.secure_url);
      console.log('🔗 Public ID:', result.public_id);
      
      resolve(result);
    })
    .catch(error => {
      console.error('❌ Cloudinary upload error:', error);
      console.error('❌ Error details:', error.message);
      reject(error);
    });
  });
};

/**
 * Upload multiple files sequentially
 */
export const uploadMultipleToCloudinary = async (files) => {
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      console.log(`📤 Uploading file ${i + 1}/${files.length}:`, files[i].name);
      const result = await uploadToCloudinary(files[i]);
      results.push({
        success: true,
        file: files[i],
        url: result.secure_url,
        public_id: result.public_id
      });
    } catch (error) {
      console.error(`❌ Failed to upload file ${i + 1}:`, files[index].name);
      results.push({
        success: false,
        file: files[i],
        error: error.message
      });
    }
  }
  
  return results;
};
