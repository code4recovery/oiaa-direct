import { Button, Link } from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getServiceProviderNameFromUrl } from '../utils/videoServices';

type JoinMeetingButtonProps = {
  joinUrl: string;
};

const JoinMeetingButton = ({ joinUrl }: JoinMeetingButtonProps) => {
  const provider = getServiceProviderNameFromUrl(joinUrl);
  const label = provider ? `Join ${provider} Meeting` : 'Join Meeting';

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
        <FaExternalLinkAlt style={{ marginRight: '8px' }} />
        {label}
      </Button>
    </Link>
  );
};

export default JoinMeetingButton;