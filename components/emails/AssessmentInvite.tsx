// components/emails/AssessmentInvite.tsx
import { Button, Container, Head, Html, Preview, Section, Text } from '@react-email/components';

interface AssessmentInviteProps {
  candidateName: string;
  assessmentUrl: string;
  companyName?: string;
}

export default function AssessmentInvite({
  candidateName = "there",
  assessmentUrl,
  companyName = "Your Company",
}: AssessmentInviteProps) {
  return (
    <Html>
      <Head />
      <Preview>You're invited to take an assessment</Preview>
      <Container>
        <Section>
          <Text>Hi {candidateName},</Text>
          <Text>
            You've been invited to complete an assessment for <strong>{companyName}</strong>.
          </Text>
          
          <Button
            href={assessmentUrl}
            style={{
              background: '#000',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '6px',
            }}
          >
            Start Assessment
          </Button>

          <Text>
            This link is unique to you and will expire in 48 hours.
          </Text>
        </Section>
      </Container>
    </Html>
  );
}