import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Plus, Pen, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { hasPermission } from '@/utils/authorization';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }: any) {

    const { auth, flash } = usePage().props as any;
    const userPermissions = auth.permissions;
    const permissionNames = userPermissions.map(permission => permission.name);

    const { delete: destroy } = useForm();

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    const handleDelete = (id: number, label: string) => {
        if (confirm(`Do you want to delete role ${label}?`)) {
            destroy(route('roles.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="m-4">
                {hasPermission(permissionNames, 'create-roles') && (
                    <Link href={route('roles.create')}>
                        <Button><Plus />Add Role</Button>
                    </Link>
                )}
            </div>
            <div className="ml-4 mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead className="text-center">Permissions</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map(({ id, label, permissions }: any) =>
                            <TableRow>
                                <TableCell>{id}</TableCell>
                                <TableCell>{label}</TableCell>
                                <TableCell className="flex flex-wrap gap-2">
                                    {permissions.map((permission: any) => (
                                        <Badge>{permission.label}</Badge>
                                    ))}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {hasPermission(permissionNames, 'view-roles') && (
                                        <Link href={route('roles.show', id)}>
                                            <Button><Eye />View</Button>
                                        </Link>
                                    )}
                                    {hasPermission(permissionNames, 'edit-roles') && (
                                        <Link href={route('roles.edit', id)}>
                                            <Button><Pen />Edit</Button>
                                        </Link>
                                    )}
                                    {hasPermission(permissionNames, 'delete-roles') && (
                                        <Button onClick={() => handleDelete(id, label)}><Trash />Delete</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
