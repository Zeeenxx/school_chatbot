
import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.background};
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border: 1px solid ${({ theme }) => theme.border};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.primary || '#722f37'};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  color: white;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  transition: color 0.2s ease;
  line-height: 1;

  &:hover {
    color: white;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
`;

interface CmsModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CmsModal: React.FC<CmsModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CmsModal;
