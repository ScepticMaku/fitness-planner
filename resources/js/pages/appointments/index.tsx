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
        title: 'Appointments',
        href: '/appointments'
    },
];

export default function Index() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="m-4">
                <Label className="mb-4 text-[20px]"><strong>Appointments</strong></Label>
                <div className="mb-4">
                    <ItemDescription>Filter by status:</ItemDescription>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">All Appointments</SelectItem>
                            <SelectItem value="dark">Approved</SelectItem>
                            <SelectItem value="system">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4 grid grid-flow-col grid-cols-4 gap-2">
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><Clock4 />Pending</ItemTitle>
                        <Label className="text-[20px]">0</Label>
                    </Item>
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><CheckCircle />Approved</ItemTitle>
                        <Label className="text-[20px]">0</Label>
                    </Item>
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><Check />Completed</ItemTitle>
                        <Label className="text-[20px]">0</Label>
                    </Item>
                    <Item variant="outline" className="grid grid-flow-row">
                        <ItemTitle><Archive />Total</ItemTitle>
                        <Label className="text-[20px]">0</Label>
                    </Item>
                </div>
                <ItemTitle className="text-[16px]"><strong>Appointments</strong></ItemTitle>
                <ScrollArea className="h-90">
                    <div className="grid grid-flow-row gap-2">
                        <Item variant="outline">
                            <ItemHeader>
                                <div>
                                    <ItemTitle><strong>Name</strong></ItemTitle>
                                    <ItemDescription><strong>Exercise Name - Date at Time</strong></ItemDescription>
                                    <ItemDescription>Requested: Date and time</ItemDescription>
                                </div>
                                <div><Badge>Status</Badge></div>
                                <div className="grid gap-2 grid-flow-col">
                                    <Link href={route('appointments.show', 1)}>
                                        <Button><Eye />View Details</Button>
                                    </Link>
                                    <Button><Check />Approve</Button>
                                    <Button><X />Decline</Button>
                                </div>
                            </ItemHeader>
                        </Item>
                    </div>
                </ScrollArea>
            </div>
        </AppLayout>
    )
}
