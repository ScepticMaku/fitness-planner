import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Clock, User, Dumbbell, Plus, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedules',
        href: '/schedules',
    },
];

interface AppointmentEvent {
    id: string | number;
    title: string;
    start: string;
    end: string;
    description: string;
    trainer: string;
}

export default function Index({ appointmentSchedule = [] }: { appointmentSchedule: AppointmentEvent[] }) {
    const { auth, flash } = usePage().props as any;
    const userRole = auth.roles;
    const [selectedView, setSelectedView] = useState<'list' | 'day' | 'week'>('list');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filteredAppointments, setFilteredAppointments] = useState<AppointmentEvent[]>([]);

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    useEffect(() => {
        filterAppointments();
    }, [selectedView, selectedDate, appointmentSchedule]);

    const filterAppointments = () => {
        if (selectedView === 'list') {
            // Sort by date and show all appointments
            const sorted = [...appointmentSchedule].sort((a, b) =>
                new Date(a.start).getTime() - new Date(b.start).getTime()
            );
            setFilteredAppointments(sorted);
        } else if (selectedView === 'day') {
            // Filter for selected day
            const dayAppointments = appointmentSchedule.filter(appointment => {
                const appointmentDate = new Date(appointment.start);
                return appointmentDate.toDateString() === selectedDate.toDateString();
            });
            setFilteredAppointments(dayAppointments.sort((a, b) =>
                new Date(a.start).getTime() - new Date(b.start).getTime()
            ));
        } else if (selectedView === 'week') {
            // Filter for selected week
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const weekAppointments = appointmentSchedule.filter(appointment => {
                const appointmentDate = new Date(appointment.start);
                return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
            });
            setFilteredAppointments(weekAppointments.sort((a, b) =>
                new Date(a.start).getTime() - new Date(b.start).getTime()
            ));
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        if (selectedView === 'day') {
            newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (selectedView === 'week') {
            newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        }
        setSelectedDate(newDate);
    };

    const getWeekRange = () => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    const groupAppointmentsByDate = () => {
        const groups: { [key: string]: AppointmentEvent[] } = {};
        filteredAppointments.forEach(appointment => {
            const dateKey = new Date(appointment.start).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(appointment);
        });
        return groups;
    };

    const getNextAppointment = () => {
        const upcoming = appointmentSchedule
            .filter(appointment => new Date(appointment.start) >= new Date())
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        return upcoming.length > 0 ? upcoming[0] : null;
    };

    const getTotalSessionsThisWeek = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return appointmentSchedule.filter(appointment => {
            const appointmentDate = new Date(appointment.start);
            return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        }).length;
    };

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) >= new Date();
    };

    const nextAppointment = getNextAppointment();
    const weeklySessions = getTotalSessionsThisWeek();

    const dateGroups = groupAppointmentsByDate();

    if (userRole == 'trainer') {

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Schedules" />
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Training Schedule</h1>
                            <p className="text-gray-600 mt-2">
                                View and manage your approved training appointments
                            </p>
                        </div>

                        {userRole == 'trainer' && (
                            <div className="mt-4 lg:mt-0">
                                <Link href={route('trainer.availability.index')}>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Manage Slots
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* View Controls */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={selectedView === 'list' ? 'default' : 'outline'}
                                    onClick={() => setSelectedView('list')}
                                    size="sm"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    All Appointments
                                </Button>
                                <Button
                                    variant={selectedView === 'week' ? 'default' : 'outline'}
                                    onClick={() => setSelectedView('week')}
                                    size="sm"
                                >
                                    This Week
                                </Button>
                                <Button
                                    variant={selectedView === 'day' ? 'default' : 'outline'}
                                    onClick={() => setSelectedView('day')}
                                    size="sm"
                                >
                                    Today
                                </Button>
                            </div>

                            {(selectedView === 'day' || selectedView === 'week') && (
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigateDate('prev')}
                                    >
                                        Previous
                                    </Button>

                                    <div className="flex items-center text-sm font-medium text-gray-700">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {selectedView === 'day'
                                            ? selectedDate.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : getWeekRange()
                                        }
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigateDate('next')}
                                    >
                                        Next
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedDate(new Date())}
                                    >
                                        Today
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                    <p className="text-2xl font-bold text-gray-900">{appointmentSchedule.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <User className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Current View</p>
                                    <p className="text-2xl font-bold text-gray-900 capitalize">{selectedView}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Dumbbell className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Showing</p>
                                    <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-6">
                            {filteredAppointments.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {selectedView === 'list'
                                            ? "There are no approved appointments scheduled."
                                            : selectedView === 'week'
                                                ? "No appointments scheduled for this week."
                                                : "No appointments scheduled for this day."}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {selectedView === 'list' ? (
                                        // List view - grouped by date
                                        Object.entries(dateGroups).map(([dateKey, appointments]) => (
                                            <div key={dateKey} className="border-b pb-6 last:border-b-0 last:pb-0">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                    {formatDate(dateKey)}
                                                </h3>
                                                <div className="space-y-3">
                                                    {appointments.map((appointment) => (
                                                        <AppointmentCard
                                                            key={appointment.id}
                                                            appointment={appointment}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Day/Week view - simple list
                                        <div className="space-y-3">
                                            {filteredAppointments.map((appointment) => (
                                                <AppointmentCard
                                                    key={appointment.id}
                                                    appointment={appointment}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    } else {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="My Schedule" />
                <div className="container mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Training Schedule</h1>
                            <p className="text-gray-600 mt-2">
                                Manage your personal training appointments and progress
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                    <p className="text-2xl font-bold text-gray-900">{appointmentSchedule.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">This Week</p>
                                    <p className="text-2xl font-bold text-gray-900">{weeklySessions}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Next Session</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {nextAppointment ? formatDateShort(nextAppointment.start) : 'None'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Session Banner */}
                    {nextAppointment && (
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 mb-6 text-white">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Your Next Session</h3>
                                    <p className="text-blue-100">
                                        <strong>{nextAppointment.title}</strong> with {nextAppointment.trainer}
                                    </p>
                                    <p className="text-blue-100">
                                        {formatDate(nextAppointment.start)} at {formatTime(nextAppointment.start)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Controls */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant={selectedView === 'upcoming' ? 'default' : 'outline'}
                                onClick={() => setSelectedView('upcoming')}
                                size="sm"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Upcoming Sessions
                            </Button>
                            <Button
                                variant={selectedView === 'past' ? 'default' : 'outline'}
                                onClick={() => setSelectedView('past')}
                                size="sm"
                            >
                                Past Sessions
                            </Button>
                            <Button
                                variant={selectedView === 'all' ? 'default' : 'outline'}
                                onClick={() => setSelectedView('all')}
                                size="sm"
                            >
                                All Sessions
                            </Button>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-6">
                            {filteredAppointments.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {selectedView === 'upcoming'
                                            ? "No upcoming sessions"
                                            : selectedView === 'past'
                                                ? "No past sessions"
                                                : "No sessions scheduled"}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {selectedView === 'upcoming'
                                            ? "You don't have any upcoming training sessions. Book a new session to get started!"
                                            : selectedView === 'past'
                                                ? "Your past training sessions will appear here."
                                                : "You haven't scheduled any training sessions yet."}
                                    </p>
                                    {selectedView === 'upcoming' && (
                                        <Link href={route('appointments.create')}>
                                            <Button className="bg-blue-600 hover:bg-blue-700">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Book Your First Session
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {selectedView === 'upcoming'
                                                ? `Upcoming Sessions (${filteredAppointments.length})`
                                                : selectedView === 'past'
                                                    ? `Past Sessions (${filteredAppointments.length})`
                                                    : `All Sessions (${filteredAppointments.length})`
                                            }
                                        </h3>
                                    </div>

                                    {filteredAppointments.map((appointment) => (
                                        <MemberAppointmentCard
                                            key={appointment.id}
                                            appointment={appointment}
                                            isUpcoming={isUpcoming(appointment.start)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                            <p className="text-gray-600 mb-4">
                                Track your fitness progress and see how far you've come with your training.
                            </p>
                            <Link href={route('workout-progress.index')}>
                                <Button variant="outline" className="w-full">
                                    View Progress
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }
}

// Separate component for appointment card
function AppointmentCard({ appointment }: { appointment: AppointmentEvent }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
                <div className="flex items-center mb-2">
                    <Dumbbell className="w-4 h-4 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900 text-lg">{appointment.title}</h4>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>Client: {appointment.description}</span>
                    </div>

                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDateShort(appointment.start)}</span>
                    </div>

                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                            {formatTime(appointment.start)} - {formatTime(appointment.end)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 sm:mt-0 sm:ml-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Approved
                </span>
            </div>
        </div>
    );
}

function MemberAppointmentCard({ appointment, isUpcoming }: { appointment: AppointmentEvent, isUpcoming: boolean }) {
    return (
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg transition-colors ${isUpcoming
            ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}>
            <div className="flex-1">
                <div className="flex items-center mb-2">
                    <Dumbbell className={`w-4 h-4 mr-2 ${isUpcoming ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                    <h4 className="font-semibold text-gray-900 text-lg">{appointment.title}</h4>
                    {isUpcoming && (
                        <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Upcoming
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(appointment.start)}</span>
                    </div>

                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                            {formatTime(appointment.start)} - {formatTime(appointment.end)}
                        </span>
                    </div>

                    {appointment.trainer && (
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>Trainer: {appointment.trainer}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 lg:mt-0 lg:ml-4 flex space-x-2">
                {isUpcoming ? (
                    <>
                    </>
                ) : (
                    <Link href={route('appointments.show', appointment.id)}>
                        <Button variant="outline" size="sm">
                            Session Summary
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

// Helper functions
function formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}
