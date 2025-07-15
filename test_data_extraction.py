#!/usr/bin/env python3
"""
Test equipment data extraction with mock realistic data to validate form pre-filling
"""
import json

def simulate_ai_extraction(voice_description):
    """
    Simulate what the AI would extract from voice descriptions
    This shows the expected form pre-filling behavior
    """
    
    # Simulate realistic AI extraction based on voice input patterns
    extraction_results = {
        "Canon EOS R5": {
            "name": "Canon EOS R5",
            "brand": "Canon", 
            "model": "EOS R5",
            "category": "cameras",
            "serialNumber": "CAN123456789",
            "barcode": "",
            "condition": "good",
            "notes": "Professional mirrorless camera, 45MP resolution, 8K video capability",
            "specifications": {
                "resolution": "45 megapixels",
                "video": "8K recording",
                "type": "Mirrorless",
                "mount": "Canon RF",
                "iso_range": "100-51200",
                "display": "3.2-inch vari-angle touchscreen"
            },
            "description": "Professional mirrorless camera with 45 megapixel resolution and 8K video recording capability",
            "purchasePrice": 250000,
            "currentValue": 230000,
            "pricePerDay": 2000,
            "securityDeposit": 25000,
            "location": "Warehouse section A, shelf 3",
            "confidence_scores": {
                "name": 0.95,
                "brand": 0.98,
                "model": 0.96,
                "serialNumber": 0.90,
                "condition": 0.85,
                "purchasePrice": 0.92,
                "pricePerDay": 0.94,
                "location": 0.88
            }
        },
        
        "Sony FX6": {
            "name": "Sony FX6 Cinema Camera",
            "brand": "Sony",
            "model": "FX6",
            "category": "cameras",
            "serialNumber": "FX6789012", 
            "barcode": "FX6-001",
            "condition": "new",
            "notes": "Professional cinema camera, 4K 120fps, dual base ISO",
            "specifications": {
                "recording": "4K at 120fps",
                "iso": "Dual base ISO 800/4000",
                "codec": "XAVC-I, XAVC-L",
                "mount": "Sony E-mount",
                "display": "4-inch touchscreen LCD",
                "weight": "890g body only"
            },
            "description": "Professional cinema camera with 4K 120fps recording and dual base ISO",
            "purchasePrice": 450000,
            "currentValue": 420000,
            "pricePerDay": 3500,
            "securityDeposit": 50000,
            "location": "Video equipment section, rack B2",
            "confidence_scores": {
                "name": 0.92,
                "brand": 0.97,
                "model": 0.94,
                "serialNumber": 0.89,
                "condition": 0.91,
                "purchasePrice": 0.88,
                "pricePerDay": 0.93,
                "location": 0.86
            }
        },
        
        "Rode VideoMic Pro Plus": {
            "name": "Rode VideoMic Pro Plus",
            "brand": "Rode",
            "model": "VideoMic Pro Plus",
            "category": "audio",
            "serialNumber": "RD567890",
            "barcode": "",
            "condition": "good",
            "notes": "Shotgun microphone with built-in battery, minor scratches but works perfectly",
            "specifications": {
                "type": "Shotgun condenser microphone",
                "frequency_response": "20Hz - 20kHz",
                "power": "Built-in lithium battery",
                "connectivity": "3.5mm TRS/TRRS output",
                "dimensions": "170mm x 21mm",
                "weight": "122g"
            },
            "description": "Professional shotgun microphone with built-in battery and 20Hz-20kHz frequency response",
            "purchasePrice": 35000,
            "currentValue": 28000,
            "pricePerDay": 300,
            "securityDeposit": 5000,
            "location": "Audio gear cabinet, drawer 5",
            "confidence_scores": {
                "name": 0.94,
                "brand": 0.96,
                "model": 0.93,
                "serialNumber": 0.87,
                "condition": 0.83,
                "purchasePrice": 0.89,
                "pricePerDay": 0.91,
                "location": 0.85
            }
        },
        
        "Canon 70-200mm": {
            "name": "Canon EF 70-200mm f/2.8L IS USM",
            "brand": "Canon",
            "model": "EF 70-200mm f/2.8L IS USM", 
            "category": "lenses",
            "serialNumber": "LEN987654",
            "barcode": "",
            "condition": "good",
            "notes": "White telephoto lens with image stabilization and weather sealing",
            "specifications": {
                "focal_length": "70-200mm",
                "aperture": "f/2.8 constant",
                "image_stabilization": "4-stop IS",
                "mount": "Canon EF",
                "weather_sealing": "Yes",
                "weight": "1490g",
                "filter_size": "77mm"
            },
            "description": "Professional telephoto zoom lens with constant f/2.8 aperture and image stabilization",
            "purchasePrice": 180000,
            "currentValue": 160000,
            "pricePerDay": 1200,
            "securityDeposit": 20000,
            "location": "Lens cabinet section C, position 12",
            "confidence_scores": {
                "name": 0.91,
                "brand": 0.98,
                "model": 0.89,
                "serialNumber": 0.92,
                "condition": 0.87,
                "purchasePrice": 0.85,
                "pricePerDay": 0.90,
                "location": 0.84
            }
        }
    }
    
    # Find matching equipment based on description
    for key, data in extraction_results.items():
        if key.lower() in voice_description.lower():
            return data
    
    return None

def test_form_prefilling():
    """Test how the extracted data would pre-fill the equipment form"""
    
    test_descriptions = [
        "I have a Canon EOS R5 mirrorless camera here, serial number CAN123456789. It's a professional camera in good condition, bought for 250000 rupees. It's currently in warehouse section A, shelf 3. The camera has 45 megapixel resolution and can shoot 8K video. We rent it out for 2000 rupees per day with a security deposit of 25000 rupees.",
        
        "This is a Sony FX6 cinema camera, model number FX6-001, serial FX6789012. Excellent condition, very expensive piece - we paid 450000 for it. Located in the video equipment section, rack B2. It records in 4K at 120fps, has dual base ISO. Daily rental is 3500 rupees, security deposit 50000.",
        
        "Here's a Rode VideoMic Pro Plus shotgun microphone, serial RD567890. Good condition, some minor scratches but works perfectly. Cost us 35000 rupees originally. It's in the audio gear cabinet, drawer 5. Has built-in battery, frequency response 20Hz-20kHz. We charge 300 per day, deposit 5000.",
        
        "Canon 70-200mm f/2.8L IS lens, white telephoto lens in very good condition. Serial number LEN987654. Purchase price was 180000 rupees. Stored in lens cabinet section C, position 12. Has image stabilization, weather sealing. Rental rate 1200 per day, security deposit 20000 rupees."
    ]
    
    for i, description in enumerate(test_descriptions, 1):
        print(f"{'='*80}")
        print(f"TEST CASE {i}: FORM PRE-FILLING SIMULATION")
        print(f"{'='*80}")
        print(f"🎤 Voice Input: {description[:100]}...")
        print()
        
        extracted_data = simulate_ai_extraction(description)
        
        if extracted_data:
            print("✅ AI EXTRACTION SUCCESSFUL")
            print("📋 FORM WOULD BE PRE-FILLED WITH:")
            print()
            
            # Equipment ID Section
            print("🏷️  EQUIPMENT ID SECTION:")
            print(f"   Name: {extracted_data['name']} (confidence: {extracted_data['confidence_scores']['name']:.0%})")
            print(f"   Brand: {extracted_data['brand']} (confidence: {extracted_data['confidence_scores']['brand']:.0%})")
            print(f"   Model: {extracted_data['model']} (confidence: {extracted_data['confidence_scores']['model']:.0%})")
            print(f"   Category: {extracted_data['category']}")
            print(f"   Serial Number: {extracted_data['serialNumber']} (confidence: {extracted_data['confidence_scores']['serialNumber']:.0%})")
            if extracted_data['barcode']:
                print(f"   Barcode: {extracted_data['barcode']}")
            print()
            
            # Condition Section
            print("🔧 CONDITION & NOTES SECTION:")
            print(f"   Condition: {extracted_data['condition'].title()} (confidence: {extracted_data['confidence_scores']['condition']:.0%})")
            print(f"   Notes: {extracted_data['notes']}")
            print()
            
            # Specifications Section
            print("📊 SPECIFICATIONS SECTION:")
            print(f"   Description: {extracted_data['description']}")
            print("   Technical Specifications:")
            for spec, value in extracted_data['specifications'].items():
                print(f"     • {spec.replace('_', ' ').title()}: {value}")
            print()
            
            # Financial Section
            print("💰 FINANCIAL SECTION:")
            print(f"   Purchase Price: ₹{extracted_data['purchasePrice']:,} (confidence: {extracted_data['confidence_scores']['purchasePrice']:.0%})")
            print(f"   Current Value: ₹{extracted_data['currentValue']:,}")
            print(f"   Daily Rental: ₹{extracted_data['pricePerDay']:,} (confidence: {extracted_data['confidence_scores']['pricePerDay']:.0%})")
            print(f"   Security Deposit: ₹{extracted_data['securityDeposit']:,}")
            print()
            
            # Location Section
            print("📍 LOCATION SECTION:")
            print(f"   Location: {extracted_data['location']} (confidence: {extracted_data['confidence_scores']['location']:.0%})")
            print()
            
            # Show what would be created in database
            print("🗄️  WOULD CREATE:")
            print(f"   ✓ SKU: {extracted_data['name']} ({extracted_data['brand']} {extracted_data['model']})")
            print(f"   ✓ Inventory Item: Serial {extracted_data['serialNumber']}, Condition: {extracted_data['condition']}")
            print(f"   ✓ Location: {extracted_data['location']}")
            
        else:
            print("❌ No matching equipment found in simulation")
        
        print("\n")

if __name__ == "__main__":
    test_form_prefilling()