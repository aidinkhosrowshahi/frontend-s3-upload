import React, { useState } from 'react';
import axios from 'axios'; // You'll need axios or fetch

function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    try {
      setUploading(true);

      // 1. Get presigned URL from your API Gateway endpoint
      const response = await axios.get('YOUR_API_GATEWAY_URL', {
        params: {
          fileName: file.name,
          fileType: file.type
        }
      });

      const { presignedUrl } = response.data;

      // 2. Upload file directly to S3 using the presigned URL
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });

      alert('File uploaded successfully!');
      setFile(null);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      <button 
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload to S3'}
      </button>
    </div>
  );
}

export default FileUpload;
