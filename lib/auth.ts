import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          await connectToDatabase();
          
          console.log("Attempting to find user with email:", credentials.email);
          
          // Find user and explicitly select password field
          const user = await User.findOne({ email: credentials.email }).select('+password');

          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null;
          }

          console.log("User found:", user.email);
          console.log("Attempting password comparison...");
          
          // Compare the plain text password with the hashed password
          const isValid = await bcrypt.compare(credentials.password, user.password);

          console.log("Password comparison result:", isValid);

          if (!isValid) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("Authentication successful for user:", user.email);
          
          return { 
            id: user._id.toString(),
            email: user.email,
            displayName: user.displayName,
            profileImage: user.profileImage
          }

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}){
      if(user){
        token.id = user.id;
        token.displayName = (user as any).displayName;
        token.profileImage = (user as any).profileImage;
      }
      return token;
    },

    async session({session, token }){
      if (session.user){
        session.user.id = token.id as string;
        (session.user as any).displayName = token.displayName as string;
        (session.user as any).profileImage = token.profileImage as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to login page after logout
      if (url.startsWith("/api/auth/signout")) {
        return `${baseUrl}/login`;
      }

      // Redirect to dashboard or home after successful login
      if (url.startsWith("/api/auth/signin") || url === `${baseUrl}/login`) {
        return `${baseUrl}/dashboard` || baseUrl;
      }

      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow callback URLs on the same origin
      try {
        if (new URL(url).origin === baseUrl) {
          return url;
        }
      } catch {
        // Invalid URL, return baseUrl
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
  
  secret: process.env.NEXTAUTH_SECRET,
  
 useSecureCookies: process.env.NODE_ENV === "production",
};