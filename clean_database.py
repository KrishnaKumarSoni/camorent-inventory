#!/usr/bin/env python3
"""
Database cleaning script for Camorent Inventory
Wipes all inventory, SKUs, categories, brands but preserves user authentication data
"""

import os
import sys
import json
from firebase_admin import firestore

# Add the api directory to the path to import firebase_config
api_dir = os.path.join(os.path.dirname(__file__), 'api')
sys.path.append(api_dir)

from firebase_config import get_firestore_client

def clean_collection(db, collection_name):
    """Delete all documents in a collection"""
    print(f"Cleaning collection: {collection_name}")
    
    # Get all documents in the collection
    docs = db.collection(collection_name).stream()
    
    deleted_count = 0
    for doc in docs:
        doc.reference.delete()
        deleted_count += 1
    
    print(f"Deleted {deleted_count} documents from {collection_name}")
    return deleted_count

def main():
    try:
        # Initialize Firestore client
        db = get_firestore_client()
        print("Connected to Firestore successfully")
        
        # Collections to clean (preserving users and auth data)
        collections_to_clean = [
            'inventory',
            'skus', 
            'categories',
            'brands',
            'bookings',
            'orders',
            'transactions'
        ]
        
        total_deleted = 0
        
        print("\n🧹 Starting database cleanup...")
        print("=" * 50)
        
        for collection in collections_to_clean:
            try:
                deleted = clean_collection(db, collection)
                total_deleted += deleted
            except Exception as e:
                print(f"Error cleaning {collection}: {str(e)}")
        
        print("=" * 50)
        print(f"✅ Database cleanup complete!")
        print(f"Total documents deleted: {total_deleted}")
        print("\n📝 Preserved collections:")
        print("- users (authentication data kept intact)")
        print("- Any other auth-related collections")
        
        print("\n🎯 Your database is now clean and ready for fresh inventory data!")
        
    except Exception as e:
        print(f"❌ Error during database cleanup: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()