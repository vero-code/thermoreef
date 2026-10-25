import { InterventionPanel } from './InterventionPanel';
import type { InterventionModalProps } from './intervention/types';

/**
 * @deprecated Replaced by InterventionPanel which renders directly within the central showcase frame.
 */
export default function InterventionModal(props: InterventionModalProps) {
  return <InterventionPanel {...props} />;
}

export { InterventionPanel };
