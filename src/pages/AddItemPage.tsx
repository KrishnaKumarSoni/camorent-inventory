import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import VoiceRecorder from '../components/VoiceRecorder';
import ProcessingModal from '../components/ProcessingModal';
import EquipmentForm from '../components/EquipmentForm';

type PageState = 'recording' | 'processing' | 'form';

const AddItemPage: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('recording');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [confidenceScores, setConfidenceScores] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setPageState('processing');
  };

  const handleProcessingComplete = (result: any) => {
    console.log('Processing complete, result:', result);
    setExtractedData(result.formData || result);
    setConfidenceScores(result.confidenceScores);
    setPageState('form');
  };

  const handleProcessingCancel = () => {
    setPageState('recording');
    setAudioBlob(null);
    setExtractedData(null);
    setConfidenceScores(null);
  };

  const handleFormSubmit = async (formData: any) => {
    setSaving(true);
    try {
      const { user } = useAuth();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Save to Firebase via API endpoint
      const response = await api.createInventoryItem({
        ...formData,
        created_by: user.uid
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to save equipment');
      }

      console.log('Equipment saved successfully:', response.data);
      
      // Navigate to inventory page after successful save
      navigate('/inventory');
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Failed to save equipment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFormCancel = () => {
    setPageState('recording');
    setAudioBlob(null);
    setExtractedData(null);
    setConfidenceScores(null);
  };

  if (pageState === 'form') {
    console.log('Rendering form with data:', extractedData, 'confidence:', confidenceScores);
    return (
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-primary text-2xl mb-2">
            Review & Save Equipment
          </h2>
          <p className="text-gray-medium">
            Verify details and add to digital inventory
          </p>
        </div>

        <EquipmentForm
          initialData={extractedData}
          confidenceScores={confidenceScores}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={saving}
        />
      </div>
    );
  }

  return (
    <>
      <div style={{padding: '0', minHeight: '400px'}}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '12px',
            lineHeight: '1.2'
          }}>
            Add New Item
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.5',
            margin: '0 0 20px 0'
          }}>
            Record equipment details to add to your inventory
          </p>
          
          {/* Sample Text Button */}
          <button
            onClick={async () => {
              const sampleText = "I have a Sony FX6 professional cinema camera here, serial number SNY789456123. It's a full-frame camera in excellent condition, bought for 450000 rupees last month. Current market value is around 420000 rupees. We can rent it for 3500 rupees per day with a security deposit of 50000 rupees. It's stored in our main equipment room, section B, shelf 2. The camera shoots amazing 4K footage and has dual base ISO. No issues with it so far.";
              console.log('Processing sample text with real workflow:', sampleText);
              
              try {
                setPageState('processing');
                
                // Use real text processing API instead of mock
                const response = await api.processText(sampleText);
                
                if (!response.success) {
                  throw new Error(response.error || 'Text processing failed');
                }
                
                // Handle the result the same way as voice processing
                handleProcessingComplete({
                  formData: {
                    name: response.data.name || "Equipment Item",
                    brand: response.data.brand || "",
                    model: response.data.model || "", 
                    category: response.data.category || "cameras",
                    description: response.data.description || "Equipment recorded via text",
                    serial_number: response.data.serialNumber || "",
                    condition: response.data.condition || "good",
                    purchase_price: response.data.purchasePrice || 0,
                    current_value: response.data.currentValue || 0,
                    price_per_day: response.data.pricePerDay || 0,
                    location: response.data.location || "",
                    notes: response.data.notes || "Processed via text input",
                    specifications: response.data.specifications || {},
                    barcode: response.data.barcode || "",
                    security_deposit: response.data.securityDeposit || 0,
                    image_url: response.data.image_url || ""
                  },
                  confidenceScores: response.data.confidence_scores || {}
                });
              } catch (error) {
                console.error('Sample text processing failed:', error);
                alert('Sample text processing failed. Please try again.');
                setPageState('recording');
              }
            }}
            style={{
              backgroundColor: '#e0f2fe',
              border: '1px solid #0288d1',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#01579b',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            🧪 Process Sample Text (Real AI)
          </button>

          {/* Speaking Prompts */}
          <div style={{textAlign: 'left', marginBottom: '20px'}}>
            <p style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
              💡 What to mention when recording:
            </p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center'}}>
              {[
                'Canon EOS R5 camera',
                'Model R5, serial CAN123456', 
                'Good condition, minor scratches',
                'Bought for ₹2.5 lakhs',
                'Current value ₹2.2 lakhs',
                'Rent ₹2000/day',
                'Stored in section A-3',
                'Works perfectly, includes battery'
              ].map((prompt, index) => (
                <span key={index} style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  border: '1px solid #fbbf24'
                }}>
                  {prompt}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '24px',
          padding: '32px 24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}>
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            onCancel={() => navigate('/inventory')}
          />
        </div>
      </div>

      <ProcessingModal
        isOpen={pageState === 'processing'}
        onCancel={handleProcessingCancel}
        onComplete={handleProcessingComplete}
        audioBlob={audioBlob}
      />
    </>
  );
};

export default AddItemPage;