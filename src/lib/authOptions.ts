import User from '@/models/User'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from './mongoDB'
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          await dbConnect()
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          })

          if (!user) {
            throw new Error('No user found')
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isValid) {
            throw new Error('Invalid credentials')
          }

<<<<<<< HEAD
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        contactNo: user.contactNo,
                        gender: user.gender,
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        profilePicture: user.profilePicture
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.gender = user.gender;
                token.contactNo = user.contactNo;
                token.profilePicture = user.profilePicture;
                token.isAdmin = user.isAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.gender = token.gender as string;
                session.user.contactNo = token.contactNo as string;
                session.user.profilePicture = token.profilePicture as string;
                session.user.isAdmin = token.isAdmin as boolean;
            }
            return session;
=======
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            contactNo: user.contactNo,
            gender: user.gender,
            firstName: user?.firstName,
            lastName: user?.lastName,
            profilePicture: user.profilePicture,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
>>>>>>> d75bcd9293ca6db9529c0693c8974eb8790a1f8d
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.gender = user.gender
        token.contactNo = user.contactNo
        token.profilePicture = user.profilePicture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.contactNo = token.contactNo as string
        session.user.gender = token.gender as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.profilePicture = token.profilePicture as string
      }
      return session
    },
  },
}
