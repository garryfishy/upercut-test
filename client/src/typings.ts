export interface CardProps {
  name?: string;
  email?: string;
  canDelete?: boolean;
  canAdd?: boolean;
  id: string;
  refetchProfile?: () => void;
  onCheck?: (id: string) => void;
  onUncheck?: (id: string) => void;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
