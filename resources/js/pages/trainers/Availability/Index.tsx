import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Schedules',
        href: '/schedules',
    },
    {
        title: 'Manage Slots',
        href: 'schedules/manage-slots',
    },
];

export default function AvailabilityIndex({ slots, trainer }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const groupedSlots = Object.entries(slots).reduce((acc, [date, dateSlots]) => {
        acc[date] = dateSlots;
        return acc;
    }, {});

    const upcomingDates = Object.keys(groupedSlots)
        .filter(date => new Date(date) >= new Date().setHours(0, 0, 0, 0))
        .sort()
        .slice(0, 7); // Show next 7 days

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Availability" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
                                <p className="text-gray-600 mt-2">
                                    Manage your available time slots for {trainer.name}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={route('trainer.availability.bulk-create')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Slots
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-gray-900">
                                {Object.values(slots).flat().length}
                            </div>
                            <div className="text-gray-600">Total Slots</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-green-600">
                                {Object.values(slots).flat().filter(slot => !slot.is_booked).length}
                            </div>
                            <div className="text-gray-600">Available Slots</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-blue-600">
                                {Object.values(slots).flat().filter(slot => slot.is_booked).length}
                            </div>
                            <div className="text-gray-600">Booked Slots</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-gray-900">
                                {upcomingDates.length}
                            </div>
                            <div className="text-gray-600">Upcoming Days</div>
                        </div>
                    </div>

                    {/* Availability Calendar View */}
                    <div className="bg-white rounded-lg shadow-sm border mb-8">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Upcoming Availability</h2>
                        </div>

                        <div className="p-6">
                            {upcomingDates.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingDates.map(date => (
                                        <div key={date} className="border rounded-lg">
                                            <div className="bg-gray-50 px-4 py-3 border-b">
                                                <h3 className="font-semibold text-gray-800">
                                                    {new Date(date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        timeZone: 'UTC',
                                                    })}
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                {groupedSlots[date].length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                                        {groupedSlots[date].map(slot => (
                                                            <div
                                                                key={slot.id}
                                                                className={`p-3 rounded-lg border text-center ${slot.is_booked
                                                                    ? 'bg-red-100 border-red-300 text-red-800'
                                                                    : 'bg-green-100 border-green-300 text-green-800'
                                                                    }`}
                                                            >
                                                                <div className="font-medium">
                                                                    {new Date(slot.start_time).toLocaleTimeString('en-US', {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit',
                                                                        hour12: true,
                                                                        timeZone: 'UTC'
                                                                    })}
                                                                </div>
                                                                <div className="text-sm">
                                                                    {slot.is_booked ? 'Booked' : 'Available'}
                                                                </div>
                                                                {!slot.is_booked && (
                                                                    <button
                                                                        onClick={() => {
                                                                            if (confirm('Are you sure you want to delete this slot?')) {
                                                                                router.delete(route('trainer.availability.destroy', slot.id));
                                                                            }
                                                                        }}
                                                                        className="text-xs text-red-600 hover:text-red-800 mt-1"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-center py-4">
                                                        No availability slots for this date
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming availability</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by adding some availability slots.</p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('trainer.availability.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Add Availability
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
