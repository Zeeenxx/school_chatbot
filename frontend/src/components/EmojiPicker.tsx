import React from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕'];

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      maxWidth: '300px', 
      maxHeight: '200px', 
      overflow: 'auto',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '8px',
      position: 'absolute',
      zIndex: 1000
    }}>
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect(emoji)}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            margin: '2px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;