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
import { Eye, Plus, Pen, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { hasPermission } from '@/utils/authorization';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions',
    },
];

export default function Index({ permissions }: any) {


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
        if (confirm(`Do you want to delete permission ${label}?`)) {
            destroy(route('permissions.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="m-4">
                {hasPermission(permissionNames, 'create-permissions') && (
                    <Link href={route('permissions.create')}>
                        <Button><Plus />Add Permission</Button>
                    </Link>

                )}
            </div>
            <div className="ml-4 mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.map(({ id, label, module }: any) =>
                            <TableRow>
                                <TableCell>{id}</TableCell>
                                <TableCell>{label}</TableCell>
                                <TableCell className="capitalize">{module}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {hasPermission(permissionNames, 'view-permissions') && (
                                        <Link href={route('permissions.show', id)}>
                                            <Button><Eye />View</Button>
                                        </Link>
                                    )}
                                    {hasPermission(permissionNames, 'edit-permissions') && (
                                        <Link href={route('permissions.edit', id)}>
                                            <Button><Pen />Edit</Button>
                                        </Link>
                                    )}
                                    {hasPermission(permissionNames, 'delete-permissions') && (
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
