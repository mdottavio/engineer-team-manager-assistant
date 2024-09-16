import { DefaultUser } from "next-auth";

// Add this type declaration
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    customerId?: string;
    email: string;
    name: string;
    role: string;
    password: string;
    customerId: number;
  }
}
