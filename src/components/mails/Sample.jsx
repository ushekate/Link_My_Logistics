import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
  Row,
  Column,
  Hr,
} from '@react-email/components';

const ServiceRequestEmail = ({
  requestId = "SR-2024-001",
  customerName = "John Doe",
  customerEmail = "john.doe@company.com",
  customerPhone = "+1 (555) 123-4567",
  serviceType = "IT Support",
  priority = "High",
  requestDate = "July 4, 2025",
  expectedResponse = "Within 4 hours",
  description = "Computer won't start after latest Windows update. Blue screen error appears on startup. Need urgent assistance as this is affecting daily work productivity.",
  assignedTo = "Sarah Johnson",
  department = "IT Department",
  status = "Open"
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={headerSection}>
          <div style={headerContent}>
            <div style={iconContainer}>
              <svg style={serviceIcon} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Heading style={heading}>Service Request Submitted</Heading>
            <Text style={subheading}>Your request has been received and is being processed</Text>
          </div>
        </Section>

        {/* Request Summary Cards */}
        <Section style={summarySection}>
          <Row>
            <Column style={summaryColumn}>
              <div style={summaryCard}>
                <Text style={cardLabel}>Request ID</Text>
                <Text style={cardValue}>{requestId}</Text>
              </div>
            </Column>
            <Column style={summaryColumn}>
              <div style={summaryCard}>
                <Text style={cardLabel}>Service Type</Text>
                <Text style={cardValue}>{serviceType}</Text>
              </div>
            </Column>
            <Column style={summaryColumn}>
              <div style={summaryCard}>
                <Text style={cardLabel}>Priority</Text>
                <Text style={getPriorityStyle(priority)}>{priority}</Text>
              </div>
            </Column>
            <Column style={summaryColumn}>
              <div style={summaryCard}>
                <Text style={cardLabel}>Status</Text>
                <Text style={getStatusStyle(status)}>{status}</Text>
              </div>
            </Column>
          </Row>
        </Section>

        <Hr style={divider} />

        {/* Customer Information */}
        <Section style={customerSection}>
          <div style={sectionHeader}>
            <div style={sectionIconContainer}>
              <svg style={sectionIcon} viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Text style={sectionTitle}>Customer Information</Text>
          </div>
          <div style={customerContent}>
            <Row>
              <Column style={customerColumn}>
                <div style={customerInfo}>
                  <Text style={infoLabel}>Full Name</Text>
                  <Text style={infoValue}>{customerName}</Text>
                </div>
                <div style={customerInfo}>
                  <Text style={infoLabel}>Email Address</Text>
                  <Text style={infoValue}>{customerEmail}</Text>
                </div>
              </Column>
              <Column style={customerColumn}>
                <div style={customerInfo}>
                  <Text style={infoLabel}>Phone Number</Text>
                  <Text style={infoValue}>{customerPhone}</Text>
                </div>
                <div style={customerInfo}>
                  <Text style={infoLabel}>Request Date</Text>
                  <Text style={infoValue}>{requestDate}</Text>
                </div>
              </Column>
            </Row>
          </div>
        </Section>

        <Hr style={divider} />

        {/* Service Details */}
        <Section style={serviceSection}>
          <div style={sectionHeader}>
            <div style={sectionIconContainer}>
              <svg style={sectionIcon} viewBox="0 0 24 24" fill="none">
                <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9C14.3 4.5 13.7 4.5 13.3 4.9L8.7 9.5C8.3 9.9 8.3 10.5 8.7 10.9C9.1 11.3 9.7 11.3 10.1 10.9L14.7 6.3Z" fill="currentColor" />
                <path d="M9.5 14.5C9.9 14.9 10.5 14.9 10.9 14.5C11.3 14.1 11.3 13.5 10.9 13.1L6.3 8.5C5.9 8.1 5.3 8.1 4.9 8.5C4.5 8.9 4.5 9.5 4.9 9.9L9.5 14.5Z" fill="currentColor" />
                <rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Text style={sectionTitle}>Service Details</Text>
          </div>
          <div style={serviceContent}>
            <div style={serviceDetail}>
              <Text style={detailLabel}>Expected Response Time</Text>
              <Text style={detailValue}>{expectedResponse}</Text>
            </div>
            <div style={serviceDetail}>
              <Text style={detailLabel}>Assigned To</Text>
              <Text style={detailValue}>{assignedTo}</Text>
            </div>
            <div style={serviceDetail}>
              <Text style={detailLabel}>Department</Text>
              <Text style={detailValue}>{department}</Text>
            </div>
          </div>
        </Section>

        <Hr style={divider} />

        {/* Request Description */}
        <Section style={descriptionSection}>
          <div style={sectionHeader}>
            <div style={sectionIconContainer}>
              <svg style={sectionIcon} viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" />
                <path d="M16 13H8" stroke="currentColor" strokeWidth="2" />
                <path d="M16 17H8" stroke="currentColor" strokeWidth="2" />
                <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Text style={sectionTitle}>Request Description</Text>
          </div>
          <div style={descriptionContent}>
            <Text style={descriptionText}>{description}</Text>
          </div>
        </Section>

        {/* Action Buttons */}
        <Section style={actionSection}>
          <Row>
            <Column style={actionColumn}>
              <Button style={primaryButton} href="#">
                View Full Request
              </Button>
            </Column>
            <Column style={actionColumn}>
              <Button style={secondaryButton} href="#">
                Contact Support
              </Button>
            </Column>
          </Row>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerText}>
            You will receive email updates as your request progresses. If you have any questions, please don't hesitate to contact our support team.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Helper functions for dynamic styling
const getPriorityStyle = (priority) => {
  const baseStyle = {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    margin: '0',
    padding: '4px 8px',
    borderRadius: '4px',
  };

  switch (priority.toLowerCase()) {
    case 'high':
      return { ...baseStyle, backgroundColor: '#fef2f2', color: '#dc2626' };
    case 'medium':
      return { ...baseStyle, backgroundColor: '#fef3c7', color: '#d97706' };
    case 'low':
      return { ...baseStyle, backgroundColor: '#ecfdf5', color: '#059669' };
    default:
      return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const getStatusStyle = (status) => {
  const baseStyle = {
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '20px',
    margin: '0',
    padding: '4px 8px',
    borderRadius: '4px',
  };

  switch (status.toLowerCase()) {
    case 'open':
      return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1d4ed8' };
    case 'in progress':
      return { ...baseStyle, backgroundColor: '#fef3c7', color: '#d97706' };
    case 'resolved':
      return { ...baseStyle, backgroundColor: '#dcfce7', color: '#16a34a' };
    case 'closed':
      return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#6b7280' };
    default:
      return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

export default ServiceRequestEmail;

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  margin: '0 auto',
  maxWidth: '800px',
  overflow: 'hidden',
};

const headerSection = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
  padding: '40px 32px',
};

const headerContent = {
  textAlign: 'center',
};

const iconContainer = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  display: 'inline-block',
  height: '64px',
  marginBottom: '16px',
  padding: '16px',
  width: '64px',
};

const serviceIcon = {
  color: '#ffffff',
  height: '32px',
  width: '32px',
};

const heading = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '36px',
  margin: '0 0 8px 0',
  textAlign: 'center',
};

const subheading = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0',
  textAlign: 'center',
};

const summarySection = {
  padding: '32px 32px 16px 32px',
};

const summaryColumn = {
  padding: '0 8px',
  verticalAlign: 'top',
  width: '25%',
};

const summaryCard = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px 12px',
  textAlign: 'center',
};

const cardLabel = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  lineHeight: '16px',
  margin: '0 0 8px 0',
  textTransform: 'uppercase',
};

const cardValue = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '700',
  lineHeight: '20px',
  margin: '0',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '24px 32px',
};

const customerSection = {
  padding: '16px 32px',
};

const sectionHeader = {
  alignItems: 'center',
  display: 'flex',
  marginBottom: '20px',
};

const sectionIconContainer = {
  backgroundColor: '#eff6ff',
  borderRadius: '6px',
  marginRight: '12px',
  padding: '8px',
};

const sectionIcon = {
  color: '#3b82f6',
  height: '16px',
  width: '16px',
};

const sectionTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0',
};

const customerContent = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
};

const customerColumn = {
  padding: '0 10px',
  verticalAlign: 'top',
  width: '50%',
};

const customerInfo = {
  marginBottom: '16px',
};

const infoLabel = {
  color: '#64748b',
  fontSize: '13px',
  fontWeight: '500',
  lineHeight: '18px',
  margin: '0 0 4px 0',
};

const infoValue = {
  color: '#1e293b',
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '20px',
  margin: '0',
};

const serviceSection = {
  padding: '16px 32px',
};

const serviceContent = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
};

const serviceDetail = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e2e8f0',
};

const detailLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px',
  margin: '0',
};

const detailValue = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '20px',
  margin: '0',
};

const descriptionSection = {
  padding: '16px 32px',
};

const descriptionContent = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
};

const descriptionText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
};

const actionSection = {
  padding: '24px 32px',
};

const actionColumn = {
  padding: '0 8px',
  textAlign: 'center',
  width: '50%',
};

const primaryButton = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  width: '100%',
};

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  color: '#3b82f6',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '10px 24px',
  textDecoration: 'none',
  width: '100%',
};

const footerSection = {
  backgroundColor: '#f8fafc',
  padding: '24px 32px',
  textAlign: 'center',
};

const footerText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};
