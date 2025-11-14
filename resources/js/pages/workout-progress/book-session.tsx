import { Label } from '@/components/ui/label';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Head, Link } from '@inertiajs/react';
import { DatePicker } from '@/components/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workout Progress',
        href: '/workout-progress'
    },
    {
        title: 'Book a Session',
        href: '/book-session'
    },
];

export default function BookSession() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="ml-4 mt-4">
                <Label className="text-[20px]"><strong>Book a Session</strong></Label>
            </div>
            <div className="m-4 grid grid-flow-row grid-cols-2 gap-4">
                <div className="grid grid-flow-row gap-2">
                    <Item variant="outline">
                        <ItemHeader>
                            <div>
                                <ItemTitle>Current Exercise</ItemTitle>
                                <Label><strong>Goblet Squats</strong></Label>
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
                </div>
                <div>
                    <Item variant="outline">
                        <ItemHeader>
                            <ItemTitle>Select Date & Time</ItemTitle>
                        </ItemHeader>
                        <ItemContent>
                            <div className="mb-3 grid grid-flow-col">
                                <div>
                                    <ItemDescription>Select Date</ItemDescription>
                                    <DatePicker />
                                </div>
                                <div>
                                    <ItemDescription>Choose Available Time</ItemDescription>
                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Available Time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">8am-9am</SelectItem>
                                            <SelectItem value="dark">10am-11am</SelectItem>
                                            <SelectItem value="system">11am-12pm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </ItemContent>
                    </Item>
                </div>
            </div>
            <div className="m-4">
                <Item className="mb-4" variant="outline">
                    <ItemHeader>
                        <ItemTitle>Available Trainers</ItemTitle>
                    </ItemHeader>
                    <ItemContent>
                        <ScrollArea className="h-69">
                            <div className="grid grid-flow-row gap-3">
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle><strong>Trainer Name</strong></ItemTitle>
                                            <ItemDescription>Specialization</ItemDescription>
                                        </div>
                                        <Button>Pick Trainer</Button>
                                    </ItemHeader>
                                </Item>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle><strong>Trainer Name</strong></ItemTitle>
                                            <ItemDescription>Specialization</ItemDescription>
                                        </div>
                                        <Button>Pick Trainer</Button>
                                    </ItemHeader>
                                </Item>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle><strong>Trainer Name</strong></ItemTitle>
                                            <ItemDescription>Specialization</ItemDescription>
                                        </div>
                                        <Button>Pick Trainer</Button>
                                    </ItemHeader>
                                </Item>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle><strong>Trainer Name</strong></ItemTitle>
                                            <ItemDescription>Specialization</ItemDescription>
                                        </div>
                                        <Button>Pick Trainer</Button>
                                    </ItemHeader>
                                </Item>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle><strong>Trainer Name</strong></ItemTitle>
                                            <ItemDescription>Specialization</ItemDescription>
                                        </div>
                                        <Button>Pick Trainer</Button>
                                    </ItemHeader>
                                </Item>
                            </div>
                        </ScrollArea>
                    </ItemContent>
                </Item>
                <Button><Check />Submit Appointment</Button>
            </div>
        </AppLayout >

    );
}
