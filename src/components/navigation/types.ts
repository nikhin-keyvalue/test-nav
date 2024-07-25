import { UserDetails } from '@/components/user-details/types';

export interface NavBarProps {
  dynamicFilterSubMenu?: React.ReactNode;
  user: UserDetails;
}
