export interface User {
  uid: string;
  email: string | null;
  name: string | null;
}

export interface UserContextValue {
  user: User | null;
  loading: boolean;
}
