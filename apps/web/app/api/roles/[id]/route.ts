import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const updateRoleSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    is_active: z.boolean().optional(),
})

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('roles', 'update')
        const { id } = await params
        const body = await req.json()
        const validated = updateRoleSchema.parse(body)

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('roles')
            .update(validated)
            .eq('id', id)
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('roles', 'delete')
        const { id } = await params

        const supabase = await createClient()
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id)

        if (error) throw error

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}
