import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Add Role',
        href: 'roles/create',
    },
];

export default function Create({ permissions }: any) {

    const { data, setData, post, errors } = useForm({
        label: '',
        description: '',
        permissions: [],
    })

    function handleCheckboxChange(permissionName: any, checked: any) {
        if (checked) {
            setData("permissions", [...data.permissions, permissionName]);
        } else {
            setData("permissions", data.permissions.filter(name => name !== permissionName));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('roles.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Role" />
            <div className="m-4">
                <Link href={route('roles.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="role label">Label</Label>
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
                    <div>
                        <Label htmlFor="permissions">Permissions</Label>
                        {permissions.map((permission: any) => (
                            <div className="space-x-2">
                                <Checkbox
                                    id={permission.module}
                                    value={permission.module}
                                    onCheckedChange={(e) => handleCheckboxChange(permission.module, e)}
                                />
                                <Label key={permission.module}>{permission.label}</Label>
                            </div>
                        ))}

                        <InputError
                            message={errors.permissions}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </AppLayout>
    );
}
