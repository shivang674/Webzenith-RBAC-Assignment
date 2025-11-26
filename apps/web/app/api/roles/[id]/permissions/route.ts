import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const assignPermissionsSchema = z.object({
    permissionIds: z.array(z.string().uuid()),
})

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('roles', 'read')
        const { id } = await params
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('role_permissions')
            .select('permission_id')
            .eq('role_id', id)

        if (error) throw error

        return NextResponse.json(data.map(rp => rp.permission_id))
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('roles', 'update')
        const { id } = await params
        const body = await req.json()
        const { permissionIds } = assignPermissionsSchema.parse(body)

        const supabase = await createClient()

        // Transaction-like behavior: Delete all existing and insert new
        // Note: Supabase doesn't support transactions in client directly, but we can batch or use RPC.
        // For simplicity in this assignment, we'll do delete then insert.

        const { error: deleteError } = await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', id)

        if (deleteError) throw deleteError

        if (permissionIds.length > 0) {
            const { error: insertError } = await supabase
                .from('role_permissions')
                .insert(
                    permissionIds.map(permId => ({
                        role_id: id,
                        permission_id: permId,
                    }))
                )

            if (insertError) throw insertError
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}
