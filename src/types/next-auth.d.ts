import NextAuth, { DefaultSession } from 'next-auth'

<<<<<<< HEAD
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            firstName: string;
            lastName: string;
            gender?: string;
            contactNo?: string;
            profilePicture?: string;
            isAdmin?: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        name: string;
        email: string;
        firstName: string;
        lastName: string;
        gender?: string;
        contactNo?: string;
        profilePicture?: string;
        isAdmin?: boolean;
    }
=======
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      gender?: string
      contactNo?: string
      profilePicture?: string
      firstName?: string
      lastName?: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    name: string
    email: string
    gender?: string
    contactNo?: string
    profilePicture?: string
    firstName?: string
    lastName?: string
  }
>>>>>>> d75bcd9293ca6db9529c0693c8974eb8790a1f8d
}
