export interface User {
  uid: string;
  email: string | null;
  name: string | null;
}

export interface UserContextValue {
  user: User | null;
  loading: boolean;
}

export interface Heist {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
}
