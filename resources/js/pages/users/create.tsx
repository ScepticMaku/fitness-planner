import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
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
        title: 'Add User',
        href: 'users/create',
    },
];

export default function Create({ roles }) {

    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        roles: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />
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
                        <Label htmlFor="user password">Password</Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={data.password} onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError
                            message={errors.password}
                        />
                    </div>
                    <div>
                        <Label htmlFor="user confirm">Confirm Password</Label>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={data.confirm_password} onChange={(e) => setData('confirm_password', e.target.value)}
                            required
                        />
                        <InputError
                            message={errors.confirm_password}
                        />
                    </div>
                    <div>
                        <Label htmlFor="roles">Role</Label>
                    </div>
                    <div>
                        <Select value={data.roles || ''} onValueChange={(e) => setData('roles', e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role: any) => (
                                    <SelectItem value={role.name} key={role.name}>{role.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError
                            message={errors.roles}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </AppLayout>
    );
}
