'use client'

/**
 * useUser.ts
 * 
 * This hook now just re-exports from the SupabaseProvider context.
 * Keeping it as a separate hook file so all existing import paths
 * throughout the codebase remain valid without modification.
 */

export { useAuth as useUser } from '@/components/providers/SupabaseProvider'
export type { CustomerProfile } from '@/components/providers/SupabaseProvider'
