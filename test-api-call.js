// Test API call from browser
fetch('https://camo-inv.vercel.app/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('Health check:', data);
    
    // Test audio processing with mock FormData
    const formData = new FormData();
    const blob = new Blob(['test'], { type: 'audio/webm' });
    formData.append('audio', blob, 'test.webm');
    
    return fetch('https://camo-inv.vercel.app/api/process-audio', {
      method: 'POST',
      body: formData
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('Audio processing test:', data);
  })
  .catch(error => {
    console.error('API test failed:', error);
  });