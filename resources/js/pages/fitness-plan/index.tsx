import AppLayout from '@/layouts/app-layout';
import { useEffect } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { ArchiveX } from 'lucide-react';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fitness Plan',
        href: '/fitness-plan',
    },
];

export default function Index({ plans, template }: any) {

    const { auth, flash } = usePage().props as any;
    const userId = auth.user.id;
    const hasPlan = plans.filter(p => p.user_id == userId);
    const planId = hasPlan.map(h => h.id);
    const isPlanActive = hasPlan.map(h => h.is_active);

    const { put } = useForm();

    const { data } = useForm({
        title: template.title,
        goal: template.goal,
        fitness_level: template.fitness_level,
        plan_type: template.plan_type,
        description: template.description,
        workout_structure: template.workout_structure || [],
        diet_guidelines: template.diet_guidelines || [],
    });

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

    const getWorkoutsArray = () => {
        return Object.entries(data.workout_structure).map(([key, workout]) => ({
            key,
            ...workout
        }));
    };

    const getGuidelinesArray = () => {
        return Object.entries(data.diet_guidelines).map(([key, guideline]) => ({
            key,
            ...guideline
        }))
    };

    const workoutsArray = getWorkoutsArray();
    const guidelinesArray = getGuidelinesArray();

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
                <h1>Currently Selected Fitness Plan</h1>
                <div>
                    <Item variant="outline" >
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
                            <div>
                                <div className="space-y-4">
                                    {workoutsArray.map((workout) => (
                                        <div key={workout.key} className="space-y-3">
                                            <div className="space-y-2">
                                                <ItemTitle className="text-[18px]"><strong>Workouts</strong></ItemTitle>
                                                <div>
                                                    <ItemTitle><strong>Workout Name</strong></ItemTitle>
                                                    <Label>{workout.name}</Label>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="space-y-2">
                                                <ItemTitle className="text-[18px]"><strong>Exercises</strong></ItemTitle>
                                                {workout.exercises.map((exercise) => (
                                                    <div className="space-y-1">
                                                        <div>
                                                            <ItemTitle><strong>Exercise Name</strong></ItemTitle>
                                                            <Label>{exercise.name}</Label>
                                                        </div>
                                                        <div>
                                                            <ItemTitle><strong>Sets</strong></ItemTitle>
                                                            <Label>{exercise.sets}</Label>                                                    </div>
                                                        <div>
                                                            <ItemTitle><strong>Reps</strong></ItemTitle>
                                                            <Label>{exercise.reps}</Label>
                                                        </div>
                                                        <div>
                                                            <ItemTitle><strong>Rest (seconds)</strong></ItemTitle>
                                                            <Label>{exercise.rest_seconds}</Label>
                                                        </div>
                                                        <Separator />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ItemContent>
                        <ItemFooter>
                            <div>
                                <div className="space-y-4">
                                    {guidelinesArray.map((guideline: any) => (
                                        <div key={guideline.key}>
                                            <div className="space-y-3">
                                                <div>
                                                    <ItemTitle className="text-[18px]"><strong>Diet Guidelines</strong></ItemTitle>
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
                                                    <ItemTitle className="text-[16px]"><strong>Macronutrients</strong></ItemTitle>
                                                </div>
                                                {guideline.macronutrients.map((macro, macroIndex) => (
                                                    <div>
                                                        <div>
                                                            <ItemTitle><strong>Protein Grams</strong></ItemTitle>
                                                            <Label>{macro.protein_grams}</Label>
                                                        </div>
                                                        <div>
                                                            <ItemTitle><strong>Carbohydrates</strong></ItemTitle>
                                                            <Label>{macro.carbohydrates}</Label>
                                                        </div>
                                                        <div>
                                                            <ItemTitle><strong>Fats</strong></ItemTitle>
                                                            <Label>{macro.fats}</Label>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Separator />
                                                <div>
                                                    <ItemTitle className="text-[16px]"><strong>Rules</strong></ItemTitle>
                                                </div>
                                                {guideline.rules.map((rule: any) => (
                                                    <div>
                                                        <div>
                                                            <ItemTitle><strong>Rule</strong></ItemTitle>
                                                            <Label>{rule.rule}</Label>
                                                        </div>
                                                        <Separator />
                                                    </div>
                                                ))}
                                                <div>
                                                    <ItemTitle className="text-[16px]"><strong>Food Recommendations</strong></ItemTitle>
                                                </div>
                                                {guideline.foods_recommendations.map((recommendation, recommendationIndex) => (
                                                    <div>
                                                        <div>
                                                            <ItemTitle><strong>Food</strong></ItemTitle>
                                                            <Label>{recommendation.food}</Label>
                                                        </div>
                                                        <Separator />
                                                    </div>
                                                ))}
                                                <div>
                                                    <ItemTitle className="text-[16px]"><strong>Food Limitations</strong></ItemTitle>
                                                </div>
                                                {guideline.foods_limitations.map((limitation) => (
                                                    <div>
                                                        <div>
                                                            <ItemTitle><strong>Food</strong></ItemTitle>
                                                            <Label>{limitation.food}</Label>
                                                        </div>
                                                        <Separator />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ItemFooter>
                    </Item>
                    <Button onClick={() => handleStart(planId)}>Start Plan</Button>
                    <Link href={route('plan-templates.index')}>
                        <Button>Change Template</Button>
                    </Link>
                    <Button onClick={() => handleCancel(planId)}>Cancel Plan</Button>
                </div >
            </AppLayout >
        );
    } else {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Fitness Plan" />
                <h1>Current Plan is Active</h1>
            </AppLayout >

        )
    }
}
