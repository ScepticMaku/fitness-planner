import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Show Role',
        href: 'roles/show',
    },
];

export default function Show({ role, permissions }: any) {

    const { data, setData } = useForm({
        label: role.label,
        description: role.description,
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Role" />
            <div className="m-4">
                <Link href={route('roles.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4">
                <div>
                    <Label htmlFor="role label">Label</Label>
                    <Input
                        type="text"
                        placeholder="Enter role label"
                        value={data.label} onChange={(e) => setData('label', e.target.value)}
                        disabled
                    />
                </div>
                <div>
                    <Label htmlFor="role description">Description</Label>
                    <Textarea
                        placeholder="Enter role description"
                        value={data.description} onChange={(e) => setData('description', e.target.value)}
                        disabled
                    ></Textarea>
                </div>
                <div>
                    <Label htmlFor="permissions">Permissions</Label>
                    {permissions.map((permission: any) => (
                        <div className="space-x-2">
                            <Badge>{permission.label}</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
