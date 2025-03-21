
export interface NotificationProps {
  id: string;
  type: 'message' | 'review' | 'business' | 'follower' | 'like';
  content: string;
  time: string;
  read: boolean;
}
