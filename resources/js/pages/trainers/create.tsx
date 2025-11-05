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
        title: 'Trainers',
        href: '/trainers',
    },
    {
        title: 'Add Trainer',
        href: 'trainers/create',
    },
];

export default function Create() {

    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        specialization: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('trainers.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add User" />
            <div className="m-4">
                <Link href={route('trainers.index')}>
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
                        <Label>Specialization</Label>
                    </div>
                    <div>
                        <Select value={data.specialization || ''} onValueChange={(e) => setData('specialization', e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Specialization" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Strength and Conditioning" key="strength-and-conditioning">Strength and Conditioning</SelectItem>
                                <SelectItem value="Weight Loss or Fat Loss" key="weight-loss-or-fat-loss">Weight Loss or Fat Loss</SelectItem>
                                <SelectItem value="Functional Training" key="functional-training">Functional Training</SelectItem>
                                <SelectItem value="Body Building" key="body-building">Body Building</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError
                            message={errors.specialization}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </AppLayout>
    );
}
