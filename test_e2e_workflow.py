#!/usr/bin/env python3
"""
End-to-end test of the complete voice-to-form workflow
"""
import requests
import json
import time
import sys

BASE_URL = "https://camo-inv.vercel.app"
# BASE_URL = "http://localhost:3000"  # For local testing

def test_health_endpoint():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health endpoint: {data['status']} - {data['message']}")
            print(f"   Services: {data['services']}")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False

def test_categories_endpoint():
    """Test categories endpoint"""
    print("\n🔍 Testing categories endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/categories", timeout=10)
        if response.status_code == 200:
            # Check if we get HTML (deployment issue) or JSON
            content_type = response.headers.get('content-type', '')
            if 'html' in content_type:
                print(f"❌ Categories endpoint returning HTML instead of JSON (deployment issue)")
                print(f"   Content-Type: {content_type}")
                return False
            
            try:
                data = response.json()
                if data.get('success'):
                    categories = data.get('categories', [])
                    print(f"✅ Categories endpoint: Found {len(categories)} categories")
                    print(f"   Categories: {categories}")
                    return True
                else:
                    print(f"❌ Categories endpoint returned error: {data.get('error')}")
                    return False
            except json.JSONDecodeError:
                print(f"❌ Categories endpoint returned invalid JSON")
                print(f"   Response: {response.text[:200]}")
                return False
        else:
            print(f"❌ Categories endpoint failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ Categories endpoint error: {e}")
        return False

def test_skus_endpoint():
    """Test SKUs endpoint"""
    print("\n🔍 Testing SKUs endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/skus", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                skus = data.get('skus', [])
                print(f"✅ SKUs endpoint: Found {len(skus)} SKUs")
                return True
            else:
                print(f"❌ SKUs endpoint returned error: {data.get('error')}")
                return False
        else:
            print(f"❌ SKUs endpoint failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ SKUs endpoint error: {e}")
        return False

def test_inventory_endpoint():
    """Test inventory endpoint"""
    print("\n🔍 Testing inventory endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/inventory", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                items = data.get('items', [])
                print(f"✅ Inventory endpoint: Found {len(items)} items")
                return True
            else:
                print(f"❌ Inventory endpoint returned error: {data.get('error')}")
                return False
        else:
            print(f"❌ Inventory endpoint failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ Inventory endpoint error: {e}")
        return False

def test_voice_processing():
    """Test voice processing with sample data"""
    print("\n🔍 Testing voice processing workflow...")
    try:
        # Test with sample data
        sample_payload = {"sample": True}
        response = requests.post(
            f"{BASE_URL}/api/process-audio",
            headers={"Content-Type": "application/json"},
            json=sample_payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('processing_status') == 'success':
                print("✅ Voice processing: Sample data processed successfully")
                print(f"   Extracted: {data.get('name')} - {data.get('brand')} {data.get('model')}")
                print(f"   Transcription: {data.get('transcription', '')[:100]}...")
                print(f"   Web research: {data.get('web_scraping_status')}")
                print(f"   Specifications: {len(data.get('specifications', {}))} specs found")
                return data
            else:
                print(f"❌ Voice processing failed: {data.get('error')}")
                return None
        else:
            print(f"❌ Voice processing endpoint failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Voice processing error: {e}")
        return None

def test_inventory_creation(sample_data):
    """Test creating inventory item from processed voice data"""
    print("\n🔍 Testing inventory item creation...")
    try:
        # Prepare inventory data from voice processing result
        inventory_data = {
            "name": sample_data.get("name"),
            "brand": sample_data.get("brand"),
            "model": sample_data.get("model"),
            "category": sample_data.get("category"),
            "description": sample_data.get("description"),
            "serial_number": sample_data.get("serialNumber"),
            "condition": sample_data.get("condition"),
            "purchase_price": sample_data.get("purchasePrice"),
            "current_value": sample_data.get("currentValue"),
            "price_per_day": sample_data.get("pricePerDay"),
            "security_deposit": sample_data.get("securityDeposit"),
            "location": sample_data.get("location"),
            "notes": sample_data.get("notes"),
            "specifications": sample_data.get("specifications"),
            "created_by": "test_user"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/inventory",
            headers={"Content-Type": "application/json"},
            json=inventory_data,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"✅ Inventory creation: Item created with ID {data.get('id')}")
                return True
            else:
                print(f"❌ Inventory creation failed: {data.get('error')}")
                return False
        else:
            print(f"❌ Inventory creation endpoint failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ Inventory creation error: {e}")
        return False

def main():
    """Run complete end-to-end test"""
    print("🚀 Starting End-to-End Test of Voice-to-Form Workflow")
    print("="*60)
    
    results = []
    
    # Test all endpoints
    results.append(("Health Check", test_health_endpoint()))
    results.append(("Categories API", test_categories_endpoint()))
    results.append(("SKUs API", test_skus_endpoint()))
    results.append(("Inventory API", test_inventory_endpoint()))
    
    # Test voice processing workflow
    voice_data = test_voice_processing()
    results.append(("Voice Processing", voice_data is not None))
    
    # Test inventory creation if voice processing worked
    if voice_data:
        results.append(("Inventory Creation", test_inventory_creation(voice_data)))
    else:
        results.append(("Inventory Creation", False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST RESULTS SUMMARY")
    print("="*60)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name:20} : {status}")
        if success:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed ({100*passed//total}%)")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! End-to-end workflow is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {total-passed} tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())