import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (role && role !== 'all') {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              articles: true
            }
          }
        },
        orderBy: [
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name || 'Unknown User',
      email: user.email,
      role: user.role,
      status: 'active', // Since status field doesn't exist in schema, default to active
      avatar: user.image,
      joinedAt: user.createdAt.toISOString().split('T')[0],
      lastLogin: 'Never', // Since lastLogin field doesn't exist in schema
      permissions: getPermissionsForRole(user.role), // Generate permissions based on role
      department: null, // Since department field doesn't exist in schema
      bio: null, // Since bio field doesn't exist in schema
      articleCount: user._count.articles
    }));

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Helper function to generate permissions based on role
function getPermissionsForRole(role: string): string[] {
  switch (role) {
    case 'ADMIN':
      return ['read', 'write', 'delete', 'admin'];
    case 'EDITOR':
      return ['read', 'write', 'delete'];
    case 'AUTHOR':
      return ['read', 'write'];
    default:
      return ['read'];
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (!userRole || !["ADMIN"].includes(userRole)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, role, password } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Use provided password or generate a temporary one
    const userPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const isTemporaryPassword = !password;

    // Create the user with only the fields that exist in the schema
    const user = await prisma.user.create({
      data: {
        name: name || 'Unknown User',
        email,
        password: userPassword,
        role: role || 'AUTHOR',
        image: null
      }
    });

    // Return success with appropriate message
    return NextResponse.json({
      ...user,
      message: isTemporaryPassword 
        ? "User created successfully. A temporary password has been generated. The user should reset their password on first login."
        : "User created successfully with the provided password.",
      tempPassword: isTemporaryPassword ? userPassword : undefined,
      passwordSet: !isTemporaryPassword
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid value provided')) {
        return NextResponse.json(
          { error: "Invalid data provided. Please check all required fields." },
          { status: 400 }
        );
      }
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "A user with this email already exists." },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create user. Please check the console for details." },
      { status: 500 }
    );
  }
}
