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

export default function Show({ userHasPlan, template }: PageProps) {

    const { auth } = usePage().props as any;
    const userId = auth.user.id;
    const userRole = auth.roles;
    const hasPlan = userHasPlan.filter(plan => plan.user_id == userId);
    const isPlanActive = hasPlan.map(h => h.is_active);
    const isSamePlan = hasPlan.map(h => h.plan_template_id == template.id);

    const { data } = useForm({
        title: template.title,
        goal: template.goal,
        fitness_level: template.fitness_level,
        plan_type: template.plan_type,
        description: template.description,
        workout_structure: template.workout_structure,
        diet_guidelines: template.diet_guideline,
    });

    const { delete: destroy } = useForm();
    const { post, put } = useForm();

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

    const changePlan = (id: number) => {
        if (confirm(`Do you want to switch to this template?`)) {
            put(route('user-has-plans.change', id));
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
                    {(userRole == 'member' && isPlanActive == 0 && hasPlan.length == 1 && isSamePlan == 'false') && (
                        <div>
                            <Button onClick={() => changePlan(template.id)}>Change to This Plan</Button>
                        </div>
                    )}
                </div>
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

                </div >
            </div>
        </AppLayout >
    );
}
