import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArchiveX } from 'lucide-react';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fitness Plan',
        href: '/fitness-plan',
    },
];

export default function Index({ plan }: any) {

    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    if (plan.length == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Schedules" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArchiveX />
                        </EmptyMedia>
                        <EmptyTitle>Plan Empty</EmptyTitle>
                        <EmptyDescription>You currenty have no active plan.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Link href={route('plan-templates.index')}>
                            <Button>Search Plans</Button>
                        </Link>
                    </EmptyContent>
                </Empty>
            </AppLayout>
        );
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fitness Plan" />
        </AppLayout>
    );
}
