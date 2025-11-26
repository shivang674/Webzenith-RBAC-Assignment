import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const assignRoleSchema = z.object({
    roleId: z.string().uuid(),
})

export async function GET(req: NextRequest) {
    try {
        await requirePermission('users', 'read')
        const supabase = await createClient()

        // In a real app, we'd list users from auth.users, but Supabase client doesn't allow listing auth users easily without service role.
        // For this demo, we'll assume we have a public profile table or just list user_roles and join.
        // Let's list user_roles joined with roles.

        const { data, error } = await supabase
            .from('user_roles')
            .select(`
        user_id,
        role_id,
        roles (
          id,
          name
        )
      `)

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        await requirePermission('users', 'update')
        const body = await req.json()
        // We need user_id in body or params. Let's assume this endpoint is for assigning role to a specific user.
        // Actually, let's make a dynamic route for user assignment: /api/users/[id]/role
        return NextResponse.json({ error: 'Use /api/users/[id]/role endpoint' }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
