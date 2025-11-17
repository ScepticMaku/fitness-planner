// resources/js/Pages/Trainer/Availability/BulkCreate.jsx
import React from 'react';
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
        title: 'Bulk Create Slot',
        href: 'schedules/manage-slots/bulk-create-slot',
    },
];

export default function AvailabilityBulkCreate({ trainer }) {
    const { data, setData, post, processing, errors } = useForm({
        start_date: '',
        end_date: '',
        start_time: '09:00',
        end_time: '17:00',
        days: [1, 2, 3, 4, 5], // Default: Monday-Friday
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('trainer.availability.bulk-store'));
    };

    const dayOptions = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
    ];

    const timeOptions = [];
    for (let hour = 6; hour <= 22; hour++) {
        for (let minute = 0; minute < 60; minute += 60) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeOptions.push(timeString);
        }
    }

    const toggleDay = (day) => {
        setData('days', data.days.includes(day)
            ? data.days.filter(d => d !== day)
            : [...data.days, day]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bulk Add Availability" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Bulk Add Availability</h1>
                            <p className="text-gray-600 mt-2">
                                Add multiple availability slots at once for a date range
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Date Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.start_date && (
                                            <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            min={data.start_date || new Date().toISOString().split('T')[0]}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.end_date && (
                                            <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Time Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Start Time
                                        </label>
                                        <select
                                            value={data.start_time}
                                            onChange={e => setData('start_time', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
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
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            End Time
                                        </label>
                                        <select
                                            value={data.end_time}
                                            onChange={e => setData('end_time', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
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
                                    </div>
                                </div>

                                {/* Days of Week */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Days of the Week
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {dayOptions.map(day => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(day.value)}
                                                className={`p-3 text-center rounded-lg border transition-colors ${data.days.includes(day.value)
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                                    }`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.days && (
                                        <p className="text-red-600 text-sm mt-1">{errors.days}</p>
                                    )}
                                </div>

                                {/* Preview */}
                                {(data.start_date && data.end_date && data.days.length > 0) && (
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="font-semibold text-green-900">Bulk Create Preview</h3>
                                        <p className="text-green-700">
                                            Creating slots from {new Date(data.start_date).toLocaleDateString()} to {new Date(data.end_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-green-700">
                                            Time: {data.start_time} - {data.end_time}
                                        </p>
                                        <p className="text-green-700">
                                            Days: {data.days.map(day => dayOptions.find(d => d.value === day)?.label).join(', ')}
                                        </p>
                                        <p className="text-green-700 font-semibold">
                                            Estimated slots: {calculateSlotCount(data)}
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
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Slots'}
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

// Helper function to calculate estimated slot count
function calculateSlotCount(data) {
    if (!data.start_date || !data.end_date || !data.days.length) return 0;

    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    let count = 0;

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        if (data.days.includes(date.getDay())) {
            count++;
        }
    }

    return count;
}
