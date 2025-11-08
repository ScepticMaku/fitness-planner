import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Link, Head, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label"
import { Pencil, Eye, Plus } from 'lucide-react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { ArchiveX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"
import { Badge } from '@/components/ui/badge';
import { hasPermission } from '@/utils/authorization';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plan Templates',
        href: '/plan-templates',
    },
];

export default function Index({ templates }: any) {

    const { auth, flash } = usePage().props as any;
    const userPermissions = auth.permissions;
    const permissionName = userPermissions.map(permission => permission.name);
    const userId = auth.user.id;

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    if (templates.length == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Schedules" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArchiveX />
                        </EmptyMedia>
                        <EmptyTitle>Templates Empty</EmptyTitle>
                        <EmptyDescription>No templates found</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        {hasPermission(permissionName, 'create-plan-templates') && (
                            <Link href={route('plan-templates.create')}>
                                <Button>Add Template</Button>
                            </Link>
                        )}
                    </EmptyContent>
                </Empty>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Plan Templates" />
            <div className="m-4 space-y-2">
                <h1>Plan Templates</h1>
                <div className="space-x-2">
                    {hasPermission(permissionName, 'create-plan-templates') && (
                        <Link href={route('plan-templates.create')}>
                            <Button><Plus />Add Template</Button>
                        </Link>
                    )}
                    {hasPermission(permissionName, 'view-created-templates') && (
                        <Link href={route('plan-templates.viewCreatedTemplates')}>
                            <Button><Eye />View Created Templates</Button>
                        </Link>
                    )}
                </div>
                <div className="grid gap-2">
                    {templates.map((template: any) => (
                        <Item className="w-100" variant="outline">
                            <ItemHeader>
                                <ItemTitle>{template.title}</ItemTitle>
                                {template.user == null && (
                                    <ItemDescription>Created by: Deleted Trainer</ItemDescription>
                                )}
                                {template.user != null && (
                                    <ItemDescription>Created by: {template.user.name}</ItemDescription>
                                )}
                            </ItemHeader>
                            <ItemContent>
                                <div className="flex space-x-2">
                                    <Badge className="capitalize">{template.fitness_level}</Badge>
                                    <Badge>{template.plan_type}</Badge>
                                </div>
                                <ItemDescription>{template.goal}</ItemDescription>
                            </ItemContent>
                            <ItemFooter>
                                <div className="space-x-2">
                                    <Link href={route('plan-templates.show', template.id)}>
                                        <Button><Eye />View</Button>
                                    </Link>
                                    {template.user_id == userId && (
                                        <Link href={route('plan-templates.edit', template.id)}>
                                            <Button><Pencil />Edit</Button>
                                        </Link>
                                    )}
                                </div>
                            </ItemFooter>
                        </Item>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
