import { BASE_URL } from '@/constants/url';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
} from '@react-email/components';

const WelcomeEmail = ({ username }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Header Section with Handshake Icon */}
        <Section style={headerSection}>
          <Img
            src={`${BASE_URL}/logo.png`}
            width="200"
            height="200"
            alt="Link My Logistics"
          />
        </Section>

        {/* Content Section */}
        <Section style={contentSection}>
          <Text style={paragraph}>
            <strong>Welcome {username}!</strong> Glad to have you onboard with us.
          </Text>

          <Text style={paragraph}>
            Reach out to us at any time using Support Page.
          </Text>

          <Text style={paragraph}>
            Head over to your services,
          </Text>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={`${BASE_URL}/customer/cfs/services`}>
              CFS Services
            </Button>
          </Section>
        </Section>

        {/* Team Signature */}
        <Section style={signatureSection}>
          <Text style={signature}>
            Team Link My Logistics
          </Text>
        </Section>
      </Container>

      {/* Footer */}
      <Section style={footerSection}>
        <Text style={brandName}>
          <span style={brandBadge}>LML</span>
        </Text>
        <Text style={copyright}>
          © Copyright SKZ Tech
        </Text>
      </Section>
    </Body>
  </Html>
);

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  padding: '20px',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  margin: '0 auto',
  maxWidth: '600px',
  overflow: 'hidden',
};

const headerSection = {
  backgroundColor: '#4a5568',
  padding: '48px 32px',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentSection = {
  padding: '32px',
};

const paragraph = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  textAlign: 'left',
};

const buttonSection = {
  margin: '32px 0 16px 0',
  textAlign: 'left',
};

const button = {
  backgroundColor: '#48bb78',
  borderRadius: '4px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '500',
  padding: '12px 32px',
  textDecoration: 'none',
  textAlign: 'center',
};

const signatureSection = {
  padding: '0 32px 32px 32px',
};

const signature = {
  color: '#718096',
  fontSize: '16px',
  margin: '0',
  textAlign: 'left',
};

const footerSection = {
  padding: '32px',
  textAlign: 'center',
};

const brandName = {
  color: '#a0aec0',
  fontSize: '24px',
  fontWeight: '300',
  margin: '0 0 8px 0',
  textAlign: 'center',
};

const brandBadge = {
  backgroundColor: '#a0aec0',
  borderRadius: '2px',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '500',
  marginLeft: '4px',
  padding: '2px 4px',
};

const copyright = {
  color: '#a0aec0',
  fontSize: '12px',
  margin: '0',
  textAlign: 'center',
};
