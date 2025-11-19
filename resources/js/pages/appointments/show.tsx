import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
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

export default function Index({ appointment }: any) {

    const { put } = useForm();

    const formatTimeOnly = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC',
        });
    };


    const approveAppointment = (id: number) => {
        if (confirm('Do you want to approve this appointment?')) {
            put(route('appointments.approve', id));
        }
    }

    const declineAppointment = (id: number) => {
        if (confirm('Do you want to decline this appointment?')) {
            put(route('appointments.decline', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="m-4">
                <div className="mb-4">
                    <Link href={route('appointments.index')}>
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
                {appointment.status == 'pending' && (
                    <div className="mt-4 ">
                        <Button className="mr-3" onClick={() => approveAppointment(appointment.id)}><Check />Approve Appointment</Button>
                        <Button onClick={() => declineAppointment(appointment.id)}><X />Decline</Button>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}
