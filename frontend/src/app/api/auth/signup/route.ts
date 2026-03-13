import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  let userEmail = 'unknown';
  try {
    const body = await request.json();
    userEmail = body.email;
    const { name, email, username, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Check if user exists by email or username
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: username || undefined },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ou usuário já está cadastrado' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        username: username || null,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error(`[Signup Error] Failed to create user ${userEmail}:`, error.message);
    if (error.stack) console.error(error.stack);
    return NextResponse.json(
      { error: 'Erro ao criar usuário. Tente novamente.' },
      { status: 500 }
    );
  }
}
