import React from 'react';

const Legends = () => {
  return (
    <div className="mb-6 space-y-3 border-t pt-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-green-500"></div>
        <span className="text-sm text-gray-700">Attended</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-red-500"></div>
        <span className="text-sm text-gray-700">Not Attended</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-purple-500"></div>
        <span className="text-sm text-gray-700">Marked for Review</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-purple-700"></div>
        <span className="text-sm text-gray-700">Answered and Marked</span>
      </div>
    </div>
  );
};
export default Legends;
