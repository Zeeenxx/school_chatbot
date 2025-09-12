
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.inputText};
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.inputText};
  min-height: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  &.primary {
    background-color: ${({ theme }) => theme.primary};
    color: white;
  }
  &.secondary {
    background-color: ${({ theme }) => theme.secondary || '#ccc'};
  }
`;

interface CmsFormProps {
  item: any;
  fields: string[];
  onSave: (item: any) => void;
  onCancel: () => void;
}

const CmsForm: React.FC<CmsFormProps> = ({ item, fields, onSave, onCancel }) => {
  const [formData, setFormData] = useState(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {fields.map(field => (
        <FormGroup key={field}>
          <Label htmlFor={field}>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
          {field.includes('description') || field.includes('bio') ? (
            <TextArea
              id={field}
              name={field}
              value={formData[field] || ''}
              onChange={handleChange}
            />
          ) : (
            <Input
              id={field}
              name={field}
              type="text"
              value={formData[field] || ''}
              onChange={handleChange}
            />
          )}
        </FormGroup>
      ))}
      <ButtonContainer>
        <Button type="button" className="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="primary">Save</Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default CmsForm;
