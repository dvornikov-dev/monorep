export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

export interface UserInterface {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
}
