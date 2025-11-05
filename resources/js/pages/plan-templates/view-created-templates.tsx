import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Link, Head, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Label } from "@/components/ui/label"
import { Pencil, Eye, Plus, ChevronLeft } from 'lucide-react';
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
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plan Templates',
        href: '/plan-templates',
    },
    {
        title: 'Created Templates',
        href: '/created-plan-templates',
    },
];

export default function viewCreatedTemplates({ templates }: any) {

    const { auth, flash } = usePage().props as any;
    const userId = auth.user.id;
    const filteredTemplates = templates.filter(template => template.user_id == userId);

    console.log(filteredTemplates);

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    if (templates.length == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Created Templates" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArchiveX />
                        </EmptyMedia>
                        <EmptyTitle>Templates Empty</EmptyTitle>
                        <EmptyDescription>No templates found</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Link href={route('plan-templates.create')}>
                            <Button>Add Template</Button>
                        </Link>
                    </EmptyContent>
                </Empty>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />
            <div>
                <Link href={route('plan-templates.index')}>
                    <Button><ChevronLeft />Back</Button>
                </Link>
            </div>
            <h1>Plan Templates</h1>
            <div>
                <Link href={route('plan-templates.create')}>
                    <Button><Plus />Add Template</Button>
                </Link>
            </div>
            <div>
                {filteredTemplates.map((template: any) => (
                    <Item className="w-100" variant="outline">
                        <ItemHeader>
                            <ItemTitle>{template.title}</ItemTitle>
                            {template.user == null && (
                                <ItemTitle>Created by: Delete trainer</ItemTitle>
                            )}
                            {template.user != null && (
                                <ItemTitle>Created by: {template.user.name}</ItemTitle>
                            )}
                        </ItemHeader>
                        <ItemContent>
                            <div className="flex space-x-2">
                                <Badge>{template.fitness_level}</Badge>
                                <Badge>{template.plan_type}</Badge>
                            </div>
                            <ItemDescription>{template.description}</ItemDescription>
                        </ItemContent>
                        <ItemActions />
                        <ItemFooter>
                            <div>
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
        </AppLayout>
    );
}
