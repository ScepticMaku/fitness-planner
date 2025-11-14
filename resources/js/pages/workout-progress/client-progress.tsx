import { Item, ItemContent, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Check, ChevronLeft, Eye } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workout Progress',
        href: '/workout-progress'
    },
    {
        title: 'Client Progress',
        href: '/client-progress'
    },
];

export default function ClientProgress() {

    const workoutLog = [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Progress" />
            <div className="m-4">
                <div>
                    <div className="mb-4">
                        <Link href={route('workout-progress.index')}>
                            <Button><ChevronLeft /> Back</Button>
                        </Link>
                    </div>
                    <ItemTitle className="text-[20px]"><strong>Workout Structure</strong></ItemTitle>
                </div>
                <div className="grid grid-flow-row grid-cols-2 gap-4">
                    <div className="grid grid-flow-row gap-2">
                        <Item variant="outline">
                            <ItemHeader>
                                <div>
                                    <ItemTitle>Current Exercise</ItemTitle>
                                    <Label><strong>Exercise Name</strong></Label>
                                </div>
                                <Link >
                                    <Button><Check /> Complete Exercise</Button>
                                </Link>
                            </ItemHeader>
                            <ItemContent>
                                <div className="grid grid-flow-col gap-3">
                                    <div>
                                        <Label className="mr-2">Sets:</Label>
                                        <Badge>1</Badge>
                                    </div>
                                    <div>
                                        <Label className="mr-2">Reps:</Label>
                                        <Badge>8-15</Badge>
                                    </div>
                                    <div>
                                        <Label className="mr-2">Rest Seconds:</Label>
                                        <Badge>75</Badge>
                                    </div>
                                </div>
                            </ItemContent>
                        </Item>
                        <Item variant="outline">
                            <ItemTitle>Completed Exercises:</ItemTitle>
                            <Label><strong>1/4</strong></Label>
                            <Progress value={50} />
                        </Item>
                    </div>
                    <div>
                        <Item variant="outline">
                            <ItemHeader>
                                <ItemTitle>Exercise Progress</ItemTitle>
                                <Label>Completed: 0/4</Label>
                            </ItemHeader>
                            <ItemContent>
                                <ScrollArea className="h-44">
                                    <div className="grid grid-flow-row gap-2">
                                        <Item variant="outline" className="grid grid-flow-col">
                                            <ItemTitle className="align-left">Name</ItemTitle>
                                            <div className="grid grid-flow-col gap-1">
                                                <Badge>reps: 3</Badge>
                                                <Badge>sets: 1</Badge>
                                                <Badge>rest reconds: 60</Badge>
                                            </div>
                                            <Label className="text-right capitalize">Uncompleted</Label>
                                        </Item>
                                    </div>
                                </ScrollArea>
                            </ItemContent>
                        </Item>
                    </div>
                    <div >
                        <div className="space-y-3">
                            <div>
                                <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <ItemTitle><strong>Name</strong></ItemTitle>
                                    <Label>Guideline Name</Label>
                                </div>
                                <div>
                                    <ItemTitle><strong>Description</strong></ItemTitle>
                                    <p>Description</p>
                                </div>
                                <div>
                                    <ItemTitle><strong>Diet Type</strong></ItemTitle>
                                    <Label>Diet type</Label>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <ItemTitle className="text-[18px]"><strong>Macronutrients</strong></ItemTitle>
                            </div>
                            <div className="grid grid-cols-3">
                                <div>
                                    <ItemTitle><strong>Protein Grams</strong></ItemTitle>
                                    <Label>1989</Label>
                                </div>
                                <div>
                                    <ItemTitle><strong>Carbohydrates</strong></ItemTitle>
                                    <Label>408</Label>
                                </div>
                                <div>
                                    <ItemTitle><strong>Fats</strong></ItemTitle>
                                    <Label>80</Label>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <ItemTitle className="text-[18px]"><strong>Rules</strong></ItemTitle>
                            </div>
                            <Item variant="outline">
                                <div>
                                    <Label>rule name</Label>
                                </div>
                            </Item>
                            <div>
                                <ItemTitle className="text-[18px]"><strong>Food Recommendations</strong></ItemTitle>
                            </div>
                            <Item variant="outline">
                                <div>
                                    <Label>Food name</Label>
                                </div>
                            </Item>
                            <div>
                                <ItemTitle className="text-[16px]"><strong>Food Limitations</strong></ItemTitle>
                            </div>
                            <Item variant="outline">
                                <div>
                                    <Label>Food name</Label>
                                </div>
                            </Item>
                        </div>
                    </div>
                    <div>
                        {workoutLog.length == 0 && (
                            <Item variant="outline">
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyTitle>Workout History Empty</EmptyTitle>
                                        <EmptyDescription>You currenty have no history yet.</EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            </Item>
                        )}
                        {workoutLog.length != 0 && (
                            <Item variant="outline">
                                <ItemHeader>
                                    <ItemTitle>Workout History</ItemTitle>
                                </ItemHeader>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Exercise</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">INV001</TableCell>
                                            <TableCell>Paid</TableCell>
                                            <TableCell>Credit Card</TableCell>
                                            <TableCell className="text-right">$250.00</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Item>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}
