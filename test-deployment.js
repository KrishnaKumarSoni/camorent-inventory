// Simple test script to verify API endpoints before deployment
// Run with: node test-deployment.js

const API_BASE = process.env.API_URL || 'http://localhost:5000';

async function testEndpoint(endpoint, method = 'GET') {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { method });
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${method} ${endpoint} - Success`);
      return data;
    } else {
      console.log(`❌ ${method} ${endpoint} - Error: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${method} ${endpoint} - Network error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');
  
  // Test health endpoint
  await testEndpoint('/api/health');
  
  // Test categories endpoint
  await testEndpoint('/api/categories');
  
  // Test inventory endpoint
  await testEndpoint('/api/inventory');
  
  // Test SKUs endpoint
  await testEndpoint('/api/skus');
  
  console.log('\n✅ API tests completed!');
}

runTests().catch(console.error);