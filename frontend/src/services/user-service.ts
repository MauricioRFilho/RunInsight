import prisma from '@/lib/prisma';

export class UserService {
  /**
   * Resolves a raw ID (could be internal UUID or numeric Strava ID) to the internal UUID.
   */
  static async resolveInternalId(rawId: string): Promise<string | null> {
    if (!rawId || rawId === 'default-user-id') return null;

    // 1. Try to find by internal ID (UUID)
    const userById = await prisma.user.findUnique({
      where: { id: rawId },
      select: { id: true }
    });

    if (userById) return userById.id;

    // 2. Try to find by Strava ID (since it's a numeric string in the front-end)
    const userByStrava = await prisma.user.findUnique({
      where: { stravaId: rawId },
      select: { id: true }
    });

    if (userByStrava) return userByStrava.id;

    // 3. Fallback: Check if it's an email (NextAuth sometimes passes email)
    if (rawId.includes('@')) {
      const userByEmail = await prisma.user.findUnique({
        where: { email: rawId },
        select: { id: true }
      });
      if (userByEmail) return userByEmail.id;
    }

    return null;
  }
}
