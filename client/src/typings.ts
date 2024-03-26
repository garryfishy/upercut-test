export interface CardProps {
  name?: string;
  email?: string;
  canDelete?: boolean;
  canAdd?: boolean;
  id: string; // Making id optional
  refetchProfile?: () => void; // Making refetchProfile optional
  onCheck?: (id: string) => void; // Optional callback for when the checkbox is checked
  onUncheck?: (id: string) => void; // Optional callback for when the checkbox is unchecked
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
