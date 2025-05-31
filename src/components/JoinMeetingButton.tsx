import { Box, Button, Flex, Link, Stack, Text } from '@chakra-ui/react';
import { getServiceProviderNameFromUrl } from '../utils/videoServices';

import {
  FaVideo,
  FaGoogle,
  FaSkype,
  FaMicrosoft,
  FaDiscord,
  FaPhone,
  FaUsers,
  FaCamera,
  FaGlobe,
} from 'react-icons/fa';
import { SiZoom, SiWebex, SiZoho, SiJitsi } from 'react-icons/si';

export const providerIcons: Record<string, React.ReactElement> = {
  Zoom: <SiZoom />,
  'Google Meet': <FaGoogle />,
  Skype: <FaSkype />,
  'Microsoft Teams': <FaMicrosoft />,
  Discord: <FaDiscord />,
  Signal: <FaPhone />,
  WebEx: <SiWebex />,
  Zoho: <SiZoho />,
  Jitsi: <SiJitsi />,
  'Free Conference': <FaPhone />,
  FreeConferenceCall: <FaPhone />,
  GoTo: <FaUsers />,
  BlueJeans: <FaCamera />,
  'Virtual Reality': <FaGlobe />,
};

const JoinMeetingButton = ({ joinUrl }: { joinUrl: string }) => {
  const provider = getServiceProviderNameFromUrl(joinUrl);
  const label = provider ? `Join ${provider} Meeting` : 'Join Meeting';
  const icon = providerIcons[provider] || <FaVideo />;

  return (
    <Link
      href={joinUrl}
      target="_blank"
      rel="noopener noreferrer"
      _hover={{ textDecoration: 'none' }}
    >
      <Button
        bg="blue.700"
        color="white"
        size="md"
        width="full"
        _hover={{ bg: 'blue.800' }}
      >
        <Flex align="center" gap={4}>
            <Box as="span">{icon}</Box>
            <Text as="span">{label}</Text>
        </Flex>
      </Button>
    </Link>
  );
};

export default JoinMeetingButton;