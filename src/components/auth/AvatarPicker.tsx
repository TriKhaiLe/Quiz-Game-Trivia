import React from 'react';
import { avatarIds, Avatars } from '../../icons/Avatars';

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatarId: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div className="grid grid-cols-5 gap-3 bg-slate-700/50 p-3 rounded-lg">
      {avatarIds.map((id) => {
        const AvatarComponent = Avatars[id];
        const isSelected = selectedAvatar === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelectAvatar(id)}
            className={`rounded-full p-1 transition-all duration-200 ${
              isSelected
                ? 'bg-indigo-500 ring-2 ring-indigo-300'
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
          >
            <AvatarComponent className="w-full h-full" />
          </button>
        );
      })}
    </div>
  );
};

export default AvatarPicker;
