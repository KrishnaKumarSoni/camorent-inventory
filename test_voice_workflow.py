#!/usr/bin/env python3
"""
Test the complete voice-to-form workflow with realistic equipment descriptions
"""
import sys
import os
sys.path.append('api')

from openai_client import OpenAIClient
from web_scraper import WebScraper
import json

def test_equipment_extraction(description):
    """Test equipment data extraction from voice description"""
    print(f"🎤 Testing with voice input: '{description}'\n")
    
    try:
        # Initialize OpenAI client
        openai_client = OpenAIClient()
        
        # Test transcription simulation (we'll use the description directly)
        print("✅ Step 1: Speech transcribed successfully")
        transcription = description
        
        # Test equipment extraction
        print("🔍 Step 2: Extracting equipment data...")
        extracted_data = openai_client.extract_equipment_data(transcription)
        
        print("✅ Equipment data extracted:")
        print(json.dumps(extracted_data, indent=2))
        print()
        
        # Test web scraping for specifications
        if extracted_data and 'brand' in extracted_data and 'model' in extracted_data:
            print("🌐 Step 3: Searching for specifications online...")
            scraper = WebScraper()
            search_query = f"{extracted_data['brand']} {extracted_data['model']} specifications"
            specs = scraper.search_equipment_specs(search_query)
            
            if specs:
                print("✅ Web scraping successful:")
                print(json.dumps(specs, indent=2))
                
                # Merge specifications
                if 'specifications' not in extracted_data:
                    extracted_data['specifications'] = {}
                extracted_data['specifications'].update(specs)
            else:
                print("⚠️  No additional specifications found online")
        
        print("\n🎯 Final form data that would pre-fill:")
        print(json.dumps(extracted_data, indent=2))
        return extracted_data
        
    except Exception as e:
        print(f"❌ Error in workflow: {str(e)}")
        return None

if __name__ == "__main__":
    # Test with realistic equipment descriptions
    test_cases = [
        "I have a Canon EOS R5 mirrorless camera here, serial number CAN123456789. It's a professional camera in good condition, bought for 250000 rupees. It's currently in warehouse section A, shelf 3. The camera has 45 megapixel resolution and can shoot 8K video. We rent it out for 2000 rupees per day with a security deposit of 25000 rupees.",
        
        "This is a Sony FX6 cinema camera, model number FX6-001, serial FX6789012. Excellent condition, very expensive piece - we paid 450000 for it. Located in the video equipment section, rack B2. It records in 4K at 120fps, has dual base ISO. Daily rental is 3500 rupees, security deposit 50000.",
        
        "Here's a Rode VideoMic Pro Plus shotgun microphone, serial RD567890. Good condition, some minor scratches but works perfectly. Cost us 35000 rupees originally. It's in the audio gear cabinet, drawer 5. Has built-in battery, frequency response 20Hz-20kHz. We charge 300 per day, deposit 5000.",
        
        "Canon 70-200mm f/2.8L IS lens, white telephoto lens in very good condition. Serial number LEN987654. Purchase price was 180000 rupees. Stored in lens cabinet section C, position 12. Has image stabilization, weather sealing. Rental rate 1200 per day, security deposit 20000 rupees."
    ]
    
    for i, description in enumerate(test_cases, 1):
        print(f"{'='*80}")
        print(f"TEST CASE {i}")
        print(f"{'='*80}")
        test_equipment_extraction(description)
        print("\n")