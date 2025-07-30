import {
  Body,
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

const ServiceRequest = ({
  request,
  service = ''
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
            <Text style={subheading}>Your request for {service} has been sent and is being processed.</Text>
          </div>
        </Section>

        {/* Request Summary Cards */}
        <Section style={summarySection}>
          <Row>
            <Column style={summaryColumn}>
              <div style={summaryCard}>
                <Text style={cardLabel}>Request ID</Text>
                <Text style={cardValue}>{request?.id}</Text>
              </div>
            </Column>
            {
              request?.expand?.service?.title && (
                <Column style={summaryColumn}>
                  <div style={summaryCard}>
                    <Text style={cardLabel}>Service</Text>
                    <Text style={cardValue}>{request?.expand?.service?.title}</Text>
                  </div>
                </Column>
              )
            }
            {
              request?.expand?.serviceType?.title && (
                <Column style={summaryColumn}>
                  <div style={summaryCard}>
                    <Text style={cardLabel}>Service Type</Text>
                    <Text style={cardValue}>{request?.expand?.serviceType?.title}</Text>
                  </div>
                </Column>
              )
            }
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
            <Text style={sectionTitle}>Order Information</Text>
          </div>
          <div style={customerContent}>
            <Row>
              <Column style={customerColumn}>
                {
                  request?.expand?.order?.id && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>Order ID</Text>
                      <Text style={infoValue}>{request?.expand?.order?.id}</Text>
                    </div>
                  )
                }
                {
                  request?.expand?.order?.startLocation && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>Start Location</Text>
                      <Text style={infoValue}>{request?.expand?.order?.startLocation}</Text>
                    </div>
                  )
                }
                {
                  request?.expand?.order?.igmNo && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>IGM No.</Text>
                      <Text style={infoValue}>{request?.expand?.order?.igmNo}</Text>
                    </div>
                  )
                }
                {
                  request?.expand?.order?.blNo && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>BL NO.</Text>
                      <Text style={infoValue}>{request?.expand?.order?.blNo}</Text>
                    </div>
                  )
                }
              </Column>
              <Column style={customerColumn}>
                {
                  request?.expand?.order?.consigneeName && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>Consignee Name</Text>
                      <Text style={infoValue}>{request?.expand?.order?.consigneeName}</Text>
                    </div>
                  )
                }
                {
                  request?.expand?.order?.endLocation && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>End Location</Text>
                      <Text style={infoValue}>{request?.expand?.order?.endLocation}</Text>
                    </div>
                  )
                }
                {
                  request?.expand?.order?.itemNo && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>Item No.</Text>
                      <Text style={infoValue}>{request?.expand?.order?.itemNo}</Text>
                    </div>
                  )
                }
                {
                  request?.expand?.order?.status && (
                    <div style={customerInfo}>
                      <Text style={infoLabel}>Status</Text>
                      <Text style={infoValue}>{request?.expand?.order?.status}</Text>
                    </div>
                  )
                }
              </Column>
            </Row>
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
            <Text style={descriptionText}>{request?.customerRemarks}</Text>
          </div>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerText}>
            You will receive updates on your notifications panel as your request progresses. If you have any questions, please don't hesitate to contact our support team.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);


export default ServiceRequest;

// Helper functions for dynamic styling
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
    case 'Pending':
      return { ...baseStyle, backgroundColor: '#fef3c7', color: '#d97706' };
    default:
      return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#374151' };
  }
};
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
