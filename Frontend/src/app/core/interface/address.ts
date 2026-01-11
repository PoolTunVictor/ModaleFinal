export interface Address {
  id: number;
  receiver_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  references?: string;
  is_default: boolean;
}