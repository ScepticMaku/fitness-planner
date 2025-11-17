// resources/js/Pages/Trainer/Availability/Create.jsx
import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
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
    {
        title: 'Create Slot',
        href: 'schedules/manage-slots/create-slot',
    },
];

export default function AvailabilityCreate({ trainer }) {
    const { data, setData, post, processing, errors } = useForm({
        start_time: '',
        end_time: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('trainer.availability.store'));
    };

    // Generate time options
    const timeOptions = [];
    for (let hour = 6; hour <= 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeOptions.push(timeString);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Availability Slot" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Add Availability Slot</h1>
                            <p className="text-gray-600 mt-2">
                                Add a single time slot when you're available for sessions
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Date Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={data.start_time.split('T')[0] || ''}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            if (date && data.start_time) {
                                                const currentTime = data.start_time.split('T')[1] || '09:00';
                                                setData('start_time', `${date}T${currentTime}`);
                                            }
                                            if (date && data.end_time) {
                                                const currentTime = data.end_time.split('T')[1] || '10:00';
                                                setData('end_time', `${date}T${currentTime}`);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Start Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Time
                                    </label>
                                    <select
                                        value={data.start_time.split('T')[1] || ''}
                                        onChange={(e) => {
                                            const time = e.target.value;
                                            if (time && data.start_time) {
                                                const currentDate = data.start_time.split('T')[0] || new Date().toISOString().split('T')[0];
                                                setData('start_time', `${currentDate}T${time}`);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select start time</option>
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>
                                                {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.start_time && (
                                        <p className="text-red-600 text-sm mt-1">{errors.start_time}</p>
                                    )}
                                </div>

                                {/* End Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Time
                                    </label>
                                    <select
                                        value={data.end_time.split('T')[1] || ''}
                                        onChange={(e) => {
                                            const time = e.target.value;
                                            if (time && data.end_time) {
                                                const currentDate = data.end_time.split('T')[0] || new Date().toISOString().split('T')[0];
                                                setData('end_time', `${currentDate}T${time}`);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select end time</option>
                                        {timeOptions.map(time => (
                                            <option key={time} value={time}>
                                                {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.end_time && (
                                        <p className="text-red-600 text-sm mt-1">{errors.end_time}</p>
                                    )}
                                </div>

                                {/* Duration Preview */}
                                {(data.start_time && data.end_time) && (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-blue-900">Slot Preview</h3>
                                        <p className="text-blue-700">
                                            {new Date(data.start_time).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-blue-700">
                                            {new Date(data.start_time).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })} - {new Date(data.end_time).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </p>
                                        <p className="text-blue-700">
                                            Duration: {Math.round((new Date(data.end_time) - new Date(data.start_time)) / (1000 * 60))} minutes
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-6 border-t">
                                    <Link
                                        href={route('trainer.availability.index')}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Adding...' : 'Add Slot'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
