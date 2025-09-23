import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRATION DEBUG START ===');
    
    const { email, password } = await request.json();
    console.log('Registration request:', { email, passwordLength: password?.length });

    if (!email || !password) {
      console.log('ERROR: Missing email or password');
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('ERROR: Password too short');
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');

    const normalizedEmail = email.toLowerCase().trim();
    console.log('Checking for existing user with email:', normalizedEmail);
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    console.log('Existing user found:', !!existingUser);
    
    if (existingUser) {
      console.log('ERROR: User already exists');
      return NextResponse.json(
        { error: "User already registered" },
        { status: 409 }
      );
    }

    console.log('Creating new user...');
    const newUser = await User.create({
      email: normalizedEmail,
      password, // This will be hashed by the pre-save hook
    });
    
    console.log('User created successfully:', {
      id: newUser._id,
      email: newUser.email,
      hasHashedPassword: newUser.password?.startsWith('$2')
    });

    console.log('=== REGISTRATION DEBUG END ===');

    return NextResponse.json(
      { 
        message: "User registered successfully",
        userId: newUser._id 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    console.log('=== REGISTRATION DEBUG END (ERROR) ===');
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errorMessages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}