import React, { useState, useEffect } from 'react';
import { Check, CaretDown, X } from 'phosphor-react';

interface EquipmentData {
  // SKU fields (from PRD)
  name: string;
  brand: string;
  model: string;
  category: string;
  description: string;
  specifications: Record<string, string>;
  price_per_day: number;
  security_deposit: number;
  
  // Inventory fields (from PRD)  
  serial_number: string;
  barcode: string;
  condition: 'new' | 'good' | 'fair' | 'damaged';
  status: 'available' | 'booked' | 'maintenance' | 'retired';
  location: string;
  purchase_price: number;
  current_value: number;
  notes: string;
}

interface ConfidenceScores {
  [key: string]: number; // 0-1 confidence score
}

interface EquipmentFormProps {
  initialData?: Partial<EquipmentData>;
  confidenceScores?: ConfidenceScores;
  onSubmit: (data: EquipmentData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData = {},
  confidenceScores = {},
  onSubmit,
  onCancel,
  loading = false
}) => {
  // Generate barcode automatically
  const generateBarcode = () => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CAM${timestamp.slice(-6)}${random}`;
  };

  const [formData, setFormData] = useState<EquipmentData>({
    name: '',
    brand: '',
    model: '',
    category: 'cameras',
    description: '',
    specifications: {},
    price_per_day: 0,
    security_deposit: 0,
    serial_number: '',
    barcode: generateBarcode(),
    condition: 'good',
    status: 'available',
    location: '',
    purchase_price: 0,
    current_value: 0,
    notes: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'cameras',
    'lenses',
    'lighting',
    'audio',
    'tripods',
    'accessories',
    'storage',
    'computers'
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'damaged', label: 'Damaged' }
  ];


  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Equipment name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (formData.price_per_day < 0) {
      newErrors.price_per_day = 'Price per day must be positive';
    }

    if (formData.security_deposit < 0) {
      newErrors.security_deposit = 'Security deposit must be positive';
    }

    setErrors(newErrors);
  }, [formData]);

  const updateField = (field: keyof EquipmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (Object.keys(errors).length === 0) {
      onSubmit(formData);
    }
  };

  const getConfidenceIndicator = (field: string) => {
    const confidence = confidenceScores?.[field];
    if (confidence && confidence > 0.7) {
      return (
        <div className="flex items-center text-accent" title={`AI confidence: ${Math.round(confidence * 100)}%`}>
          <Check size={16} weight="fill" />
        </div>
      );
    }
    return null;
  };

  const CustomDropdown: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[] | string[];
    placeholder?: string;
    field?: string;
    error?: string;
  }> = ({ value, onChange, options, placeholder, field, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const normalizedOptions = options.map(opt => 
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`input-primary w-full flex justify-between items-center ${
            error ? 'border-red-500' : ''
          }`}
        >
          <span className={selectedOption ? 'text-primary' : 'text-gray-medium'}>
            {selectedOption?.label || placeholder || 'Select...'}
          </span>
          <div className="flex items-center gap-2">
            {field && getConfidenceIndicator(field)}
            <CaretDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-gray-light rounded-input shadow-lg z-10 max-h-48 overflow-y-auto">
            {normalizedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-light transition-colors first:rounded-t-input last:rounded-b-input"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FormField: React.FC<{
    label: string;
    field: keyof EquipmentData;
    type?: 'text' | 'number' | 'textarea';
    required?: boolean;
    children?: React.ReactNode;
  }> = ({ label, field, type = 'text', required = false, children }) => {
    const error = errors[field as string];
    const fieldName = field as string;
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-primary font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {getConfidenceIndicator(fieldName)}
        </div>
        
        {children || (
          type === 'textarea' ? (
            <textarea
              value={formData[field] as string}
              onChange={(e) => updateField(field, e.target.value)}
              className={`input-primary w-full min-h-[80px] ${error ? 'border-red-500' : ''}`}
              rows={3}
            />
          ) : (
            <input
              type={type}
              value={formData[field] as string | number}
              onChange={(e) => updateField(field, type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
              className={`input-primary w-full ${error ? 'border-red-500' : ''}`}
            />
          )
        )}
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Equipment ID Section */}
      <section className="space-y-4">
        <h3 className="font-heading font-semibold text-primary text-lg border-b border-gray-light pb-2">
          Equipment Identification
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField label="Equipment Name" field="name" required />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Brand" field="brand" required />
            <FormField label="Model" field="model" required />
          </div>
          
          <FormField label="Category" field="category" required>
            <CustomDropdown
              value={formData.category}
              onChange={(value) => updateField('category', value)}
              options={categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))}
              field="category"
            />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Serial Number" field="serial_number" />
            <FormField label="Barcode" field="barcode" />
          </div>
        </div>
      </section>

      {/* Condition Section */}
      <section className="space-y-4">
        <h3 className="font-heading font-semibold text-primary text-lg border-b border-gray-light pb-2">
          Condition & Notes
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Condition" field="condition" required>
            <CustomDropdown
              value={formData.condition}
              onChange={(value) => updateField('condition', value)}
              options={conditions}
              field="condition"
            />
          </FormField>
          
        </div>
        
        <FormField label="Notes" field="notes" type="textarea" />
      </section>

      {/* Specifications Section */}
      <section className="space-y-4">
        <h3 className="font-heading font-semibold text-primary text-lg border-b border-gray-light pb-2">
          Specifications
        </h3>
        
        <FormField label="Description" field="description" type="textarea" />
        
        {/* TODO: Dynamic specifications based on category */}
        <div className="bg-gray-light rounded-card p-4">
          <p className="text-gray-medium text-sm">
            Additional specifications will be populated based on the equipment category and AI extraction.
          </p>
        </div>
      </section>

      {/* Financial Section */}
      <section className="space-y-4">
        <h3 className="font-heading font-semibold text-primary text-lg border-b border-gray-light pb-2">
          Financial Information
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Purchase Price (₹)" field="purchase_price" type="number" />
          <FormField label="Current Value (₹)" field="current_value" type="number" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Daily Rate (₹)" field="price_per_day" type="number" />
          <FormField label="Security Deposit (₹)" field="security_deposit" type="number" />
        </div>
      </section>

      {/* Location Section */}
      <section className="space-y-4">
        <h3 className="font-heading font-semibold text-primary text-lg border-b border-gray-light pb-2">
          Location
        </h3>
        
        <FormField label="Storage Location" field="location" />
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
          disabled={loading}
        >
          <X size={16} />
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={loading || Object.keys(errors).length > 0}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Equipment'}
        </button>
      </div>
    </form>
  );
};

export default EquipmentForm;