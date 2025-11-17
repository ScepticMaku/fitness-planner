import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Eye, Clock4, CheckCircle, Archive } from 'lucide-react';
import { toast } from 'sonner';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appointments',
        href: '/appointments'
    },
];

export default function Index({ appointments }: any) {

    const pendingAppointments = appointments.filter(a => a.status == 'pending').length;
    const approvedAppointments = appointments.filter(a => a.status == 'approved').length;
    const completedAppointments = appointments.filter(a => a.status == 'completed').length;
    const allAppointments = appointments.length;

    const { flash } = usePage().props as any;

    const { put } = useForm();

    const [statusFilter, setStatusFilter] = useState('all');
    const filteredAppointments = useMemo(() => {
        if (statusFilter === 'all') return appointments; // Show all
        return appointments.filter(appointment => appointment.status === statusFilter);
    }, [appointments, statusFilter]);

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

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="m-4">
                <Label className="mb-4 text-[20px]"><strong>Appointments</strong></Label>
                <div className="mb-4">
                    <ItemDescription>Filter by status:</ItemDescription>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Appointments</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4 grid grid-flow-col grid-cols-4 gap-2">
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><Clock4 />Pending</ItemTitle>
                        <Label className="text-[20px]">{pendingAppointments}</Label>
                    </Item>
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><CheckCircle />Approved</ItemTitle>
                        <Label className="text-[20px]">{approvedAppointments}</Label>
                    </Item>
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><Check />Completed</ItemTitle>
                        <Label className="text-[20px]">{completedAppointments}</Label>
                    </Item>
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><Archive />Total</ItemTitle>
                        <Label className="text-[20px]">{allAppointments}</Label>
                    </Item>
                </div>
                <ItemTitle className="text-[16px]"><strong>Appointments</strong></ItemTitle>
                <ScrollArea className="h-90">
                    <div className="grid grid-flow-row gap-2">
                        {filteredAppointments.map(appointment => (
                            <Item variant="outline">
                                <ItemHeader>
                                    <div>
                                        <ItemTitle><strong>{appointment.user.name}</strong></ItemTitle>
                                        <ItemDescription><strong>{appointment.exercise.name} - Date at Time</strong></ItemDescription>
                                        <ItemDescription>Requested: {appointment.date_requested}</ItemDescription>
                                    </div>
                                    <div><Badge className="capitalize">{appointment.status}</Badge></div>
                                    <div className="grid gap-2 grid-flow-col">
                                        <Link href={route('appointments.show', appointment.id)}>
                                            <Button><Eye />View Details</Button>
                                        </Link>
                                        {appointment.status == 'pending' && (
                                            <div>
                                                <Button onClick={() => approveAppointment(appointment.id)} className="mr-2"><Check />Approve</Button>
                                                <Button onClick={() => declineAppointment(appointment.id)}><X />Decline</Button>
                                            </div>
                                        )}
                                    </div>
                                </ItemHeader>
                            </Item>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </AppLayout>
    )
}
