#!/usr/bin/env python3
"""
Test API endpoints with realistic equipment data
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000"

def test_api_endpoint(method, endpoint, data=None):
    """Test an API endpoint and return the response"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method.upper() == 'POST':
            response = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
        else:
            response = requests.get(url)
            
        print(f"{method.upper()} {endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success: {json.dumps(result, indent=2)}")
            return result
        else:
            print(f"❌ Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        return None

def test_complete_workflow():
    """Test the complete digitalization workflow"""
    print("🧪 TESTING COMPLETE DIGITALIZATION WORKFLOW")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1️⃣  Testing Health Endpoint")
    print("-" * 30)
    health = test_api_endpoint('GET', '/api/health')
    
    # Test 2: Categories
    print("\n2️⃣  Testing Categories Endpoint")
    print("-" * 30)
    categories = test_api_endpoint('GET', '/api/categories')
    
    # Test 3: Empty inventory (starting state)
    print("\n3️⃣  Testing Empty Inventory (Initial State)")
    print("-" * 30)
    inventory = test_api_endpoint('GET', '/api/inventory')
    
    # Test 4: Empty SKUs (starting state)
    print("\n4️⃣  Testing Empty SKUs (Initial State)")
    print("-" * 30)
    skus = test_api_endpoint('GET', '/api/skus')
    
    # Test 5: Create SKU (simulating voice-to-form output)
    print("\n5️⃣  Testing SKU Creation (Voice-to-Form Result)")
    print("-" * 30)
    sku_data = {
        "name": "Canon EOS R5",
        "brand": "Canon",
        "model": "EOS R5", 
        "category": "cameras",
        "description": "Professional mirrorless camera with 45 megapixel resolution and 8K video recording capability",
        "specifications": {
            "resolution": "45 megapixels",
            "video": "8K recording",
            "type": "Mirrorless",
            "mount": "Canon RF",
            "iso_range": "100-51200",
            "display": "3.2-inch vari-angle touchscreen"
        },
        "price_per_day": 2000,
        "security_deposit": 25000
    }
    
    sku_result = test_api_endpoint('POST', '/api/skus', sku_data)
    sku_id = sku_result.get('id') if sku_result else None
    
    # Test 6: Create Inventory Item 
    print("\n6️⃣  Testing Inventory Item Creation")
    print("-" * 30)
    if sku_id:
        inventory_data = {
            "sku_id": sku_id,
            "serial_number": "CAN123456789",
            "barcode": "",
            "condition": "good", 
            "status": "available",
            "location": "Warehouse section A, shelf 3",
            "purchase_price": 250000,
            "current_value": 230000,
            "notes": "Professional mirrorless camera, 45MP resolution, 8K video capability",
            "created_by": "test_user"
        }
        
        inventory_result = test_api_endpoint('POST', '/api/inventory', inventory_data)
    else:
        print("❌ Cannot create inventory item without SKU ID")
    
    # Test 7: Verify SKUs now has data
    print("\n7️⃣  Testing SKUs After Creation")
    print("-" * 30)
    skus_after = test_api_endpoint('GET', '/api/skus')
    
    # Test 8: Verify Inventory now has data
    print("\n8️⃣  Testing Inventory After Creation")
    print("-" * 30)
    inventory_after = test_api_endpoint('GET', '/api/inventory')
    
    # Test 9: Create Another Equipment Type
    print("\n9️⃣  Testing Second Equipment Type (Audio)")
    print("-" * 30)
    audio_sku_data = {
        "name": "Rode VideoMic Pro Plus",
        "brand": "Rode",
        "model": "VideoMic Pro Plus",
        "category": "audio",
        "description": "Professional shotgun microphone with built-in battery and 20Hz-20kHz frequency response",
        "specifications": {
            "type": "Shotgun condenser microphone",
            "frequency_response": "20Hz - 20kHz", 
            "power": "Built-in lithium battery",
            "connectivity": "3.5mm TRS/TRRS output",
            "dimensions": "170mm x 21mm",
            "weight": "122g"
        },
        "price_per_day": 300,
        "security_deposit": 5000
    }
    
    audio_sku_result = test_api_endpoint('POST', '/api/skus', audio_sku_data)
    audio_sku_id = audio_sku_result.get('id') if audio_sku_result else None
    
    if audio_sku_id:
        audio_inventory_data = {
            "sku_id": audio_sku_id,
            "serial_number": "RD567890",
            "barcode": "",
            "condition": "good",
            "status": "available", 
            "location": "Audio gear cabinet, drawer 5",
            "purchase_price": 35000,
            "current_value": 28000,
            "notes": "Shotgun microphone with built-in battery, minor scratches but works perfectly",
            "created_by": "test_user"
        }
        
        test_api_endpoint('POST', '/api/inventory', audio_inventory_data)
    
    # Test 10: Final verification with multiple items
    print("\n🔟 Final Verification - Multiple Equipment Types")
    print("-" * 30)
    final_skus = test_api_endpoint('GET', '/api/skus')
    final_inventory = test_api_endpoint('GET', '/api/inventory')
    
    print("\n📊 DIGITALIZATION WORKFLOW TEST SUMMARY")
    print("=" * 60)
    if final_skus and final_inventory:
        sku_count = len(final_skus.get('skus', []))
        inventory_count = len(final_inventory.get('items', []))
        print(f"✅ Created {sku_count} equipment types (SKUs)")
        print(f"✅ Created {inventory_count} inventory items")
        print("✅ Digitalization workflow successful!")
    else:
        print("❌ Digitalization workflow failed")

if __name__ == "__main__":
    print("🚀 Starting API Endpoint Tests...")
    print("📡 Make sure Flask server is running on http://localhost:5000")
    time.sleep(2)
    test_complete_workflow()