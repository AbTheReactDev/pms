import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            gender?: string;
            contactNo?: string;
            profilePicture?: string;
            firstName?: string;
            lastName?: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        name: string;
        email: string;
        gender?: string;
        contactNo?: string;
        profilePicture?: string;
        firstName?: string;
        lastName?: string;
    }
}
