<!-- HTML -->
<input type="file" id="fileInput" accept="application/pdf" />
<div id="uploadStatus"></div>

<!-- JavaScript -->
<script>
const API_ENDPOINT = 'your-api-gateway-url';

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('uploadStatus');
    const file = fileInput.files[0];

    if (!file) {
        statusDiv.innerHTML = 'Please select a file';
        return;
    }

    try {
        // Get presigned URL
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: JSON.stringify({ fileName: file.name })
        });
        const { presignedUrl } = await response.json();

        // Upload to S3
        await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': 'application/pdf'
            }
        });

        statusDiv.innerHTML = 'Upload successful!';
    } catch (error) {
        statusDiv.innerHTML = 'Upload failed: ' + error.message;
    }
}

document.getElementById('fileInput').addEventListener('change', uploadFile);
</script>
