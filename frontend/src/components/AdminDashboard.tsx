
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import apiService from '../services/apiService';
import CmsModal from './CmsModal';
import CmsForm from './CmsForm';

const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.titleColor || '#333'};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.textSecondary || '#666'};
    font-size: 1.1rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.background || '#fff'};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textSecondary || '#888'};
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  span {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.primary || '#722f37'};
  }
`;

const Section = styled.section`
  background: ${({ theme }) => theme.background || '#fff'};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.titleColor || '#333'};
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Item = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor || '#eee'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const buttonStyles = css`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddButton = styled.button`
  ${buttonStyles}
  background: linear-gradient(45deg, ${({ theme }) => theme.primary || '#722f37'}, ${({ theme }) => theme.buttonHover || '#8b3a42'});
  color: ${({ theme }) => theme.buttonText || 'white'};
  box-shadow: 0 4px 15px 0 rgba(114, 47, 55, 0.5);

  &:hover {
    background: linear-gradient(45deg, ${({ theme }) => theme.buttonHover || '#8b3a42'}, ${({ theme }) => theme.primary || '#722f37'});
    transform: translateY(-3px);
    box-shadow: 0 6px 20px 0 rgba(114, 47, 55, 0.6);
  }
`;

const EditButton = styled.button`
  ${buttonStyles}
  background-color: #ffc107;
  color: #333;

  &:hover {
    background-color: #e0a800;
  }
`;

const DeleteButton = styled.button`
  ${buttonStyles}
  background-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333;
  }
`;

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'course' | 'facility' | 'staff' | 'announcement' | 'knowledge' | null>(null);

  const { courseService, facilityService, staffService, announcementService, knowledgeBaseService } = useMemo(() => {
    return {
      courseService: apiService.createCmsService('courses'),
      facilityService: apiService.createCmsService('facilities'),
      staffService: apiService.createCmsService('staff'),
      announcementService: apiService.createCmsService('announcements'),
      knowledgeBaseService: apiService.createKnowledgeBaseService()
    };
  }, []);

  const fetchData = useCallback(async () => {
    // Add a small delay to ensure the auth token is set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      setLoading(true);
      const [coursesData, facilitiesData, staffData, announcementsData, knowledgeData] = await Promise.all([
        courseService.getAll(),
        facilityService.getAll(),
        staffService.getAll(),
        announcementService.getAll(),
        knowledgeBaseService.getAll()
      ]);
      setCourses(coursesData);
      setFacilities(facilitiesData);
      setStaff(staffData);
      setAnnouncements(announcementsData);
      setKnowledgeBase(knowledgeData);
    } catch (err) {
      setError('Failed to fetch data. Please make sure you are logged in as an admin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseService, facilityService, staffService, announcementService, knowledgeBaseService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (type: 'course' | 'facility' | 'staff' | 'announcement' | 'knowledge', item: any = null) => {
    setModalType(type);
    setEditingItem(item || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setModalType(null);
  };

  const handleSave = async (item: any) => {
    try {
      if (modalType === 'course') {
        item.id ? await courseService.update(item.id, item) : await courseService.create(item);
      } else if (modalType === 'facility') {
        item.id ? await facilityService.update(item.id, item) : await facilityService.create(item);
      } else if (modalType === 'staff') {
        item.id ? await staffService.update(item.id, item) : await staffService.create(item);
      } else if (modalType === 'announcement') {
        item.id ? await announcementService.update(item.id, item) : await announcementService.create(item);
      }
       else if (modalType === 'knowledge') {
        item.id ? await knowledgeBaseService.update(item.id, item) : await knowledgeBaseService.create(item);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save item", error);
    }
  };

  const handleDelete = async (type: 'course' | 'facility' | 'staff' | 'announcement' | 'knowledge', id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        switch (type) {
          case 'course':
            await courseService.delete(id);
            break;
          case 'facility':
            await facilityService.delete(id);
            break;
          case 'staff':
            await staffService.delete(id);
            break;
          case 'announcement':
            await announcementService.delete(id);
            break;
          case 'knowledge':
            await knowledgeBaseService.delete(id);
            break;
        }
        // After a successful deletion, refetch all the data to ensure the UI is in sync
        await fetchData();
      } catch (error) {
        console.error("Failed to delete item", error);
      }
    }
  };

  const getFieldsForType = (type: 'course' | 'facility' | 'staff' | 'announcement' | 'knowledge') => {
    switch (type) {
      case 'course':
        return ['name', 'dean', 'time', 'tuition', 'credits', 'description', 'prerequisites'];
      case 'facility':
        return ['name', 'manager', 'location', 'hours', 'capacity', 'booking_fee', 'amenities', 'description', 'contact', 'phone', 'services', 'rules', 'requirements', 'latitude', 'longitude'];
      case 'staff':
        return ['name', 'position', 'department', 'email', 'phone', 'education', 'experience', 'specialization', 'office_hours', 'office_location', 'profile_picture', 'bio', 'achievements'];
      case 'announcement':
        return ['title', 'content'];
      case 'knowledge':
        return ['category', 'question', 'answer'];
      default:
        return [];
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <DashboardContainer>
      <Header>
        <h1>Admin Dashboard</h1>
        <p>Manage all school-related data from this central hub.</p>
      </Header>
      
      <StatsContainer>
        <StatCard>
          <h3>Total Courses</h3>
          <span>{courses.length}</span>
        </StatCard>
        <StatCard>
          <h3>Total Facilities</h3>
          <span>{facilities.length}</span>
        </StatCard>
        <StatCard>
          <h3>Total Staff</h3>
          <span>{staff.length}</span>
        </StatCard>
        <StatCard>
          <h3>Total Announcements</h3>
          <span>{announcements.length}</span>
        </StatCard>
        <StatCard>
          <h3>Knowledge Items</h3>
          <span>{knowledgeBase.length}</span>
        </StatCard>
      </StatsContainer>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Announcements</SectionTitle>
          <AddButton onClick={() => handleOpenModal('announcement')}>+ Add Announcement</AddButton>
        </SectionHeader>
        <ItemList>
          {announcements.map(announcement => (
            <Item key={announcement.id}>
              {announcement.title}
              <ActionButtons>
                <EditButton onClick={() => handleOpenModal('announcement', announcement)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete('announcement', announcement.id)}>Delete</DeleteButton>
              </ActionButtons>
            </Item>
          ))}
        </ItemList>
      </Section>
      
      <Section>
        <SectionHeader>
          <SectionTitle>Courses</SectionTitle>
          <AddButton onClick={() => handleOpenModal('course')}>+ Add Course</AddButton>
        </SectionHeader>
        <ItemList>
          {courses.map(course => (
            <Item key={course.id}>
              {course.name}
              <ActionButtons>
                <EditButton onClick={() => handleOpenModal('course', course)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete('course', course.id)}>Delete</DeleteButton>
              </ActionButtons>
            </Item>
          ))}
        </ItemList>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Facilities</SectionTitle>
          <AddButton onClick={() => handleOpenModal('facility')}>+ Add Facility</AddButton>
        </SectionHeader>
        <ItemList>
          {facilities.map(facility => (
            <Item key={facility.id}>
              {facility.name}
              <ActionButtons>
                <EditButton onClick={() => handleOpenModal('facility', facility)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete('facility', facility.id)}>Delete</DeleteButton>
              </ActionButtons>
            </Item>
          ))}
        </ItemList>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Staff</SectionTitle>
          <AddButton onClick={() => handleOpenModal('staff')}>+ Add Staff</AddButton>
        </SectionHeader>
        <ItemList>
          {staff.map(member => (
            <Item key={member.id}>
              {member.name} - {member.position}
              <ActionButtons>
                <EditButton onClick={() => handleOpenModal('staff', member)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete('staff', member.id)}>Delete</DeleteButton>
              </ActionButtons>
            </Item>
          ))}
        </ItemList>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Knowledge Base</SectionTitle>
          <AddButton onClick={() => handleOpenModal('knowledge')}>+ Add Knowledge</AddButton>
        </SectionHeader>
        <ItemList>
          {knowledgeBase.map(item => (
            <Item key={item.id}>
              {item.question}
              <ActionButtons>
                <EditButton onClick={() => handleOpenModal('knowledge', item)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete('knowledge', item.id)}>Delete</DeleteButton>
              </ActionButtons>
            </Item>
          ))}
        </ItemList>
      </Section>

      <CmsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem?.id ? `Edit ${modalType}` : `Add ${modalType}`}
      >
        {modalType && (
          <CmsForm
            item={editingItem}
            fields={getFieldsForType(modalType)}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        )}
      </CmsModal>
    </DashboardContainer>
  );
};

export default AdminDashboard;
