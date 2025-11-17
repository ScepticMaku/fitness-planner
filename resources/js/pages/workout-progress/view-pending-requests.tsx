import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Eye, Clock4, CheckCircle, Archive } from 'lucide-react';
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
        title: 'Workout Progress',
        href: '/workout-progress'
    },
    {
        title: 'View Pending Requests',
        href: '/workout-progress/view-pending-requests',
    },
];

export default function PendingRequests({ appointments }: any) {

    const filteredAppointments = appointments.filter(a => a.status == 'pending');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="m-4">
                <Label className="mb-4 text-[20px]"><strong>Pending Requests</strong></Label>
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
                                        <Link href={route('workout-progress.view-details', appointment.id)}>
                                            <Button><Eye />View Details</Button>
                                        </Link>
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
