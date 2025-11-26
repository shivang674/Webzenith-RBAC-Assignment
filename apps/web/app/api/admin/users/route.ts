import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/rbac'
import { createServiceRoleClient } from '@/lib/supabase/service'
import { z } from 'zod'

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(req: NextRequest) {
    try {
        // Ensure the requester has permission to manage users
        await requirePermission('users', 'create')

        const body = await req.json()
        const { email, password } = createUserSchema.parse(body)

        const supabase = createServiceRoleClient()

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm for admin-created users
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data.user)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}
