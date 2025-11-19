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

export default function Dashboard({ dietGuideline, exercises, currentExercise, workoutStructure, workoutLogs, pendingAppointments, appointments }: any) {

    const { auth } = usePage().props as any;
    const userRole = auth.roles;

    const appointmentRequests = pendingAppointments.length;
    const exerciseList = exercises || [];

    const completedExercises = exerciseList.filter(e => e.status == 'completed').length || 0;
    const exerciseLength = exerciseList.length || 0;


    function isTodayUTC(dateString: string): boolean {
        const inputDate = new Date(dateString);
        const today = new Date();

        // Compare in UTC
        return (
            inputDate.getUTCDate() === today.getUTCDate() &&
            inputDate.getUTCMonth() === today.getUTCMonth() &&
            inputDate.getUTCFullYear() === today.getUTCFullYear()
        );
    }

    function separateDateAndTimeUTC(dateString: string): { date: string; time: string } {
        const date = new Date(dateString);

        // Use UTC methods since the input has 'Z' (UTC timezone)
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`
        };
    }

    const nextAppointment = appointments.filter(a => isTodayUTC(a.slot.start_time))[0];

    const nextAppointmentDateTime = separateDateAndTimeUTC(nextAppointment.slot.start_time);
    const appointmentsTodayNumber = (appointments.filter(a => isTodayUTC(a.slot.start_time))).length;
    const appointmentsToday = (appointments.filter(a => isTodayUTC(a.slot.start_time))).map(p => ({
        ...p,
        ...separateDateAndTimeUTC(p.slot.start_time)
    }));

    if (userRole == 'trainer') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="m-4">
                    <div className="mb-2">
                        <Label className="text-[20px]"><strong>Overview</strong></Label>
                    </div>
                    <div className="flex flex-row gap-3 mb-4">
                        <Item className="grid grid-flow-row w-90" variant="outline">
                            <ItemTitle><Clock />Appointments Today</ItemTitle>
                            <Label className="text-[16px]">{appointmentsTodayNumber}</Label>
                        </Item>
                        <Item className="grid grid-flow-row w-90" variant="outline">
                            <ItemTitle><Loader />Appointment Requests</ItemTitle>
                            <Label className="text-[16px]">{appointmentRequests}</Label>
                        </Item>
                        {nextAppointment != null && (
                            <Item className="grid grid-flow-row w-90" variant="outline">
                                <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                                <Label className="text-[16px]">{nextAppointmentDateTime.time} & {nextAppointmentDateTime.date} - {nextAppointment.exercise.name}</Label>
                                <ItemDescription>With: {nextAppointment.user.name}</ItemDescription>
                            </Item>
                        )}
                        {nextAppointment == null && (
                            <Item className="grid grid-flow-row w-90" variant="outline">
                                <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                                <Label className="text-[16px]">None</Label>
                            </Item>
                        )}
                    </div>
                    <div className="mb-2">
                    </div>
                    <div className="mb-2 grid grid-flow-col grid-cols-2 gap-4">
                        <Item variant="outline">
                            <ItemHeader>
                                <ItemTitle><strong>Schedule</strong></ItemTitle>
                            </ItemHeader>
                            <ItemContent>
                                {appointmentsToday.length > 0 && (
                                    <ScrollArea className="h-40">
                                        {appointmentsToday.map(appointment => (
                                            <Item variant="outline">
                                                <ItemHeader>
                                                    <div>
                                                        <Label>{appointment.time} - {appointment.exercise.name}</Label>
                                                        <ItemDescription>{appointment.user.name}</ItemDescription>
                                                    </div>
                                                    <Link href={route('appointments.show', appointment.id)}>
                                                        <Button><Eye />View</Button>
                                                    </Link>
                                                </ItemHeader>
                                            </Item>
                                        ))}
                                    </ScrollArea>
                                )}
                                {appointmentsToday.length == 0 && (
                                    <ScrollArea className="h-40">
                                        {appointmentsToday.map(appointment => (
                                            <Item variant="outline">
                                                <div>
                                                    <Label>You currently have no appointments</Label>
                                                </div>
                                            </Item>
                                        ))}
                                    </ScrollArea>
                                )}
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
                                        {workoutLogs.map(log => (
                                            <Item variant="outline">
                                                <ItemHeader>
                                                    <div>
                                                        <Label>{log.user.name} - {log.exercise.name}</Label>
                                                        <ItemDescription>Date Completed: {log.date_completed}</ItemDescription>
                                                    </div>
                                                </ItemHeader>
                                            </Item>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </ItemContent>
                        </Item>
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
                        {nextAppointment == null && (
                            <Item className="grid grid-flow-row w-60" variant="outline">
                                <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                                <Label className="text-[16px]">None</Label>
                            </Item>
                        )}
                        {nextAppointment != null && (
                            <Item className="grid grid-flow-row w-60" variant="outline">
                                <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                                <Label className="text-[16px]">{nextAppointmentDateTime.time} & {nextAppointmentDateTime.date} - {nextAppointment.exercise.name}</Label>
                                <ItemDescription>With: {nextAppointment.trainer.user.name}</ItemDescription>
                            </Item>
                        )}
                        {workoutStructure != null && (
                            <Item className="grid grid-flow-row w-60" variant="outline">
                                <ItemTitle><Clock4 />Workout Progress</ItemTitle>
                                <Label className="text-[16px]">{workoutStructure.name}</Label>
                                <ItemDescription>Completed: {completedExercises}/{exerciseLength} Exercises</ItemDescription>
                            </Item>
                        )}
                        {workoutStructure == null && (
                            <Item className="grid grid-flow-row w-60" variant="outline">
                                <ItemTitle><Clock4 />Workout Progress</ItemTitle>
                                <Label className="text-[16px]">None</Label>
                            </Item>
                        )}
                    </div>
                    <div className="mt-4 grid grid-flow-col grid-cols-2 gap-3">
                        <div className="grid grid-flow-row gap-2">
                            {currentExercise != null && (
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle>Current Exercise</ItemTitle>
                                            <Label><strong>{currentExercise.name}</strong></Label>
                                        </div>
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
                            )}
                            {currentExercise == null && (
                                <Item variant="outline">
                                    <ItemHeader>
                                        <div>
                                            <ItemTitle>Current Exercise</ItemTitle>
                                            <Label><strong>None</strong></Label>
                                        </div>
                                    </ItemHeader>
                                </Item>
                            )}
                            <div>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <ItemTitle><strong>Recently Completed Exercises</strong></ItemTitle>
                                    </ItemHeader>
                                    <ItemContent>
                                        <ScrollArea className="h-40">
                                            <div className="grid grid-flow-cols gap-3">
                                                {workoutLogs.map(log => (
                                                    <Item variant="outline">
                                                        <ItemHeader>
                                                            <div>
                                                                <Label>{log.trainer.user.name} - {log.exercise.name}</Label>
                                                                <ItemDescription>{log.date_completed}</ItemDescription>
                                                            </div>
                                                            <Button><Eye />View</Button>
                                                        </ItemHeader>
                                                    </Item>
                                                ))}
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
                                    {appointmentsToday.length > 0 && (
                                        <ScrollArea className="h-40">
                                            {appointmentsToday.map(appointment => (
                                                <Item variant="outline">
                                                    <ItemHeader>
                                                        <div>
                                                            <Label>{appointment.time} - {appointment.exercise.name}</Label>
                                                            <ItemDescription>With: {appointment.trainer.user.name}</ItemDescription>
                                                        </div>
                                                        <Button><Eye />View</Button>
                                                    </ItemHeader>
                                                </Item>
                                            ))}
                                        </ScrollArea>
                                    )}
                                    {appointmentsToday.length == 0 && (
                                        <ScrollArea className="h-40">
                                            {appointmentsToday.map(appointment => (
                                                <Item variant="outline">
                                                    <ItemHeader>
                                                        <div>
                                                            <Label>You currently have no appointments</Label>
                                                        </div>
                                                    </ItemHeader>
                                                </Item>
                                            ))}
                                        </ScrollArea>
                                    )}
                                </ItemContent>
                                <Link>
                                </Link>
                            </Item>
                            {dietGuideline != null && (
                                <Item variant="outline">
                                    <div className="space-y-4">
                                        <div>
                                            <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                                        </div>
                                        <div className="space-y-3">
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
                                    </div>
                                </Item>
                            )}
                            {dietGuideline == null && (
                                <Item variant="outline">
                                    <div className="space-y-4">
                                        <div>
                                            <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <Label>You currently have no plan</Label>
                                            </div>
                                        </div>
                                    </div>
                                </Item>
                            )}
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
