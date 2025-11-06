import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"
import { Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plan Templates',
        href: '/plan-templates'
    },
    {
        title: 'View Template',
        href: 'plan-templates/show',
    },
];

export default function Show({ userHasPlan, template }: any) {

    const { auth } = usePage().props as any;
    const userId = auth.user.id;
    const userRole = auth.roles;
    const hasPlan = userHasPlan.filter(plan => plan.user_id == userId);

    const { data } = useForm({
        title: template.title,
        goal: template.goal,
        fitness_level: template.fitness_level, plan_type: template.plan_type,
        description: template.description,
        workout_structure: template.workout_structure,
        diet_guidelines: template.diet_guidelines,
    });

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

    const { delete: destroy } = useForm();
    const { post } = useForm();
    const guidelinesArray = getGuidelinesArray();
    const workoutsArray = getWorkoutsArray();

    const handleDelete = (id: number, label: string) => {
        if (confirm(`Do you want to delete template ${label}?`)) {
            destroy(route('plan-templates.destroy', id));
        }
    }

    const selectPlan = (id: number) => {
        if (confirm('Do you want to select this plan?')) {
            post(route('user-has-plans.select', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="View Template" />
            <div className="m-4">
                <div className="flex gap-2 mb-4">
                    <Link href={route('plan-templates.index')}>
                        <Button><ChevronLeft /> Back</Button>
                    </Link>
                    {template.user_id == userId && (
                        <div>
                            <Button onClick={() => handleDelete(template.id, template.title)}><Trash />Delete</Button>
                        </div>
                    )}
                    {(userRole == 'member' && hasPlan.length == 0) && (
                        <div>
                            <Button onClick={() => selectPlan(template.id)}>Select Plan</Button>
                        </div>
                    )}
                </div>
                <div>
                    <Item variant="outline" >
                        <ItemHeader>
                            <div className="space-y-3">
                                <ItemTitle className="text-[20px]"><strong>{data.title}</strong></ItemTitle>
                                <ItemTitle>Created By: Deleted Trainer</ItemTitle>
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
                </div >
            </div>
        </AppLayout >
    );
}
