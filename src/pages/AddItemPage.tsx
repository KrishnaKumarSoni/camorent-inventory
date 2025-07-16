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
            onClick={() => {
              const sampleText = "This is a Canon camera, the R5 model I think. Got it from some dealer last year. Condition looks good, working fine but has some scratches on the body. Don't know the exact serial number... will check later. We keep it somewhere in the back warehouse. Pretty expensive camera, should rent for good money.";
              console.log('Using sample text:', sampleText);
              
              // Create a mock audio blob with the sample text
              const blob = new Blob([sampleText], { type: 'audio/webm' });
              setAudioBlob(blob);
              setPageState('processing');
            }}
            style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            🧪 Use Sample Data (for testing)
          </button>

          {/* Speaking Prompts */}
          <div style={{textAlign: 'left', marginBottom: '20px'}}>
            <p style={{fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>
              💡 What to mention when recording:
            </p>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center'}}>
              {[
                'Equipment name & brand',
                'Model number', 
                'Serial number',
                'Condition',
                'Purchase price',
                'Current value',
                'Daily rate',
                'Storage location',
                'Any issues or notes'
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