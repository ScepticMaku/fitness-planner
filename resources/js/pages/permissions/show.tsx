import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
        title: 'Show Permission',
        href: 'permissions/show',
    },
];

export default function Edit({ permission }: any) {

    const { data, setData } = useForm({
        module: permission.module,
        label: permission.label,
        description: permission.description,
    })

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Permission" />
            <div className="m-4">
                <Link href={route('permissions.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4">
                <div>
                    <Label htmlFor="module">Module</Label>
                    <Select value={data.module || ''} onValueChange={(e) => setData('module', e)} disabled>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Module" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="users" key="users">Users</SelectItem>
                            <SelectItem value="roles" key="roles">Roles</SelectItem>
                            <SelectItem value="permissions" key="permissions">Permissions</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="label">Label</Label>
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
            </div>
        </AppLayout>
    );
}
