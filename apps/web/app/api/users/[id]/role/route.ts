import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const assignRoleSchema = z.object({
    roleId: z.string().uuid(),
})

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('users', 'update')
        const { id: userId } = await params
        const body = await req.json()
        const { roleId } = assignRoleSchema.parse(body)

        const supabase = await createClient()

        // Upsert user_role (since we enforce 1 role per user)
        const { data, error } = await supabase
            .from('user_roles')
            .upsert({
                user_id: userId,
                role_id: roleId,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}
