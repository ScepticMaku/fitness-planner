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
import { UserPlus, UserPen, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { hasPermission } from '@/utils/authorization';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: '/trainers',
    },
];

export default function Index({ trainers }: any) {

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
        if (confirm(`Do you want to delete trainer ${name}?`)) {
            destroy(route('trainers.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />

            <div className="m-4">
                {hasPermission(permissionNames, 'create-trainers') && (
                    <Link href={route('trainers.create')}>
                        <Button><UserPlus />Add Trainer</Button>
                    </Link>
                )}
            </div>
            <div className="ml-4 mr-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Specialization</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainers.map(({ id, user, specialization, trainer_status }: any) =>
                            <TableRow>
                                <TableCell>{id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{specialization}</TableCell>
                                <TableCell className="capitalize">{trainer_status}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {hasPermission(permissionNames, 'edit-trainers') && (
                                        <Link href={route('trainers.edit', id)}>
                                            <Button><UserPen />Edit</Button>
                                        </Link>
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
