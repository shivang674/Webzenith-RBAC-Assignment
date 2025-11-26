'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPermissions, createPermission } from '@/lib/api/permissions'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function PermissionsPage() {
    const { data: permissions, isLoading } = useQuery({
        queryKey: ['permissions'],
        queryFn: getPermissions,
    })

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Permissions</h1>
                <CreatePermissionDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Entity</TableHead>
                            <TableHead>Operation</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions?.map((permission) => (
                            <TableRow key={permission.id}>
                                <TableCell className="font-medium">{permission.entity}</TableCell>
                                <TableCell>{permission.operation}</TableCell>
                                <TableCell>{permission.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

function CreatePermissionDialog() {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const createMutation = useMutation({
        mutationFn: createPermission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] })
            setOpen(false)
            toast({ title: 'Permission created' })
        },
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        createMutation.mutate({
            entity: formData.get('entity') as string,
            operation: formData.get('operation') as string,
            description: formData.get('description') as string,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Permission
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Permission</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="entity">Entity</Label>
                        <Input id="entity" name="entity" placeholder="e.g. leads" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="operation">Operation</Label>
                        <Input id="operation" name="operation" placeholder="e.g. read" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
