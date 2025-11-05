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
import { User, UserPlus, UserPen, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { hasPermission } from '@/utils/authorization';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index({ users }: any) {

    const { auth, flash } = usePage().props as any;
    const userPermissions = auth.permissions;
    const permissionNames = userPermissions.map(permission => permission.name);
    const { delete: destroy } = useForm();

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Do you want to delete user ${name}?`)) {
            destroy(route('users.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="m-4">
                {hasPermission(permissionNames, 'create-users') && (
                    <Link href={route('users.create')}>
                        <Button><UserPlus />Add User</Button>
                    </Link>
                )}
            </div>
            <div className="ml-4 mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(({ id, name, email, roles }: any) =>
                            <TableRow>
                                <TableCell>{id}</TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>{email}</TableCell>
                                <TableCell>
                                    {roles.map((role: any) => (
                                        <Badge>{role.label}</Badge>
                                    ))}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    {hasPermission(permissionNames, 'view-users') && (
                                        <Link href={route('users.show', id)}>
                                            <Button><User />View</Button>
                                        </Link>
                                    )}
                                    {hasPermission(permissionNames, 'edit-users') && (
                                        <Link href={route('users.edit', id)}>
                                            <Button><UserPen />Edit</Button>
                                        </Link>
                                    )}
                                    {hasPermission(permissionNames, 'delete-users') && (
                                        <Button onClick={() => handleDelete(id, name)}><UserX />Delete</Button>
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
