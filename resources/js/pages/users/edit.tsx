import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
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
        href: '/users',
    },
    {
        title: 'Edit User',
        href: 'users/edit',
    },
];

export default function Edit({ user, userRole, roles }: any) {

    const { data, setData, put, errors } = useForm({
        name: user.name,
        email: user.email,
        roles: userRole[0]?.name
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="m-4">
                <Link href={route('users.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="user name">Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter Full Name"
                            value={data.name} onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError
                            message={errors.name}
                        />
                    </div>
                    <div>
                        <Label htmlFor="user email">Email address</Label>
                        <Input
                            type="email"
                            placeholder="example@email.com"
                            value={data.email} onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError
                            message={errors.email}
                        />
                    </div>
                    <div>
                        <Label>Role</Label>
                    </div>
                    <div>
                        <Select value={data.roles} onValueChange={(e) => setData('roles', e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem value={role.name} key={role.name}>{role.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit"><Save />Save Changes</Button>
                </form>
            </div>
        </AppLayout>
    );
}
