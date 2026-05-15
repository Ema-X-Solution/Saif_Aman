export interface AuthSession {
  email: string;
  name: string;
  role: "admin";
  token: string;
  remember: boolean;
}
