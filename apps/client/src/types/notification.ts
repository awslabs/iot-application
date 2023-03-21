import type { FlashbarProps } from '@cloudscape-design/components/flashbar';
import type { SetRequired } from 'type-fest';

type FlashbarItem = FlashbarProps['items'][number];

// ID made required as it is utilized in notification features
export type Notification = SetRequired<FlashbarItem, 'id'>;
