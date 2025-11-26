import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const createRoleSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
})

export async function GET(req: NextRequest) {
    try {
        await requirePermission('roles', 'read')
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('created_at', { ascending: false })

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
        await requirePermission('roles', 'create')
        const body = await req.json()
        const validated = createRoleSchema.parse(body)

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('roles')
            .insert(validated)
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
