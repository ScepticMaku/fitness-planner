import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { ArchiveX, Eye } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Toggle } from '@/components/ui/toggle';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fitness Plan',
        href: '/fitness-plan',
    },
];

interface Exercise {
    id: number;
    name: string;
    sets: number;
    reps: string;
    rest_seconds: number;
}

interface WorkoutStructure {
    id: number;
    name: string;
    exercises: Exercise[];
}

interface Macronutrient {
    id: number;
    protein_grams: number;
    carbohydrates: number;
    fats: number;
}

interface DietGuideline {
    id: number;
    name: string;
    description: string;
    diet_type: string;
    calorie_target: number;
    macronutrient: Macronutrient[];
    rule: Array<{
        id: number;
        name: string;
    }>;
    food_recommendation: Array<{
        id: number;
        name: string;
    }>;
    food_limitation: Array<{
        id: number;
        name: string;
    }>;
}

interface User {
    id: number;
    name: string;
}

interface PlanTemplate {
    id: number;
    user_id: number;
    title: string;
    goal: string;
    fitness_level: string;
    plan_type: string;
    description: string;
    workout_structure: WorkoutStructure[];
    diet_guideline: DietGuideline[];
    user: User[];
}

interface UserHasPlan {
    id: number;
    user_id: number;
    plan_template_id: number;
    is_active: boolean;
}

interface PageProps {
    userHasPlan: UserHasPlan;
    template: PlanTemplate;
}

export default function Index({ plans, template }: any) {

    let selectedWorkout = null;
    let selectedGuideline = null;

    const { auth, flash } = usePage().props as any;
    const userId = auth.user.id;
    const hasPlan = plans.filter(p => p.user_id == userId);
    const planId = hasPlan.map(h => h.id);
    const templateId = hasPlan.map(h => h.plan_template_id);
    const workoutId = hasPlan.map(h => h.workout_structure_id);
    const guidelineId = hasPlan.map(h => h.diet_guideline_id);
    const isPlanActive = hasPlan.map(h => h.is_active);

    const { put, errors, data, setData } = useForm({
        title: template.title,
        goal: template.goal,
        fitness_level: template.fitness_level,
        plan_type: template.plan_type,
        description: template.description,
        workout_structure: template.workout_structure || [],
        diet_guidelines: template.diet_guideline || [],
        workout_structure_id: null as number,
        diet_guideline_id: null as number
    });

    const [selectedGuidelineId, setSelectedGuidelineId] = useState<number | null>(null);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

    const handleGuidelineSelect = (guidelineId: number) => {
        setSelectedGuidelineId(guidelineId);

        setData('diet_guideline_id', guidelineId);
    }

    const handleWorkoutSelect = (workoutId: number) => {
        setSelectedWorkoutId(workoutId);
        setData('workout_structure_id', workoutId);
    }

    const { delete: destroy } = useForm();

    const handleCancel = (id: number) => {
        if (confirm(`Do you want to cancel plan?`)) {
            destroy(route('user-has-plans.cancel', id));
        }
    }

    const handleStart = (id: number) => {
        if (confirm(`Do you want to start plan?`)) {
            put(route('user-has-plans.start', id));
        }
    }

    useEffect(() => {
        if (flash.message) {
            toast(flash.message);
        }
    }, [flash.message]);

    if (hasPlan.length == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Schedules" />
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ArchiveX />
                        </EmptyMedia>
                        <EmptyTitle>Plan Empty</EmptyTitle>
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

    if (isPlanActive == 0) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Fitness Plan" />
                <div className="m-4 space-y-3">
                    <h1>Currently Selected Fitness Plan</h1>
                    <div>
                        <ItemHeader>
                            <div className="space-y-3">
                                <ItemTitle className="text-[20px]"><strong>{data.title}</strong></ItemTitle>
                                {template.user == null && (
                                    <ItemDescription>Created by: Deleted Trainer</ItemDescription>
                                )}
                                {template.user != null && (
                                    <ItemDescription>Created by: {template.user.name}</ItemDescription>
                                )}
                                <div>
                                    <Label><strong>Goal</strong></Label>
                                    <ItemTitle>{data.goal}</ItemTitle>
                                </div>
                                <div>
                                    <Label><strong>Fitness Level</strong></Label>
                                    <ItemTitle className="capitalize">{data.fitness_level}</ItemTitle>
                                </div>
                                <div>
                                    <Label><strong>Plan Type</strong></Label>
                                    <ItemTitle>{data.plan_type}</ItemTitle>
                                </div>
                                <div>
                                    <ItemDescription>{data.description}</ItemDescription>
                                </div>
                            </div>
                        </ItemHeader>
                        <Separator />
                        <ItemContent>
                            <ItemTitle className="text-[20px]"><strong>Workouts</strong></ItemTitle>
                            <div className="space-y-4 grid grid-cols-3 gap-3">
                                {template.workout_structure.map((workout: any) => (
                                    <div key={workout.key}>
                                        <Item variant="outline">
                                            <div className="space-y-2">
                                                <div>
                                                    <Label className="text-[20px]">{workout.name}</Label>
                                                </div>
                                                <div>
                                                    <Toggle
                                                        variant="outline"
                                                        pressed={selectedWorkoutId === workout.id}
                                                        onPressedChange={() => handleWorkoutSelect(workout.id)}
                                                    >Select Workout</Toggle>
                                                    <InputError
                                                        message={errors.workout_structure_id}
                                                    />
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <ItemTitle className="text-[20px]"><strong>Exercises</strong></ItemTitle>
                                                {workout.exercise.map((exercise: any) => (
                                                    <div className="space-y-2">
                                                        <Item variant="outline">
                                                            <div>
                                                                <Label className="text-[20px]">{exercise.name}</Label>
                                                            </div>
                                                            <Separator />
                                                            <div className="grid grid-flow-col grid-cols-3">
                                                                <div>
                                                                    <ItemTitle><strong>Sets</strong></ItemTitle>
                                                                    <Label>{exercise.sets}</Label>
                                                                </div>
                                                                <div>
                                                                    <ItemTitle><strong>Reps</strong></ItemTitle>
                                                                    <Label>{exercise.reps}</Label>
                                                                </div>
                                                                <div>
                                                                    <ItemTitle><strong>Rest (seconds)</strong></ItemTitle>
                                                                    <Label>{exercise.rest_seconds}</Label>
                                                                </div>
                                                            </div>
                                                        </Item>
                                                    </div>
                                                ))}
                                            </div>
                                        </Item>
                                    </div>
                                ))}
                            </div>
                        </ItemContent>
                        <Separator />
                        <ItemFooter className="flex">
                            <div className="grow">
                                {template.diet_guideline.map((guideline: any) => (
                                    <div key={guideline.key}>
                                        <div className="space-y-3">
                                            <div>
                                                <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                                            </div>
                                            <div>
                                                <Toggle
                                                    variant="outline"
                                                    pressed={selectedGuidelineId === guideline.id}
                                                    onPressedChange={() => handleGuidelineSelect(guideline.id)}
                                                >Select Guideline</Toggle>
                                                <InputError
                                                    message={errors.diet_guideline_id}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <ItemTitle><strong>Name</strong></ItemTitle>
                                                    <Label>{guideline.name}</Label>
                                                </div>
                                                <div>
                                                    <ItemTitle><strong>Description</strong></ItemTitle>
                                                    <p>{guideline.description}</p>
                                                </div>
                                                <div>
                                                    <ItemTitle><strong>Diet Type</strong></ItemTitle>
                                                    <Label>{guideline.diet_type}</Label>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <ItemTitle className="text-[18px]"><strong>Macronutrients</strong></ItemTitle>
                                            </div>
                                            <div className="grid grid-cols-3">
                                                <div>
                                                    <ItemTitle><strong>Protein Grams</strong></ItemTitle>
                                                    <Label>{guideline.macronutrient.protein_grams}</Label>
                                                </div>
                                                <div>
                                                    <ItemTitle><strong>Carbohydrates</strong></ItemTitle>
                                                    <Label>{guideline.macronutrient.carbohydrates}</Label>
                                                </div>
                                                <div>
                                                    <ItemTitle><strong>Fats</strong></ItemTitle>
                                                    <Label>{guideline.macronutrient.fats}</Label>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div>
                                                <ItemTitle className="text-[18px]"><strong>Rules</strong></ItemTitle>
                                            </div>
                                            {guideline.rule.map((rule: any) => (
                                                <Item variant="outline">
                                                    <div>
                                                        <Label>{rule.name}</Label>
                                                    </div>
                                                </Item>
                                            ))}
                                            <div>
                                                <ItemTitle className="text-[18px]"><strong>Food Recommendations</strong></ItemTitle>
                                            </div>
                                            {guideline.food_recommendation.map((recommendation: any) => (
                                                <Item variant="outline">
                                                    <div>
                                                        <Label>{recommendation.name}</Label>
                                                    </div>
                                                </Item>
                                            ))}
                                            <div>
                                                <ItemTitle className="text-[16px]"><strong>Food Limitations</strong></ItemTitle>
                                            </div>
                                            {guideline.food_limitation.map((limitation: any) => (
                                                <Item variant="outline">
                                                    <div>
                                                        <Label>{limitation.name}</Label>
                                                    </div>
                                                </Item>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ItemFooter>
                    </div>
                    <div className="space-x-2">
                        <Button onClick={() => handleStart(templateId)}>Start Plan</Button>
                        <Link href={route('plan-templates.index')}>
                            <Button>Change Template</Button>
                        </Link>
                        <Button onClick={() => handleCancel(planId)}>Cancel Plan</Button>
                    </div>
                </div >
            </AppLayout >
        );
    } else {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Fitness Plan" />
                <div className="m-4 space-y-3">
                    <div>
                        <ItemHeader>
                            <div className="space-y-3">
                                <ItemTitle className="text-[20px]"><strong>{data.title}</strong></ItemTitle>
                                {template.user == null && (
                                    <ItemDescription>Created by: Deleted Trainer</ItemDescription>
                                )}
                                {template.user != null && (
                                    <ItemDescription>Created by: {template.user.name}</ItemDescription>
                                )}
                                <div>
                                    <Label><strong>Goal</strong></Label>
                                    <ItemTitle>{data.goal}</ItemTitle>
                                </div>
                                <div>
                                    <Label><strong>Fitness Level</strong></Label>
                                    <ItemTitle className="capitalize">{data.fitness_level}</ItemTitle>
                                </div>
                                <div>
                                    <Label><strong>Plan Type</strong></Label>
                                    <ItemTitle>{data.plan_type}</ItemTitle>
                                </div>
                                <div>
                                    <ItemDescription>{data.description}</ItemDescription>
                                </div>
                            </div>
                        </ItemHeader>
                        <Separator />
                        <ItemContent>
                            <ItemTitle className="text-[20px]"><strong>Workouts</strong></ItemTitle>
                            <div className="space-y-4 mb-4">
                                {hasPlan != null && (
                                    template.workout_structure.filter(w => w.id == workoutId).map((workout: any) => (
                                        <div key={workout.key}>
                                            <Item variant="outline">
                                                <div className="space-y-2">
                                                    <div>
                                                        <Label className="text-[20px]">{workout.name}</Label>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="space-y-2">
                                                    <ItemTitle className="text-[20px]"><strong>Exercises</strong></ItemTitle>
                                                    {workout.exercise.map((exercise: any) => (
                                                        <div className="space-y-2">
                                                            <Item variant="outline">
                                                                <div>
                                                                    <Label className="text-[20px]">{exercise.name}</Label>
                                                                </div>
                                                                <Separator />
                                                                <div className="grid grid-flow-col grid-cols-3">
                                                                    <div>
                                                                        <ItemTitle><strong>Sets</strong></ItemTitle>
                                                                        <Label>{exercise.sets}</Label>
                                                                    </div>
                                                                    <div>
                                                                        <ItemTitle><strong>Reps</strong></ItemTitle>
                                                                        <Label>{exercise.reps}</Label>
                                                                    </div>
                                                                    <div>
                                                                        <ItemTitle><strong>Rest (seconds)</strong></ItemTitle>
                                                                        <Label>{exercise.rest_seconds}</Label>
                                                                    </div>
                                                                </div>
                                                            </Item>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Item>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ItemContent>
                        <ItemFooter className="flex">
                            <div className="grow">
                                {hasPlan != null && (
                                    template.diet_guideline.filter(guideline => guideline.id == guidelineId).map((guideline: any) => (
                                        <div key={guideline.key}>
                                            <div className="space-y-3">
                                                <div>
                                                    <ItemTitle className="text-[20px]"><strong>Diet Guidelines</strong></ItemTitle>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <ItemTitle><strong>Name</strong></ItemTitle>
                                                        <Label>{guideline.name}</Label>
                                                    </div>
                                                    <div>
                                                        <ItemTitle><strong>Description</strong></ItemTitle>
                                                        <p>{guideline.description}</p>
                                                    </div>
                                                    <div>
                                                        <ItemTitle><strong>Diet Type</strong></ItemTitle>
                                                        <Label>{guideline.diet_type}</Label>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div>
                                                    <ItemTitle className="text-[18px]"><strong>Macronutrients</strong></ItemTitle>
                                                </div>
                                                <div className="grid grid-cols-3">
                                                    <div>
                                                        <ItemTitle><strong>Protein Grams</strong></ItemTitle>
                                                        <Label>{guideline.macronutrient.protein_grams}</Label>
                                                    </div>
                                                    <div>
                                                        <ItemTitle><strong>Carbohydrates</strong></ItemTitle>
                                                        <Label>{guideline.macronutrient.carbohydrates}</Label>
                                                    </div>
                                                    <div>
                                                        <ItemTitle><strong>Fats</strong></ItemTitle>
                                                        <Label>{guideline.macronutrient.fats}</Label>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div>
                                                    <ItemTitle className="text-[18px]"><strong>Rules</strong></ItemTitle>
                                                </div>
                                                {guideline.rule.map((rule: any) => (
                                                    <Item variant="outline">
                                                        <div>
                                                            <Label>{rule.name}</Label>
                                                        </div>
                                                    </Item>
                                                ))}
                                                <div>
                                                    <ItemTitle className="text-[18px]"><strong>Food Recommendations</strong></ItemTitle>
                                                </div>
                                                {guideline.food_recommendation.map((recommendation: any) => (
                                                    <Item variant="outline">
                                                        <div>
                                                            <Label>{recommendation.name}</Label>
                                                        </div>
                                                    </Item>
                                                ))}
                                                <div>
                                                    <ItemTitle className="text-[16px]"><strong>Food Limitations</strong></ItemTitle>
                                                </div>
                                                {guideline.food_limitation.map((limitation: any) => (
                                                    <Item variant="outline">
                                                        <div>
                                                            <Label>{limitation.name}</Label>
                                                        </div>
                                                    </Item>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ItemFooter>
                    </div>
                    <Link href={route('workout-progress.index')}>
                        <Button><Eye />View Progress</Button>
                    </Link>
                </div>
            </AppLayout >
        )
    }
}
