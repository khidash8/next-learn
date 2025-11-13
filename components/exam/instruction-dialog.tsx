'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText } from 'lucide-react';

interface InstructionsDialogProps {
  instruction: string;
}

const InstructionsDialog: React.FC<InstructionsDialogProps> = ({
  instruction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          View Instructions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exam Instructions</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-w-none">
          <div
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: instruction }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
