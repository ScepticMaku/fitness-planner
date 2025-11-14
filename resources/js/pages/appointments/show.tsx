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

export default function Index() {

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
                            <ItemTitle><strong>Name</strong></ItemTitle>
                            <ItemDescription>Role</ItemDescription>
                        </div>
                    </ItemHeader>
                    <ItemContent>
                        <div className="grid grid-flow-col gap-4">
                            <div>
                                <ItemDescription>Exercise</ItemDescription>
                                <Label>Exercise</Label>
                            </div>
                            <div>
                                <ItemDescription>Date</ItemDescription>
                                <Label>Date</Label>
                            </div>
                            <div>
                                <ItemDescription>Time</ItemDescription>
                                <Label>Time</Label>
                            </div>
                        </div>
                    </ItemContent>
                    <ItemFooter>
                        <div className="flex flex-row gap-5">
                            <div>
                                <ItemDescription>Status</ItemDescription>
                                <ItemTitle>Status</ItemTitle>
                            </div>
                            <div>
                                <ItemDescription>Requested</ItemDescription>
                                <ItemTitle>Date and Time</ItemTitle>
                            </div>
                        </div>
                    </ItemFooter>
                </Item>
                <div className="mt-4 ">
                    <Button className="mr-3"><Check />Approve Appointment</Button>
                    <Button><X />Decline</Button>
                </div>
            </div>
        </AppLayout>
    )
}
