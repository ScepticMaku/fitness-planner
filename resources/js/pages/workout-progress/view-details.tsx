import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Check, X, ChevronLeft } from 'lucide-react';
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appointments',
        href: '/appointments'
    },
    {
        title: 'Appointment Details',
        href: '/appointment-details'
    },
];

export default function viewDetails({ appointment }: any) {


    const formatTimeOnly = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        });
    };

    console.log(appointment.slot.start_time);

    console.log(formatTimeOnly(appointment.slot.start_time));


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="m-4">
                <div className="mb-4">
                    <Link href={route('workout-progress.view-requests')}>
                        <Button><ChevronLeft /> Back</Button>
                    </Link>
                </div>
                <Item variant="outline">
                    <ItemHeader>
                        <div>
                            <ItemTitle><strong>{appointment.user.name}</strong></ItemTitle>
                        </div>
                    </ItemHeader>
                    <ItemContent>
                        <div className="grid grid-flow-col gap-4">
                            <div>
                                <ItemDescription>Exercise</ItemDescription>
                                <Label>{appointment.exercise.name}</Label>
                            </div>
                            <div>
                                <ItemDescription>Start Time</ItemDescription>
                                <Label>{formatTimeOnly(appointment.slot.start_time)}</Label>
                            </div>
                            <div>
                                <ItemDescription>End Time</ItemDescription>
                                <Label>{formatTimeOnly(appointment.slot.end_time)}</Label>
                            </div>
                        </div>
                    </ItemContent>
                    <ItemFooter>
                        <div className="flex flex-row gap-5">
                            <div>
                                <ItemDescription>Status</ItemDescription>
                                <ItemTitle className="capitalize">{appointment.status}</ItemTitle>
                            </div>
                            <div>
                                <ItemDescription>Date Requested</ItemDescription>
                                <ItemTitle>{appointment.date_requested}</ItemTitle>
                            </div>
                        </div>
                    </ItemFooter>
                </Item>
            </div>
        </AppLayout>
    )
}
