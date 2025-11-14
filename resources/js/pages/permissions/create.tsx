import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permissions',
        href: '/permissions'
    },
    {
        title: 'Add Permission',
        href: 'permissions/create',
    },
];

export default function Create() {

    const { data, setData, post, errors } = useForm({
        module: '',
        label: '',
        description: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('permissions.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Permission" />
            <div className="m-4">
                <Link href={route('permissions.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="module">Module</Label>
                        <Select value={data.module || ''} onValueChange={(e) => setData('module', e)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Module" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="users" key="users">Users</SelectItem>
                                <SelectItem value="roles" key="roles">Roles</SelectItem>
                                <SelectItem value="permissions" key="permissions">Permissions</SelectItem>
                                <SelectItem value="plan-templates" key="plan-templates">Plan Templates</SelectItem>
                                <SelectItem value="fitness-plan" key="fitness-plan">Fitness Plan</SelectItem>
                                <SelectItem value="schedules" key="schedules">Schedules</SelectItem>
                                <SelectItem value="trainers" key="trainers">Trainers</SelectItem>
                                <SelectItem value="workout-progress" key="workout-progress">Workout Progress</SelectItem>
                                <SelectItem value="appointments" key="appointments">Appointments</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError
                            message={errors.module}
                        />
                    </div>
                    <div>
                        <Label htmlFor=" label">Label</Label>
                        <Input
                            type="text"
                            placeholder="Enter role label"
                            value={data.label} onChange={(e) => setData('label', e.target.value)}
                            required
                        />
                        <InputError
                            message={errors.label}
                        />
                    </div>
                    <div>
                        <Label htmlFor="role description">Description</Label>
                        <Textarea
                            placeholder="Enter role description"
                            value={data.description} onChange={(e) => setData('description', e.target.value)}
                        ></Textarea>
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </AppLayout>
    );
}
