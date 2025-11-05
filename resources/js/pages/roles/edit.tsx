import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit Role',
        href: 'roles/edit',
    },
];

export default function Edit({ role, rolePermissions, permissions }: any) {

    const { data, setData, put, errors } = useForm({
        label: role.label,
        description: role.description,
        permissions: rolePermissions || [],
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
        put(route('roles.update', role.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Role" />
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
                                    id={permission.name}
                                    value={permission.name}
                                    checked={data.permissions.includes(permission.name)}
                                    onCheckedChange={(e) => handleCheckboxChange(permission.name, e)}
                                />
                                <Label key={permission.label}>{permission.label}</Label>
                            </div>
                        ))}
                    </div>

                    <Button type="submit"><Save />Save Changes</Button>
                </form>
            </div>
        </AppLayout>
    );
}
