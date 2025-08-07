
import React from 'react';

interface LoaderProps {
    message: string;
    onCancel?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ message, onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      <p className="mt-6 text-lg text-slate-300">{message}</p>
        {onCancel && (
          <button
              onClick={onCancel}
              className="mt-6 bg-slate-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
          >
            Hủy
        </button>
      )}
    </div>
  );
};

export default Loader;
