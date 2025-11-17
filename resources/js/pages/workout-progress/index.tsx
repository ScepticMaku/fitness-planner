import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NotebookPen, Check, Book, Eye, ArchiveX, Clock } from 'lucide-react';
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
];

export default function Index({ allExercises, progress, appointments, plans, currentExercise, workoutLog, exercises, workoutStructure, dietGuideline }: any) {

    const appointmentsList = appointments || [];

    const appointmentExercises = appointmentsList.filter(a => a.exercise_id == currentExercise.id);
    const hasApprovedRequest = appointmentExercises.filter(a => a.status == 'approved');

    let plan = plans || [];

    const { auth } = usePage().props as any;
    const userRole = auth.roles;
    const userId = auth.user.id;
    const hasPlan = plan.filter(p => p.user_id == userId);
    const isPlanActive = hasPlan.map(h => h.is_active);

    const completedExercises = exercises.filter(e => e.status == 'completed').length;
    const uncompletedExercises = exercises.filter(e => e.status == 'uncompleted').length;
    const exerciseLength = exercises.length;
    const progressValue = (completedExercises / exerciseLength) * 100;


    const [searchValue, setSearchValue] = useState('');
    const [showList, setShowList] = useState(true);

    console.log(progress);

    const clients = appointments.filter(appointment => appointment.status == 'approved');

    console.log(plan);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setShowList(value.length > 0);
    }

    const filteredClients = clients.filter(client =>
        client.user.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (userRole == 'member' && isPlanActive == 0 && hasPlan == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Schedules" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArchiveX />
                        </EmptyMedia>
                        <EmptyTitle>No Active Plan</EmptyTitle>
                        <EmptyDescription>You currenty have no active plan.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Link href={route('plan-templates.index')}>
                            <Button>Search Plans</Button>
                        </Link>
                    </EmptyContent>
                </Empty>
            </AppLayout>
        );
    }

    if (userRole == 'trainer') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Workout Progress" />
                <div className="m-4">
                    <div className="mb-4">
                        <Label><strong>Search Client</strong></Label>
                        <Input
                            type="text"
                            placeholder="Client Name"
                            value={searchValue}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Label>Clients List</Label>
                    {showList && filteredClients.length > 0 && (
                        <div className="grid grid-flow-col grid-cols-3 gap-2">
                            {filteredClients.map((client, index) => (
                                <div key={index}>
                                    <Item variant="outline">
                                        <ItemHeader>
                                            <Label>{client.user.name}</Label>
                                            <Link href={route('workout-progress.show', client.user.id)}>
                                                <Button><Eye />View Progress</Button>
                                            </Link>
                                        </ItemHeader>
                                    </Item>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AppLayout>
        )
    }

    if (progress.length == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Schedules" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArchiveX />
                        </EmptyMedia>
                        <EmptyTitle>No Workout</EmptyTitle>
                        <EmptyDescription>You have successfully completed your workout plan.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Link href={route('fitness-plan.index')}>
                            <Button>Fitness Plan</Button>
                        </Link>
                    </EmptyContent>
                </Empty>
            </AppLayout>
        );

    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workout Progress" />
            <div className="m-4">
                <ItemDescription>Current Fitness Plan</ItemDescription>
                <ItemTitle className="text-[20px]"><strong>{workoutStructure.name}</strong></ItemTitle>
                <div className="mt-4 grid grid-flow-row grid-cols-2 gap-4">
                    <div className="grid grid-flow-row gap-2">
                        <Item variant="outline">
                            <ItemHeader>
                                <div>
                                    <ItemTitle>Current Exercise</ItemTitle>
                                    <Label><strong>{currentExercise.name}</strong></Label>
                                </div>
                                {(hasApprovedRequest == 0 && progress.status == 'completed') && (
                                    <div>
                                        <Badge><Clock /><Check />Workout Completed</Badge>
                                        <Link className="ml-2" href={route('fitness-plan.index')}>
                                            <Button><NotebookPen />Fitness Plan</Button>
                                        </Link>
                                    </div>

                                )}
                                {(hasApprovedRequest == 0 && progress.status == 'in-progress') && (
                                    <div>
                                        <Link href={route('workout-progress.view-requests')}>
                                            <Button><Eye />View Pending Requests</Button>
                                        </Link>
                                        <Link className="ml-2" href={route('workout-sessions.create')}>
                                            <Button><Book />Book a Session</Button>
                                        </Link>
                                    </div>
                                )}
                                {hasApprovedRequest.length == 1 && (
                                    <div>
                                        <Badge><Clock />Session in progress</Badge>
                                    </div>
                                )}
                            </ItemHeader>
                            <ItemContent>
                                <div className="grid grid-flow-col gap-3">
                                    <div>
                                        <Label className="mr-2">Sets:</Label>
                                        <Badge>{currentExercise.sets}</Badge>
                                    </div>
                                    <div>
                                        <Label className="mr-2">Reps:</Label>
                                        <Badge>{currentExercise.reps}</Badge>
                                    </div>
                                    <div>
                                        <Label className="mr-2">Rest Seconds:</Label>
                                        <Badge>{currentExercise.rest_seconds}</Badge>
                                    </div>
                                </div>
                            </ItemContent>
                        </Item>
                        <Item variant="outline">
                            <ItemTitle>Completed Exercises:</ItemTitle>
                            <Label><strong>{completedExercises}/{exerciseLength}</strong></Label>
                            <Progress value={progressValue} />
                        </Item>
                    </div>
                    <div>
                        <Item variant="outline">
                            <ItemHeader>
                                <ItemTitle>Exercise Progress</ItemTitle>
                                <Label>Completed: {completedExercises}/{exerciseLength}</Label>
                            </ItemHeader>
                            <ItemContent>
                                <ScrollArea className="h-44">
                                    <div className="grid grid-flow-row gap-2">
                                        {exercises.map((e: any) => (
                                            <Item variant="outline" className="grid grid-flow-col">
                                                <ItemTitle className="align-left">{e.exercise.name}</ItemTitle>
                                                <div className="grid grid-flow-col gap-1">
                                                    <Badge>reps: {e.exercise.reps}</Badge>
                                                    <Badge>sets: {e.exercise.sets}</Badge>
                                                    <Badge>rest reconds: {e.exercise.rest_seconds}</Badge>
                                                </div>
                                                <Label className="text-right capitalize">{e.status}</Label>
                                            </Item>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </ItemContent>
                        </Item>
                    </div>
                    <div>
                        <div className="space-y-3">
                            <div>
                                <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <ItemTitle><strong>Name</strong></ItemTitle>
                                    <Label>{dietGuideline.name}</Label>
                                </div>
                                <div>
                                    <ItemTitle><strong>Description</strong></ItemTitle>
                                    <p>{dietGuideline.description}</p>
                                </div>
                                <div>
                                    <ItemTitle><strong>Diet Type</strong></ItemTitle>
                                    <Label>{dietGuideline.diet_type}</Label>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <ItemTitle className="text-[18px]"><strong>Macronutrients</strong></ItemTitle>
                            </div>
                            <div className="grid grid-cols-3">
                                <div>
                                    <ItemTitle><strong>Protein Grams</strong></ItemTitle>
                                    <Label>{dietGuideline.macronutrient.protein_grams}</Label>
                                </div>
                                <div>
                                    <ItemTitle><strong>Carbohydrates</strong></ItemTitle>
                                    <Label>{dietGuideline.macronutrient.carbohydrates}</Label>
                                </div>
                                <div>
                                    <ItemTitle><strong>Fats</strong></ItemTitle>
                                    <Label>{dietGuideline.macronutrient.fats}</Label>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <ItemTitle className="text-[18px]"><strong>Rules</strong></ItemTitle>
                            </div>
                            {dietGuideline.rule.map((r: any) => (
                                <Item variant="outline">
                                    <div>
                                        <Label>{r.name}</Label>
                                    </div>
                                </Item>
                            ))}
                            <div>
                                <ItemTitle className="text-[18px]"><strong>Food Recommendations</strong></ItemTitle>
                            </div>
                            {dietGuideline.food_recommendation.map((food: any) => (
                                <Item variant="outline">
                                    <div>
                                        <Label>{food.name}</Label>
                                    </div>
                                </Item>
                            ))}
                            <div>
                                <ItemTitle className="text-[16px]"><strong>Food Limitations</strong></ItemTitle>
                            </div>
                            {dietGuideline.food_limitation.map((food: any) => (
                                <Item variant="outline">
                                    <div>
                                        <Label>{food.name}</Label>
                                    </div>
                                </Item>
                            ))}
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
                                            <TableHead >Exercise</TableHead>
                                            <TableHead>Date Completed</TableHead>
                                            <TableHead >Trainer</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {workoutLog.map(workout => (
                                            <TableRow>
                                                <TableCell >{workout.exercise.name}</TableCell>
                                                <TableCell>{workout.date_completed}</TableCell>
                                                <TableCell>{workout.trainer.user.name}</TableCell>
                                            </TableRow>
                                        ))}
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
