import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import CalendarApp from '@/components/calendar-app';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedules',
        href: '/schedules',
    },
];

export default function Index() {

    const { auth, flash } = usePage().props as any;
    const userRole = auth.roles;

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />
            <div className="m-4">
                {userRole == 'trainer' && (
                    <div className="mb-4">
                        <Link href={route('trainer.availability.index')}>
                            <Button><Eye />Manage Slots</Button>
                        </Link>
                    </div>
                )}
                <CalendarApp />
            </div>
        </AppLayout>
    );
}
