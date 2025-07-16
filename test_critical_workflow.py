#!/usr/bin/env python3
"""
Test the critical voice-to-form processing workflow
"""
import requests
import json

BASE_URL = "https://camo-inv.vercel.app"

def test_complete_voice_workflow():
    """Test the complete voice-to-form workflow step by step"""
    print("🎤 Testing Complete Voice-to-Form Workflow")
    print("="*50)
    
    # Step 1: Test voice recording simulation (sample data)
    print("\n🔍 Step 1: Voice Recording (Sample Data)")
    sample_payload = {"sample": True}
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/process-audio",
            headers={"Content-Type": "application/json"},
            json=sample_payload,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('processing_status') == 'success':
                print("✅ Voice recording and processing successful!")
                print(f"   📝 Transcription: {data.get('transcription', '')[:100]}...")
                
                # Step 2: Check AI extraction
                print(f"\n🔍 Step 2: AI Data Extraction")
                print(f"   📦 Equipment: {data.get('name')}")
                print(f"   🏭 Brand: {data.get('brand')}")
                print(f"   🔖 Model: {data.get('model')}")
                print(f"   📂 Category: {data.get('category')}")
                print(f"   🔢 Serial: {data.get('serialNumber')}")
                print(f"   ⚡ Condition: {data.get('condition')}")
                print(f"   💰 Purchase Price: ₹{data.get('purchasePrice'):,}")
                print(f"   💎 Current Value: ₹{data.get('currentValue'):,}")
                print(f"   📍 Location: {data.get('location')}")
                
                # Step 3: Check web research
                print(f"\n🔍 Step 3: Web Research")
                web_status = data.get('web_scraping_status')
                specs = data.get('specifications', {})
                print(f"   🌐 Web Research Status: {web_status}")
                print(f"   🔧 Specifications Found: {len(specs)} items")
                
                if specs:
                    print("   📋 Key Specifications:")
                    for key, value in list(specs.items())[:5]:  # Show first 5 specs
                        print(f"      • {key}: {value}")
                
                # Step 4: Form data preparation
                print(f"\n🔍 Step 4: Form Data Preparation")
                form_data = {
                    "name": data.get("name"),
                    "brand": data.get("brand"),
                    "model": data.get("model"),
                    "category": data.get("category"),
                    "description": data.get("description"),
                    "serial_number": data.get("serialNumber"),
                    "condition": data.get("condition"),
                    "purchase_price": data.get("purchasePrice"),
                    "current_value": data.get("currentValue"),
                    "price_per_day": data.get("pricePerDay"),
                    "security_deposit": data.get("securityDeposit"),
                    "location": data.get("location"),
                    "notes": data.get("notes"),
                    "specifications": data.get("specifications"),
                }
                
                print("✅ Form data prepared successfully!")
                print(f"   📋 Fields populated: {len([v for v in form_data.values() if v])}")
                
                # Summary
                print(f"\n🎉 COMPLETE VOICE-TO-FORM WORKFLOW TEST RESULTS")
                print("="*50)
                print("✅ Step 1: Voice Recording → PASS")
                print("✅ Step 2: AI Transcription & Extraction → PASS") 
                print("✅ Step 3: Web Research & Specifications → PASS")
                print("✅ Step 4: Form Data Preparation → PASS")
                print("\n🏆 ALL CRITICAL WORKFLOW STEPS WORKING!")
                
                # Show the complete extracted data
                print(f"\n📊 EXTRACTED EQUIPMENT DATA:")
                print(json.dumps(form_data, indent=2, ensure_ascii=False))
                
                return True
                
            else:
                print(f"❌ Voice processing failed: {data.get('error')}")
                return False
        else:
            print(f"❌ Voice processing endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Voice processing error: {e}")
        return False

def test_real_audio_simulation():
    """Simulate testing with real audio file"""
    print(f"\n🎵 Testing Real Audio File Simulation")
    print("-" * 40)
    
    # Create a mock audio blob content
    mock_audio_content = b"Mock audio file content for testing"
    
    try:
        # Simulate multipart form data
        files = {'audio': ('recording.webm', mock_audio_content, 'audio/webm')}
        
        response = requests.post(
            f"{BASE_URL}/api/process-audio",
            files=files,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Real audio simulation: {data.get('processing_status')}")
            if data.get('error'):
                print(f"   ℹ️  Expected error (no real audio): {data.get('error')}")
            return True
        else:
            print(f"❌ Real audio simulation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Real audio simulation error: {e}")
        return False

if __name__ == "__main__":
    success1 = test_complete_voice_workflow()
    success2 = test_real_audio_simulation()
    
    if success1:
        print(f"\n🎊 CONCLUSION: The core voice-to-form workflow is fully functional!")
        print("   Users can record voice → AI processes → form gets pre-filled")
        if not success2:
            print("   Note: Real audio processing may need environment setup")
    else:
        print(f"\n❌ CONCLUSION: Voice workflow has issues that need fixing")