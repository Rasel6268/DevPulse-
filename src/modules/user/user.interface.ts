export interface IUser {
  id?: number; 
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer"; 
}
export interface loginData {
  email: string;
  password: string;
}