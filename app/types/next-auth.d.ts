import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      displayName?: string
      profileImage?: string
    }
  }

  interface User {
    id: string
    email: string
    displayName?: string
    profileImage?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    displayName?: string
    profileImage?: string
  }
}