import NextAuth, { DefaultSession } from "next-auth";

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
}
