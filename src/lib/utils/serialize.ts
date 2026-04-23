/**
 * BAD SZN — Serialization Utility
 * 
 * This utility converts complex Prisma/Next.js objects (like Decimal and Date) 
 * into plain JSON objects. This is CRITICAL for passing data from Server Components 
 * to Client Components without triggering "Only plain objects" errors or hydration mismatches.
 */

export function serializeData<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}
