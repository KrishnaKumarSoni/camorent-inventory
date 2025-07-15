import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, Package, Camera, Lightbulb, Headphones } from 'phosphor-react';
import { api } from '../utils/api';

interface SKU {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  specifications: any;
  price_per_day: number;
  security_deposit: number;
  image_url: string;
  is_active: boolean;
  created_at: any;
  inventoryCount?: number;
}

const SKUsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [skus, setSkus] = useState<SKU[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: Package },
    { id: 'cameras', name: 'Cameras', icon: Camera },
    { id: 'lenses', name: 'Lenses', icon: Camera },
    { id: 'lighting', name: 'Lighting', icon: Lightbulb },
    { id: 'audio', name: 'Audio', icon: Headphones }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch SKUs and inventory items in parallel
      const [skusResult, inventoryResult] = await Promise.all([
        api.getSKUs(),
        api.getInventory()
      ]);

      if (!skusResult.success) {
        throw new Error(skusResult.error || 'Failed to fetch SKUs');
      }

      if (!inventoryResult.success) {
        throw new Error(inventoryResult.error || 'Failed to fetch inventory');
      }

      const skusData = skusResult.data?.skus || [];
      const inventoryData = inventoryResult.data?.items || [];

      setInventoryItems(inventoryData);
      
      // Calculate inventory count for each SKU
      const inventoryCountMap = new Map();
      inventoryData.forEach((item: any) => {
        const count = inventoryCountMap.get(item.sku_id) || 0;
        inventoryCountMap.set(item.sku_id, count + 1);
      });

      // Enrich SKUs with inventory count
      const enrichedSkus = skusData.map((sku: SKU) => ({
        ...sku,
        inventoryCount: inventoryCountMap.get(sku.id) || 0
      }));

      setSkus(enrichedSkus);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load SKU data');
    } finally {
      setLoading(false);
    }
  };

  const filteredSKUs = skus.filter(sku => {
    const matchesSearch = sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sku.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sku.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj?.icon || Package;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-heading font-bold text-primary text-2xl mb-4">
          Equipment Catalog
        </h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" 
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search equipment types..."
            className="input-primary w-full pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-button whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-accent text-white'
                    : 'bg-gray-light text-gray-medium hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-light rounded-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">{skus.length}</p>
            <p className="text-xs text-gray-medium">Equipment Types</p>
          </div>
          <div className="bg-accent/10 rounded-card p-3 text-center">
            <p className="text-2xl font-bold text-accent">
              {new Set(skus.map(sku => sku.category)).size}
            </p>
            <p className="text-xs text-gray-medium">Categories</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-medium">Loading SKUs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <Package size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="btn-secondary"
          >
            Try Again
          </button>
        </div>
      )}

      {/* SKUs List */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredSKUs.map((sku) => {
            const Icon = getCategoryIcon(sku.category);
            return (
              <div key={sku.id} className="bg-background border border-gray-light rounded-card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-light rounded-lg flex items-center justify-center">
                    <Icon size={20} className="text-gray-medium" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{sku.name}</h3>
                    <p className="text-sm text-gray-medium">{sku.brand} • {sku.model}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-gray-light rounded text-xs font-medium text-gray-medium capitalize">
                        {sku.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {sku.inventoryCount || 0} in stock
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-light">
                  <div>
                    <p className="text-xs text-gray-medium">Daily Rate</p>
                    <p className="font-semibold text-primary">₹{sku.price_per_day.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-medium">Security Deposit</p>
                    <p className="font-semibold text-primary">₹{sku.security_deposit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredSKUs.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-medium mx-auto mb-4" />
          <p className="text-gray-medium">No equipment types found</p>
          {searchTerm && (
            <p className="text-sm text-gray-medium mt-1">
              Try adjusting your search or category filter
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SKUsPage;