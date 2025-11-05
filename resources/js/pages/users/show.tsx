import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users'
    },
    {
        title: 'Show User',
        href: 'users/show',
    },
];

export default function Show({ user, userRole, roles }: any) {

    const { data, setData } = useForm({
        name: user.name,
        email: user.email,
        roles: userRole[0]?.name,
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show User" />
            <div className="m-4">
                <Link href={route('users.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4 space-y-2">
                <div>
                    <Label htmlFor="user name">Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter Full Name"
                        value={data.name} onChange={(e) => setData('name', e.target.value)}
                        disabled
                    />
                </div>
                <div>
                    <Label htmlFor="user email">Email address</Label>
                    <Input
                        type="email"
                        placeholder="example@email.com"
                        value={data.email} onChange={(e) => setData('email', e.target.value)}
                        disabled
                    />
                </div>
                <div>
                    <Label htmlFor="user role">Role</Label>
                </div>
                <div>
                    <div>
                        <Select disabled value={data.roles} onValueChange={(e) => setData('roles', e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem value={role.name} key={role.name}>{role.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
