import React, { useState, useEffect } from 'react';
import { X, Check, CircleNotch } from 'phosphor-react';
import { api } from '../utils/api';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProcessingModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onComplete: (data: any) => void;
  audioBlob: Blob | null;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  onCancel,
  onComplete,
  audioBlob
}) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'transcription',
      title: 'Converting Speech',
      description: 'Transcribing audio to text using AI',
      status: 'pending'
    },
    {
      id: 'extraction',
      title: 'Understanding Equipment',
      description: 'Extracting equipment details from description',
      status: 'pending'
    },
    {
      id: 'research',
      title: 'Researching Specifications',
      description: 'Browsing: amazon.in, flipkart.com, manufacturer sites',
      status: 'pending'
    },
    {
      id: 'preparation',
      title: 'Preparing Form',
      description: 'Organizing data for review',
      status: 'pending'
    }
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && audioBlob) {
      startProcessing();
    }
  }, [isOpen, audioBlob]);

  const updateStepStatus = (stepId: string, status: ProcessingStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const startProcessing = async () => {
    try {
      // Reset state
      setProcessingComplete(false);
      setProcessingError(null);
      setCurrentStepIndex(0);
      
      if (!audioBlob) {
        throw new Error('No audio data available');
      }

      // Call the API once and let it handle all the processing
      updateStepStatus('transcription', 'processing');
      setCurrentStepIndex(0);
      
      // Check if this is a test/dummy blob
      const isDummyBlob = audioBlob.size <= 20; // Dummy blob is very small
      
      let response;
      if (isDummyBlob) {
        // Use sample data for testing
        response = await fetch('/api/process-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sample: true }),
        });
      } else {
        // Send the actual audio blob to the API
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        
        response = await fetch('/api/process-audio', {
          method: 'POST',
          body: formData,
        });
      }
      
      const result = await response.json();
      
      if (result.processing_status === 'error') {
        throw new Error(result.error || 'Processing failed');
      }

      // Mark all steps as completed immediately
      updateStepStatus('transcription', 'completed');
      updateStepStatus('extraction', 'completed');
      updateStepStatus('research', 'completed');
      updateStepStatus('preparation', 'completed');
      setCurrentStepIndex(3);
      setProcessingComplete(true);
      
      // Transform API response to form data structure
      // The API returns data directly in the result object
      const extractedEquipment = result;
      const confidenceScores = result.confidence_scores || {};
      
      // Complete immediately - no more fake delays
      onComplete({
        formData: {
          name: extractedEquipment.name || "Equipment Item",
          brand: extractedEquipment.brand || "",
          model: extractedEquipment.model || "", 
          category: extractedEquipment.category || "cameras",
          description: extractedEquipment.description || "Equipment recorded via voice",
          serial_number: extractedEquipment.serialNumber || "",
          condition: extractedEquipment.condition || "good",
          purchase_price: extractedEquipment.purchasePrice || 0,
          current_value: extractedEquipment.currentValue || 0,
          price_per_day: extractedEquipment.pricePerDay || 0,
          location: extractedEquipment.location || "",
          notes: extractedEquipment.notes || "Recorded via voice",
          specifications: extractedEquipment.specifications || {},
          barcode: extractedEquipment.barcode || "",
          security_deposit: extractedEquipment.securityDeposit || 0,
          image_url: extractedEquipment.image_url || ""
        },
        confidenceScores: confidenceScores
      });

    } catch (error) {
      console.error('Processing error:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error occurred');
      
      // Mark current step as error
      const currentStep = steps[currentStepIndex];
      if (currentStep) {
        updateStepStatus(currentStep.id, 'error');
      }
    }
  };

  const handleRetry = () => {
    // Reset all steps to pending
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    setProcessingError(null);
    setProcessingComplete(false);
    startProcessing();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="mobile-container bg-black text-white p-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading font-bold text-white text-2xl">
            Processing Recording
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:text-gray-300 transition-colors p-2"
            disabled={processingComplete}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex-1 flex flex-col justify-center space-y-8">
          {steps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const isCompleted = step.status === 'completed';
            const isProcessing = step.status === 'processing';
            const isError = step.status === 'error';

            return (
              <div key={step.id} className="flex items-center space-x-4">
                {/* Step Icon */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-accent' : 
                    isProcessing ? 'bg-accent animate-pulse' : 
                    isError ? 'bg-red-500' :
                    'bg-gray-600'}
                `}>
                  {isCompleted ? (
                    <Check size={24} weight="bold" />
                  ) : isProcessing ? (
                    <div className="animate-spin">
                      <CircleNotch size={24} />
                    </div>
                  ) : isError ? (
                    <X size={24} weight="bold" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className={`
                    font-semibold text-lg transition-colors duration-300
                    ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}
                  `}>
                    {step.title}
                  </h3>
                  <p className={`
                    text-sm transition-colors duration-300
                    ${isActive || isCompleted ? 'text-gray-300' : 'text-gray-500'}
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Loading Animation */}
                {isProcessing && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-75"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-150"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {processingError && (
          <div className="mt-8 bg-red-500 bg-opacity-20 border border-red-500 rounded-card p-4">
            <h4 className="font-semibold text-red-400 mb-2">Processing Failed</h4>
            <p className="text-gray-300 text-sm mb-4">{processingError}</p>
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="btn-secondary text-sm"
              >
                Retry Processing
              </button>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {processingComplete && !processingError && (
          <div className="mt-8 bg-accent bg-opacity-20 border border-accent rounded-card p-4 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} weight="bold" />
            </div>
            <h4 className="font-semibold text-accent mb-2">Processing Complete!</h4>
            <p className="text-gray-300 text-sm">
              Your equipment data has been extracted and is ready for review.
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-accent">
              {Math.round(((currentStepIndex + (processingComplete ? 1 : 0)) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStepIndex + (processingComplete ? 1 : 0)) / steps.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;