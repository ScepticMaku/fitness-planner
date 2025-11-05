import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedules',
        href: '/schedules',
    },
];

export default function Index() {

    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />
        </AppLayout>
    );
}
