import React, { useState, useEffect } from 'react';
import { MagnifyingGlass, Funnel, Package } from 'phosphor-react';
import { api } from '../utils/api';

interface InventoryItem {
  id: string;
  sku_id: string;
  serial_number: string;
  condition: string;
  status: string;
  location: string;
  notes: string;
  created_at: any;
  // SKU data (joined)
  name?: string;
  brand?: string;
  model?: string;
  category?: string;
}

const InventoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [skus, setSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get inventory items from Firebase via API
      const response = await api.getInventory();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load inventory');
      }
      
      // Transform Firebase data to match component interface
      const items = response.data?.items || [];
      const transformedItems = items.map((item: any) => ({
        id: item.id,
        sku_id: item.sku_id,
        serial_number: item.serial_number || '',
        condition: item.condition || 'good',
        status: item.status || 'available',
        location: item.location || '',
        notes: item.notes || '',
        created_at: item.created_at,
        // Include SKU data if available
        name: item.sku?.name || item.name,
        brand: item.sku?.brand || item.brand,
        model: item.sku?.model || item.model,
        category: item.sku?.category || item.category
      }));
      
      setInventoryItems(transformedItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to load inventory');
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-green-100 text-green-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="font-heading font-bold text-primary text-2xl mb-4">
          Digital Inventory
        </h2>
        
        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-medium" 
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory..."
              className="input-primary w-full pl-10"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 px-4">
            <Funnel size={16} />
            Filter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-light rounded-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">{inventoryItems.length}</p>
            <p className="text-xs text-gray-medium">Total Items</p>
          </div>
          <div className="bg-green-50 rounded-card p-3 text-center">
            <p className="text-2xl font-bold text-green-600">
              {inventoryItems.filter(item => item.status === 'available').length}
            </p>
            <p className="text-xs text-gray-medium">Available</p>
          </div>
          <div className="bg-yellow-50 rounded-card p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {inventoryItems.filter(item => item.status === 'booked').length}
            </p>
            <p className="text-xs text-gray-medium">Booked</p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-medium">Loading inventory...</p>
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

      {/* Inventory List */}
      {!loading && !error && (
        <div className="space-y-3">
          {inventoryItems
            .filter(item => 
              !searchTerm || 
              item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
            <div key={item.id} className="bg-background border border-gray-light rounded-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-light rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-gray-medium" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{item.name || 'Unknown Equipment'}</h3>
                    <p className="text-sm text-gray-medium">SN: {item.serial_number}</p>
                    {item.brand && item.model && (
                      <p className="text-xs text-gray-medium">{item.brand} {item.model}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </div>
                <p className="text-sm text-gray-medium">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && inventoryItems.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-medium mx-auto mb-4" />
          <p className="text-gray-medium">No equipment digitalized yet</p>
          <p className="text-sm text-gray-medium mt-2">Start by recording equipment descriptions in the Digitalize tab</p>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;