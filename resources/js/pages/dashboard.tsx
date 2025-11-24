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

export default function Dashboard({ dietGuideline, exercises, currentExercise, workoutStructure, workoutLogs, pendingAppointments, appointments, userAppointments, trainerAppointments }: any) {

    console.log(workoutLogs);

    const { auth } = usePage().props as any;
    const userRole = auth.roles;
    const userId = auth.user.id;
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

        // Use local methods to convert UTC to local time
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}:${seconds}`
        };
    }

    const nextAppointment = trainerAppointments.length > 0 ? trainerAppointments[0] : null;
    const nextAppointmentDateTime = (nextAppointment != null) ? separateDateAndTimeUTC(nextAppointment.slot.start_time) : null;
    const appointmentsTodayNumber = (trainerAppointments.filter(a => isTodayUTC(a.slot.start_time))).length;
    const appointmentsToday = (trainerAppointments.filter(a => isTodayUTC(a.slot.start_time))).map(p => ({
        ...p,
        ...separateDateAndTimeUTC(p.slot.start_time)
    }));

    const nextUserAppointment = userAppointments.length > 0 ? userAppointments[0] : null;
    const nextUserAppointmentDateTime = (nextUserAppointment != null) ? separateDateAndTimeUTC(nextUserAppointment.slot.start_time) : null;
    const userAppointmentsTodayNumber = (userAppointments.filter(a => isTodayUTC(a.slot.start_time))).length;
    const userAppointmentsToday = (userAppointments.filter(a => isTodayUTC(a.slot.start_time))).map(p => ({
        ...p,
        ...separateDateAndTimeUTC(p.slot.start_time)
    }));

    console.log(nextUserAppointment);

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
                                        <div>
                                            <ItemDescription>You currently have no appointments today</ItemDescription>
                                        </div>
                                    </ScrollArea>
                                )}
                            </ItemContent>
                            <Link>
                            </Link>
                        </Item>
                        {workoutLogs.length > 0 && (
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
                        )}
                        {workoutLogs.length == 0 && (
                            <Item variant="outline">
                                <ItemHeader>
                                    <ItemTitle><strong>Client Progress History</strong></ItemTitle>
                                </ItemHeader>
                                <ItemContent>
                                    <ScrollArea className="h-40">
                                        <ItemHeader>
                                            <div>
                                                <ItemDescription>History is empty.</ItemDescription>
                                            </div>
                                        </ItemHeader>
                                    </ScrollArea>
                                </ItemContent>
                            </Item>
                        )}
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
                    <div className="mt-4 flex flex-row gap-3">
                        {nextUserAppointment == null && (
                            <Item className="grid grid-flow-row w-60" variant="outline">
                                <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                                <Label className="text-[16px]">None</Label>
                            </Item>
                        )}
                        {nextUserAppointment != null && (
                            <Item className="grid grid-flow-row w-60" variant="outline">
                                <ItemTitle><Clock4 />Next Appointment</ItemTitle>
                                <Label className="text-[16px]">{nextUserAppointmentDateTime.time} & {nextUserAppointmentDateTime.date} - {nextUserAppointment.exercise.name}</Label>
                                <ItemDescription>With: {nextUserAppointment.trainer.user.name}</ItemDescription>
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
                            {currentExercise.lenth > 0 && (
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
                            {currentExercise.length == 0 && (
                                <Item variant="outline">
                                    <div>
                                        <ItemTitle>Current Exercise</ItemTitle>
                                        <ItemDescription>None</ItemDescription>
                                    </div>
                                </Item>
                            )}
                            <div>
                                <Item variant="outline">
                                    <ItemHeader>
                                        <ItemTitle><strong>Recently Completed Exercises</strong></ItemTitle>
                                    </ItemHeader>
                                    <ItemContent>
                                        {workoutLogs.length > 0 && (
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
                                        )}
                                        {workoutLogs.length == 0 && (
                                            <ScrollArea className="h-40">
                                                <div className="grid grid-flow-cols gap-3">
                                                    <div>
                                                        <ItemDescription>You currently don't have completed exercises.</ItemDescription>
                                                    </div>
                                                </div>
                                            </ScrollArea>
                                        )}
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
                                    {userAppointmentsToday.length > 0 && (
                                        <ScrollArea className="h-40">
                                            {userAppointmentsToday.map(appointment => (
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
                                    {userAppointmentsToday.length == 0 && (
                                        <ScrollArea className="h-40">
                                            <div>
                                                <ItemDescription>You currently have no appointments today</ItemDescription>
                                            </div>
                                        </ScrollArea>
                                    )}
                                </ItemContent>
                                <Link>
                                </Link>
                            </Item>
                            {dietGuideline.length > 0 && (
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
                            {dietGuideline.length == 0 && (
                                <Item variant="outline">
                                    <div className="space-y-4">
                                        <div>
                                            <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <ItemDescription>You currently have no plan</ItemDescription>
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
