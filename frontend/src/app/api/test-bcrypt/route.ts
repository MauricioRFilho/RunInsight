import { NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';

export async function GET() {
  try {
    const p = 'test-password';
    const h = await hash(p, 10);
    const isValid = await compare(p, h);
    return NextResponse.json({
      status: 'ok',
      bcryptWorking: isValid,
      hash: h.substring(0, 10) + '...'
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
}
