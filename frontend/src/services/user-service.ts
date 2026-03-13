import prisma from '@/lib/prisma';

export class UserService {
  /**
   * Resolves a raw ID (could be internal UUID or numeric Strava ID) to the internal UUID.
   */
  static async resolveInternalId(rawId: string): Promise<string | null> {
    if (!rawId || rawId === 'default-user-id') {
      console.warn('[UserService] Invalid rawId received:', rawId);
      return null;
    }

    console.log(`[UserService] Attempting to resolve rawId: ${rawId}`);

    // 1. Try to find by internal ID (UUID)
    const userById = await prisma.user.findUnique({
      where: { id: rawId },
      select: { id: true, email: true, stravaId: true }
    });

    if (userById) {
      console.log(`[UserService] Resolved via internal ID: ${userById.id} (Email: ${userById.email})`);
      return userById.id;
    }

    // 2. Try to find by Strava ID
    const userByStrava = await prisma.user.findUnique({
      where: { stravaId: rawId },
      select: { id: true, email: true }
    });

    if (userByStrava) {
      console.log(`[UserService] Resolved via Strava ID ${rawId} to internal ID: ${userByStrava.id}`);
      return userByStrava.id;
    }

    // 3. Fallback: Check if it's an email
    if (rawId.includes('@')) {
      const userByEmail = await prisma.user.findUnique({
        where: { email: rawId },
        select: { id: true }
      });
      if (userByEmail) {
        console.log(`[UserService] Resolved via Email ${rawId} to internal ID: ${userByEmail.id}`);
        return userByEmail.id;
      }
    }

    console.error(`[UserService] Could not resolve identity for rawId: ${rawId}. User not found in database.`);
    return null;
  }
}
