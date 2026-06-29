const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = async (fileBuffer, folder = 'safeguard-ai') => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

module.exports = { uploadToCloudinary };
