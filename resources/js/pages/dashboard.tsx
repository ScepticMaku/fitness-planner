import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChartAreaDefault } from '@/components/chart-area-default';
import { Badge } from '@/components/ui/badge';
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
import { Clock, Eye, Loader, Clock4 } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {

    const { auth } = usePage().props as any;
    const userRole = auth.roles;

    if (userRole == 'trainer') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="m-4">
                    <div className="mb-2">
                        <Label className="text-[20px]"><strong>Overview</strong></Label>
                    </div>
                    <div className="flex flex-row gap-3 mb-4">
                        <Item className="grid grid-flow-row w-60" variant="outline">
                            <ItemTitle><Clock />Appointments Today</ItemTitle>
                            <Label className="text-[16px]">0</Label>
                        </Item>
                        <Item className="grid grid-flow-row w-60" variant="outline">
                            <ItemTitle><Loader />Appointment Requests</ItemTitle>
                            <Label className="text-[16px]">0</Label>
                        </Item>
                        <Item className="grid grid-flow-row w-60" variant="outline">
                            <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                            <Label className="text-[16px]">Time & Date - Exercise</Label>
                            <ItemDescription>With: trainer name</ItemDescription>
                        </Item>
                    </div>
                    <div className="mb-2">
                    </div>
                    <div className="mb-2 grid grid-flow-col grid-cols-2 gap-4">
                        <Item variant="outline">
                            <ItemHeader>
                                <ItemTitle><strong>Schedule</strong></ItemTitle>
                            </ItemHeader>
                            <ItemContent>
                                <ScrollArea className="h-40">
                                    <Item variant="outline">
                                        <ItemHeader>
                                            <Label>10:00AM - Client Name</Label>
                                            <Button><Eye />View</Button>
                                        </ItemHeader>
                                    </Item>
                                </ScrollArea>
                            </ItemContent>
                            <Link>
                            </Link>
                        </Item>
                        <Item variant="outline">
                            <ItemHeader>
                                <ItemTitle><strong>Client Progress History</strong></ItemTitle>
                            </ItemHeader>
                            <ItemContent>
                                <ScrollArea className="h-40">
                                    <div className="grid grid-flow-cols gap-3">
                                        <Item variant="outline">
                                            <ItemHeader>
                                                <div>
                                                    <Label>Client Name - Exercise</Label>
                                                    <ItemDescription>Date Completed</ItemDescription>
                                                </div>
                                                <Button><Eye />View</Button>
                                            </ItemHeader>
                                        </Item>
                                    </div>
                                </ScrollArea>
                            </ItemContent>
                        </Item>
                    </div>
                    <div>
                        <ChartAreaDefault />
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (userRole == 'member') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="m-4">
                    <Item variant="outline">
                        <ItemHeader>
                            <div>
                                <ItemTitle className="text-[20px]"><strong>Welcome back User!</strong></ItemTitle>
                                <ItemDescription>Here's your fitness overview for today!</ItemDescription>
                            </div>
                        </ItemHeader>
                    </Item>
                    <div className="mt-4 flex flex-row gap-3">
                        <Item className="grid grid-flow-row w-60" variant="outline">
                            <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                            <Label className="text-[16px]">Time & Date - Exercise</Label>
                            <ItemDescription>With: trainer name</ItemDescription>
                        </Item>
                        <Item className="grid grid-flow-row w-60" variant="outline">
                            <ItemTitle><Clock4 />Workout Progress</ItemTitle>
                            <Label className="text-[16px]">Full Body A</Label>
                            <ItemDescription>Completed: 0/4 Exercises</ItemDescription>
                        </Item>

                    </div>
                    <div className="mt-4 grid grid-flow-col grid-cols-2 gap-3">
                        <div className="grid grid-flow-row gap-2">
                            <Item variant="outline">
                                <ItemHeader>
                                    <div>
                                        <ItemTitle>Current Exercise</ItemTitle>
                                        <Label><strong>Exercise Name</strong></Label>
                                    </div>
                                </ItemHeader>
                                <ItemContent>
                                    <div className="grid grid-flow-col gap-3">
                                        <div>
                                            <Label className="mr-2">Sets:</Label>
                                            <Badge>3</Badge>
                                        </div>
                                        <div>
                                            <Label className="mr-2">Reps:</Label>
                                            <Badge>8-10</Badge>
                                        </div>
                                        <div>
                                            <Label className="mr-2">Rest Seconds:</Label>
                                            <Badge>75</Badge>
                                        </div>
                                    </div>
                                </ItemContent>
                            </Item>
                            <div>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <ItemTitle><strong>Recently Completed Exercises</strong></ItemTitle>
                                    </ItemHeader>
                                    <ItemContent>
                                        <ScrollArea className="h-40">
                                            <div className="grid grid-flow-cols gap-3">
                                                <Item variant="outline">
                                                    <ItemHeader>
                                                        <div>
                                                            <Label>Client Name - Exercise</Label>
                                                            <ItemDescription>Date Completed</ItemDescription>
                                                        </div>
                                                        <Button><Eye />View</Button>
                                                    </ItemHeader>
                                                </Item>
                                            </div>
                                        </ScrollArea>
                                    </ItemContent>
                                </Item>
                            </div>
                        </div>
                        <div className="grid grid-flow-row gap-2">
                            <Item variant="outline">
                                <ItemHeader>
                                    <ItemTitle><strong>Schedule</strong></ItemTitle>
                                </ItemHeader>
                                <ItemContent>
                                    <ScrollArea className="h-40">
                                        <Item variant="outline">
                                            <ItemHeader>
                                                <Label>10:00AM - Client Name</Label>
                                                <Button><Eye />View</Button>
                                            </ItemHeader>
                                        </Item>
                                    </ScrollArea>
                                </ItemContent>
                                <Link>
                                </Link>
                            </Item>
                            <Item variant="outline">
                                <div className="space-y-4">
                                    <div>
                                        <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <ItemTitle><strong>Name</strong></ItemTitle>
                                            <Label>Guideline Name</Label>
                                        </div>
                                        <div>
                                            <ItemTitle><strong>Description</strong></ItemTitle>
                                            <p>Guideline Description</p>
                                        </div>
                                        <div>
                                            <ItemTitle><strong>Diet Type</strong></ItemTitle>
                                            <Label>Diet Type</Label>
                                        </div>
                                    </div>
                                </div>
                            </Item>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
        </AppLayout>
    );
}
