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

const OrderDetailsEmail = ({
  order
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Header with gradient background */}
        <Section style={headerSection}>
          <div style={headerContent}>
            <div style={iconContainer}>
              <svg style={orderIcon} viewBox="0 0 24 24" fill="none">
                <path d="M9 11H15M9 15H15M17 3V5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5H7V3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3ZM15 5V3H9V5H15Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <Heading style={heading}>Order Details</Heading>
            <Text style={subheading}>Your order request has been placed successfully</Text>
          </div>
        </Section>

        {/* Order Information Cards */}
        <Section style={orderInfoSection}>
          <Row>
            <Column style={orderInfoColumn}>
              <div style={infoCard}>
                <Text style={cardLabel}>Order Number</Text>
                <Text style={cardValue}>{order?.id}</Text>
              </div>
            </Column>
          </Row>
        </Section>

        {
          (order?.startLocation && order?.endLocation) && (
            <Hr style={divider} />
          )
        }
        {/* Location */}
        <Section style={addressSection}>
          <Row>
            {
              order?.startLocation && (
                <Column style={addressColumn}>
                  <div style={addressCard}>
                    <div style={addressHeader}>
                      <div style={addressIconContainer}>
                        <svg style={addressIcon} viewBox="0 0 24 24" fill="none">
                          <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <Text style={addressHeading}>Start Location</Text>
                    </div>
                    <div style={addressContent}>
                      <Text style={addressText}>{order?.startLocation}</Text>
                    </div>
                  </div>
                </Column>
              )
            }
            {
              order?.endLocation && (
                <Column style={addressColumn}>
                  <div style={addressCard}>
                    <div style={addressHeader}>
                      <div style={addressIconContainer}>
                        <svg style={addressIcon} viewBox="0 0 24 24" fill="none">
                          <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2" />
                          <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <Text style={addressHeading}>End Location</Text>
                    </div>
                    <div style={addressContent}>
                      <Text style={addressText}>{order?.endLocation}</Text>
                    </div>
                  </div>
                </Column>
              )
            }
          </Row>
        </Section>

        <Hr style={divider} />

        {/* Enhanced Shipping Table */}
        <Section style={shippingTableSection}>
          <div style={tableHeader}>
            <div style={tableHeaderContent}>
              <svg style={truckIcon} viewBox="0 0 24 24" fill="none">
                <path d="M1 3H15V16H1V3Z" stroke="currentColor" strokeWidth="2" />
                <path d="M16 8H20L23 11V16H16V8Z" stroke="currentColor" strokeWidth="2" />
                <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                <path d="M5 16V12" stroke="currentColor" strokeWidth="2" />
                <path d="M11 16V12" stroke="currentColor" strokeWidth="2" />
              </svg>
              <Text style={tableHeaderText}>Order Details</Text>
            </div>
          </div>

          <table style={table}>
            <thead>
              <tr style={tableHeaderRow}>
                {
                  (order?.expand?.provider?.title || order?.expand?.cfs?.title) && (
                    <th style={tableHeaderCell}>Service Provider</th>
                  )
                }
                {
                  (order?.igmNo) && (
                    <th style={tableHeaderCell}>IGM No.</th>
                  )
                }
                {
                  (order?.itemNo) && (
                    <th style={tableHeaderCell}>Item No.</th>
                  )
                }
                {
                  (order?.blNo) && (
                    <th style={tableHeaderCell}>BL No.</th>
                  )
                }
                {
                  (order?.endDate) && (
                    <th style={tableHeaderCell}>Expected Delivery</th>
                  )
                }
              </tr>
            </thead>
            <tbody>
              <tr style={tableRow}>
                {
                  (order?.expand?.provider?.title || order?.expand?.cfs?.title) && (
                    <td style={tableCell}>
                      <div style={tableCellContent}>
                        <Text style={tableCellText}>
                          {
                            order?.expand?.provider?.title
                            || order?.expand?.cfs?.title
                          }
                        </Text>
                      </div>
                    </td>
                  )
                }
                {
                  (order?.igmNo) && (
                    <td style={tableCell}>
                      <div style={tableCellContent}>
                        <Text style={tableCellText}>{order?.igmNo}</Text>
                      </div>
                    </td>
                  )
                }
                {
                  (order?.itemNo) && (
                    <td style={tableCell}>
                      <div style={tableCellContent}>
                        <Text style={tableCellText}>{order?.itemNo}</Text>
                      </div>
                    </td>
                  )
                }
                {
                  (order?.blNo) && (
                    <td style={tableCell}>
                      <div style={tableCellContent}>
                        <Text style={tableCellText}>{order?.blNo}</Text>
                      </div>
                    </td>
                  )
                }
                {
                  (order?.endDate) && (
                    <td style={tableCell}>
                      <div style={tableCellContent}>
                        <Text style={tableCellText}>
                          {
                            new Date(order?.endDate).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          }
                        </Text>
                      </div>
                    </td>
                  )
                }
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerText}>
            Questions about your order? Contact our support team for assistance.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderDetailsEmail;

// Enhanced Styles
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

const orderIcon = {
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

const orderInfoSection = {
  padding: '32px 32px 16px 32px',
};

const orderInfoColumn = {
  padding: '0 8px',
  verticalAlign: 'top',
  width: '33.33%',
};

const infoCard = {
  backgroundColor: '#f8fafc',
  borderLeft: '4px solid #667eea',
  borderRadius: '8px',
  padding: '20px 16px',
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
  fontSize: '18px',
  fontWeight: '700',
  lineHeight: '24px',
  margin: '0',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '24px 32px',
};

const addressSection = {
  padding: '16px 32px',
};

const addressColumn = {
  padding: '0 8px',
  verticalAlign: 'top',
  width: '50%',
};

const addressCard = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
};

const addressHeader = {
  alignItems: 'center',
  display: 'flex',
  marginBottom: '12px',
};

const addressIconContainer = {
  backgroundColor: '#eff6ff',
  borderRadius: '6px',
  marginRight: '12px',
  padding: '8px',
};

const addressIcon = {
  color: '#3b82f6',
  height: '16px',
  width: '16px',
};

const addressHeading = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0',
};

const addressContent = {
  paddingLeft: '40px',
};

const addressText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 4px 0',
};

const shippingTableSection = {
  padding: '16px 32px 32px 32px',
};

const tableHeader = {
  backgroundColor: '#f1f5f9',
  borderRadius: '8px 8px 0 0',
  padding: '16px 20px',
};

const tableHeaderContent = {
  alignItems: 'center',
  display: 'flex',
};

const truckIcon = {
  color: '#3b82f6',
  height: '20px',
  marginRight: '12px',
  width: '20px',
};

const tableHeaderText = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0',
};

const table = {
  borderCollapse: 'collapse',
  width: '100%',
};

const tableHeaderRow = {
  backgroundColor: '#f8fafc',
};

const tableHeaderCell = {
  border: '1px solid #e2e8f0',
  color: '#475569',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '20px',
  padding: '16px 20px',
  textAlign: 'left',
};

const tableRow = {
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
};

const tableCell = {
  border: '1px solid #e2e8f0',
  padding: '16px 20px',
  verticalAlign: 'top',
};

const tableCellContent = {
  alignItems: 'center',
  display: 'flex',
};

const tableCellText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '20px',
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
