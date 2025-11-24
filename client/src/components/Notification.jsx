import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] animate-slide-up ${type === 'success'
                ? 'bg-white border-green-500 text-green-700'
                : 'bg-white border-red-500 text-red-700'
            }`}>
            {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="flex-1 font-medium text-sm">{message}</p>
            <button onClick={onClose} className="opacity-50 hover:opacity-100">
                <X size={16} />
            </button>
        </div>
    );
};

export default Notification;
