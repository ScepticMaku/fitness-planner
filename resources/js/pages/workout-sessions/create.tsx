// resources/js/Pages/Sessions/CreateSimple.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Workout Progress',
        href: '/workout-progress'
    },
    {
        title: 'Book Session',
        href: '/book-session'
    },
];

export default function CreateSession({ trainers, currentExercise }: any) {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { data, setData, post, processing, errors } = useForm({
        trainer_id: '',
        slot_id: '',
        exercise_id: currentExercise.id,
        exercise_details: currentExercise
    });

    // Fix: Create a consistent date formatting function
    const formatDateToLocalString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fix: Get today's date without time component for comparison
    const getToday = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    };

    // Fetch available slots when trainer or date changes
    useEffect(() => {
        if (selectedTrainer && selectedDate) {
            router.post('/workout-sessions/create', {
                trainer_id: selectedTrainer,
                date: selectedDate
            }, {
                onSuccess: (page) => {
                    setAvailableSlots(page.props.slots || []);
                    setSelectedSlot(null);
                }
            });
        }
    }, [selectedTrainer, selectedDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sessions.store'));
    };

    const handleTrainerSelect = (trainerId) => {
        setSelectedTrainer(trainerId);
        setData('trainer_id', trainerId);
        setSelectedSlot(null);
        setAvailableSlots([]);
        setSelectedDate('');
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setData('slot_id', slot.id);
    };

    // Fixed calendar generation
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const days = [];
        const today = getToday();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = formatDateToLocalString(date);
            const isSelected = selectedDate === dateString;
            const isToday = formatDateToLocalString(today) === dateString;
            const isPast = date < today;

            days.push({
                date: dateString,
                day,
                isSelected,
                isToday,
                isPast
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const navigateMonth = (direction) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book a Session" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book a Session</h1>

                        {/* Current Exercise */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Current Exercise</h2>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{currentExercise.name}</h3>
                                <div className="flex gap-6 mt-2 text-sm text-gray-600">
                                    <div><span className="font-medium">Sets:</span> {currentExercise.sets}</div>
                                    <div><span className="font-medium">Reps:</span> {currentExercise.reps}</div>
                                    <div><span className="font-medium">Rest:</span> {currentExercise.rest_seconds}s</div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-6" />

                        <form onSubmit={handleSubmit}>
                            {/* Trainer Selection */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Trainers</h2>
                                <div className="space-y-3">
                                    {trainers.map((trainer) => (
                                        <button
                                            key={trainer.id}
                                            type="button"
                                            onClick={() => handleTrainerSelect(trainer.id)}
                                            className={`w-full text-left p-4 border rounded-lg transition-colors ${selectedTrainer === trainer.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{trainer.user.name}</h3>
                                                    <p className="text-sm text-gray-600">{trainer.specialization}</p>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full border-2 ${selectedTrainer === trainer.id
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'border-gray-300'
                                                    }`} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Selection */}
                            {selectedTrainer && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Date & Time</h2>

                                    {/* Simple Calendar */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                type="button"
                                                onClick={() => navigateMonth(-1)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                ←
                                            </button>
                                            <h3 className="text-lg font-semibold">
                                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => navigateMonth(1)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                →
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 mb-2">
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1">
                                            {calendarDays.map((day, index) =>
                                                day ? (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => !day.isPast && handleDateSelect(day.date)}
                                                        disabled={day.isPast}
                                                        className={`p-3 rounded-lg border text-center ${day.isSelected
                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                            : day.isToday
                                                                ? 'border-blue-300 bg-blue-50'
                                                                : day.isPast
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                                            }`}
                                                    >
                                                        {day.day}
                                                    </button>
                                                ) : (
                                                    <div key={index} className="p-3" />
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Time Slots */}
                                    {selectedDate && (
                                        <div className="mb-6">
                                            <h3 className="text-md font-medium text-gray-700 mb-3">
                                                Available times for {new Date(selectedDate).toLocaleDateString()}
                                            </h3>
                                            {availableSlots.length > 0 ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {availableSlots.map((slot) => (
                                                        <button
                                                            key={slot.id}
                                                            type="button"
                                                            onClick={() => handleSlotSelect(slot)}
                                                            className={`p-3 rounded-lg border transition-colors ${selectedSlot?.id === slot.id
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                                                                }`}
                                                        >
                                                            {slot.time}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    No available slots for this date
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Submit */}
                            {selectedSlot && (
                                <div className="flex justify-end pt-6 border-t">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Booking...' : 'Book Session'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
