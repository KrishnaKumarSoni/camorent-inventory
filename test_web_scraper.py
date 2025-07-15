#!/usr/bin/env python3
"""
Test web scraper functionality for equipment specifications
"""
import sys
import os
sys.path.append('api')

from web_scraper import WebScraper
import json

def test_web_scraping():
    """Test web scraping for equipment specifications"""
    scraper = WebScraper()
    
    test_queries = [
        "Canon EOS R5 camera specifications",
        "Sony FX6 cinema camera specs",
        "Rode VideoMic Pro Plus microphone specifications",
        "Canon 70-200mm f/2.8L IS lens specs"
    ]
    
    for query in test_queries:
        print(f"🔍 Searching for: {query}")
        try:
            specs = scraper.search_equipment_specs(query)
            if specs:
                print("✅ Found specifications:")
                print(json.dumps(specs, indent=2))
            else:
                print("⚠️  No specifications found")
            print("-" * 60)
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            print("-" * 60)

if __name__ == "__main__":
    test_web_scraping()