import React from 'react';

import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  remainingTime: number;
  stats: {
    total: number;
    answered: number;
    marked: number;
  };
}

const SubmitDialog: React.FC<SubmitDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  remainingTime,
  stats,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          Are you sure you want to submit the test?
        </h3>
        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-700">
              <Clock className="h-4 w-4" />
              Remaining Time:
            </span>
            <span className="font-mono font-bold text-gray-900">
              {formatTime(remainingTime)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Total Questions:</span>
            <span className="font-bold text-gray-900">{stats.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Questions Answered:</span>
            <span className="font-bold text-green-600">{stats.answered}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Marked for review:</span>
            <span className="font-bold text-purple-600">{stats.marked}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-[#177A9C] py-3 text-sm font-medium text-white hover:bg-[#177A9C]/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitDialog;
