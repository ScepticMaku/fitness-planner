import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import {
    Item,
    ItemContent,
} from "@/components/ui/item"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Plan Templates',
        href: '/plan-templates'
    },
    {
        title: 'Add Template',
        href: 'plan-templates/create',
    },
];

export default function Edit({ template }: any) {

    const { data, setData, put, errors } = useForm({
        title: template.title,
        goal: template.goal,
        fitness_level: template.fitness_level,
        plan_type: template.plan_type,
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

    const addWorkout = () => {
        const workoutCount = Object.keys(data.workout_structure).length;
        const newWorkoutKey = `workout_${Date.now()}`;

        setData('workout_structure', {
            ...data.workout_structure,
            [newWorkoutKey]: {
                name: `Workout ${workoutCount + 1}`,
                exercises: [
                    {
                        name: "",
                        sets: "",
                        reps: "",
                        rest_seconds: 60
                    }
                ]
            }
        });
    };

    const addGuideline = () => {
        const guidelineCount = Object.keys(data.diet_guidelines).length;
        const newGuidelineKey = `guideline_${Date.now()}`;

        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [newGuidelineKey]: {
                name: `Diet ${guidelineCount + 1}`,
                description: '',
                diet_type: '',
                calorie_target: 2000,
                macronutrients: [
                    {
                        protein_grams: 150,
                        carbohydrates: 200,
                        fats: 67
                    }
                ],
                rules: [
                    {
                        rule: '',
                    }
                ],
                foods_recommendations: [
                    {
                        food: '',
                    }
                ],
                foods_limitations: [
                    {
                        food: '',
                    }
                ]
            }
        });
    };

    const removeWorkout = (workoutKey: any) => {
        if (Object.keys(data.workout_structure).length > 1) {
            const updatedStructure = { ...data.workout_structure };
            delete updatedStructure[workoutKey];
            setData('workout_structure', updatedStructure);
        }
    };

    const removeGuideline = (guidelineKey: any) => {
        if (Object.keys(data.diet_guidelines).length > 1) {
            const updatedGuidelines = { ...data.diet_guidelines };
            delete updatedGuidelines[guidelineKey];
            setData('diet_guidelines', updatedGuidelines);
        }
    }

    const updateWorkoutName = (workoutKey: any, newName: any) => {
        setData('workout_structure', {
            ...data.workout_structure,
            [workoutKey]: {
                ...data.workout_structure[workoutKey],
                name: newName
            }
        });
    };

    const updateGuidelines = (guidelineKey: any, field: any, value: any) => {
        const updatedGuidelines = { ...data.diet_guidelines };
        updatedGuidelines[guidelineKey] = {
            ...updatedGuidelines[guidelineKey],
            [field]: value
        };
        setData('diet_guidelines', updatedGuidelines);
    };


    const addExercise = (workoutKey: any) => {
        const workout = data.workout_structure[workoutKey];
        setData('workout_structure', {
            ...data.workout_structure,
            [workoutKey]: {
                ...workout,
                exercises: [
                    ...workout.exercises,
                    {
                        name: "",
                        sets: "",
                        reps: "",
                        rest_seconds: 60
                    }
                ]
            }
        });
    };

    const addRule = (guidelineKey: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                rules: [
                    ...guideline.rules,
                    {
                        rule: '',
                    }
                ]
            }
        });
    };

    const addRecommendation = (guidelineKey: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                foods_recommendations: [
                    ...guideline.foods_recommendations,
                    {
                        food: '',
                    }
                ]
            }
        });
    }

    const addLimitation = (guidelineKey: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                foods_limitations: [
                    ...guideline.foods_limitations,
                    {
                        food: '',
                    }
                ]
            }
        });
    }

    const removeExercise = (workoutKey: any, exerciseIndex: any) => {
        const workout = data.workout_structure[workoutKey];
        if (workout.exercises.length > 1) {
            const updatedExercises = workout.exercises.filter((_, index) => index !== exerciseIndex);
            setData('workout_structure', {
                ...data.workout_structure,
                [workoutKey]: {
                    ...workout,
                    exercises: updatedExercises
                }
            });
        }
    };

    const removeRule = (guidelineKey: any, ruleIndex: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        if (guideline.rules.length > 1) {
            const updatedRules = guideline.rules.filter((_, index) => index !== ruleIndex);
            setData('diet_guidelines', {
                ...data.diet_guidelines,
                [guidelineKey]: {
                    ...guideline,
                    rules: updatedRules
                }
            });
        }
    };

    const removeRecommendation = (guidelineKey: any, recommendationIndex: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        if (guideline.foods_recommendations.length > 1) {
            const updatedRecommendation = guideline.foods_recommendations.filter((_, index) => index !== recommendationIndex);
            setData('diet_guidelines', {
                ...data.diet_guidelines,
                [guidelineKey]: {
                    ...guideline,
                    foods_recommendations: updatedRecommendation
                }
            });
        }
    };

    const removeLimitation = (guidelineKey: any, limitationIndex: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        if (guideline.foods_limitations.length > 1) {
            const updatedLimitation = guideline.foods_limitations.filter((_, index) => index !== limitationIndex);
            setData('diet_guidelines', {
                ...data.diet_guidelines,
                [guidelineKey]: {
                    ...guideline,
                    foods_limitations: updatedLimitation
                }
            });
        }
    };

    const updateExercise = (workoutKey: any, exerciseIndex: any, field: any, value: any) => {
        const workout = data.workout_structure[workoutKey];
        const updatedExercises = [...workout.exercises];
        updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            [field]: value
        };

        setData('workout_structure', {
            ...data.workout_structure,
            [workoutKey]: {
                ...workout,
                exercises: updatedExercises
            }
        });
    };

    const updateRule = (guidelineKey: any, ruleIndex: any, field: any, value: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        const updatedRules = [...guideline.rules];
        updatedRules[ruleIndex] = {
            ...updatedRules[ruleIndex],
            [field]: value
        };

        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                rules: updatedRules
            }
        })
    };

    const updateRecommendation = (guidelineKey: any, recommendationIndex: any, field: any, value: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        const updatedRecommendation = [...guideline.foods_recommendations];
        updatedRecommendation[recommendationIndex] = {
            ...updatedRecommendation[recommendationIndex],
            [field]: value
        };

        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                foods_recommendations: updatedRecommendation
            }
        })
    };

    const updateLimitation = (guidelineKey: any, limitationIndex: any, field: any, value: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        const updatedLimitation = [...guideline.foods_limitations];
        updatedLimitation[limitationIndex] = {
            ...updatedLimitation[limitationIndex],
            [field]: value
        };

        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                foods_limitations: updatedLimitation
            }
        })
    };

    const updateMacro = (guidelineKey: any, macroIndex: any, field: any, value: any) => {
        const guideline = data.diet_guidelines[guidelineKey];
        const updatedMacros = [...guideline.macronutrients];
        updatedMacros[macroIndex] = {
            ...updatedMacros[macroIndex],
            [field]: value
        };

        setData('diet_guidelines', {
            ...data.diet_guidelines,
            [guidelineKey]: {
                ...guideline,
                macronutrients: updatedMacros
            }
        })
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        put(route('plan-templates.update', template.id));
    };

    const guidelinesArray = getGuidelinesArray();
    const workoutsArray = getWorkoutsArray();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Template" />
            <div className="m-4">
                <Link href={route('plan-templates.index')}>
                    <Button><ChevronLeft /> Back</Button>
                </Link>
            </div>
            <div className="ml-4 mr-4 mb-4">
                <form className="space-y-2" onSubmit={handleSubmit}>
                    <Item variant="outline">
                        <ItemContent>
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter plan title"
                                    value={data.title} onChange={(e) => setData('title', e.target.value)}
                                />
                                <InputError
                                    message={errors.title}
                                />
                            </div>
                            <div>
                                <Label htmlFor="goal">Goal</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter goal"
                                    value={data.goal} onChange={(e) => setData('goal', e.target.value)}
                                />
                                <InputError
                                    message={errors.goal}
                                />
                            </div>
                            <div>
                                <Label>Fitness Level</Label>
                            </div>
                            <div>
                                <Select value={data.fitness_level || ''} onValueChange={(e) => setData('fitness_level', e)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Fitness Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <InputError
                                message={errors.fitness_level}
                            />
                            <div>
                                <Label>Plan Type</Label>
                            </div>
                            <div>
                                <Select value={data.plan_type || ''} onValueChange={(e) => setData('plan_type', e)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Plan Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Strength and Conditioning" key="strength-and-conditioning">Strength and Conditioning</SelectItem>
                                        <SelectItem value="Weight Loss or Fat Loss" key="weight-loss-or-fat-loss">Weight Loss or Fat Loss</SelectItem>
                                        <SelectItem value="Functional Training" key="functional-training">Functional Training</SelectItem>
                                        <SelectItem value="Body Building" key="body-building">Body Building</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.plan_type}
                                />
                            </div>
                            <div>
                                <Label htmlFor="role description">Description</Label>
                                <Textarea
                                    placeholder="Enter template description"
                                    value={data.description} onChange={(e) => setData('description', e.target.value)}
                                ></Textarea>
                                <InputError
                                    message={errors.description}
                                />
                            </div>
                        </ItemContent>
                    </Item>
                    <div>
                        <h1 className="text-[18px]">Workouts</h1>
                    </div>
                    <div>
                        <Button type="button" onClick={() => addWorkout()}>Add Workout</Button>
                    </div>
                    {workoutsArray.map((workout) => (
                        <div key={workout.key} className="space-y-2">
                            <Item variant="outline">
                                <ItemContent>
                                    <Label>Workout Name</Label>
                                    <Input
                                        type="text"
                                        value={workout.name}
                                        onChange={(e) => updateWorkoutName(workout.key, e.target.value)}
                                        placeholder="Workout Name"
                                    />
                                    <div>
                                        {workoutsArray.length > 1 && (
                                            <div className="space-y-2">
                                                <Separator />
                                                <Button onClick={() => removeWorkout(workout.key)}>Remove Workout</Button>
                                            </div>
                                        )}
                                    </div>
                                </ItemContent>
                            </Item>
                            <div>
                                <h1>Exercises</h1>
                                <Button type="button" onClick={() => addExercise(workout.key)}>
                                    Add Exercise
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {workout.exercises.map((exercise, exerciseIndex) => (
                                    <div className="space-y-2">
                                        <Item variant="outline">
                                            <ItemContent>
                                                <Label>Exercise Name</Label>
                                                <Input
                                                    type="text"
                                                    value={exercise.name}
                                                    onChange={(e) => updateExercise(workout.key, exerciseIndex, 'name', e.target.value)}
                                                    placeholder="Jefferson Curls"
                                                />
                                                <div>
                                                    <Label>Sets</Label>
                                                    <Input
                                                        type="number"
                                                        value={exercise.sets}
                                                        onChange={(e) => updateExercise(workout.key, exerciseIndex, 'sets', parseInt(e.target.value))}
                                                        placeholder="e.g., 3"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Reps</Label>
                                                    <Input
                                                        type="text"
                                                        value={exercise.reps}
                                                        onChange={(e) => updateExercise(workout.key, exerciseIndex, 'reps', e.target.value)}
                                                        placeholder="e.g., 8-12"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Rest (seconds)</Label>
                                                    <Input
                                                        type="number"
                                                        value={exercise.rest_seconds}
                                                        onChange={(e) => updateExercise(workout.key, exerciseIndex, 'rest_seconds', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    {workout.exercises.length > 1 && (
                                                        <div className="space-y-2">
                                                            <Separator />
                                                            <Button type="button" onClick={() => removeExercise(workout.key, exerciseIndex)}>
                                                                Remove Exercise
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </ItemContent>
                                        </Item>
                                    </div>
                                ))}

                            </div>
                        </div>
                    ))}
                    <div>
                        <h1>Diet Guidelines</h1>
                    </div>
                    <div>
                        <Button type="button" onClick={() => addGuideline()}>Add Guideline</Button>
                    </div>
                    {guidelinesArray.map((guideline: any) => (
                        <div className="space-y-2" key={guideline.key}>
                            <Item variant="outline">
                                <ItemContent>
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            type="text"
                                            value={guideline.name}
                                            onChange={(e) => updateGuidelines(guideline.key, 'name', e.target.value)}
                                            placeholder="Vegetarian"
                                        />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Guildine Description"
                                            value={guideline.description}
                                            onChange={(e) => updateGuidelines(guideline.key, 'description', e.target.value)}
                                        ></Textarea>
                                    </div>
                                    <div>
                                        <Label>Diet Type</Label>
                                        <Input
                                            type="text"
                                            value={guideline.diet_type}
                                            onChange={(e) => updateGuidelines(guideline.key, 'diet_type', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Target Calories</Label>
                                        <Input
                                            type="number"
                                            value={guideline.calorie_target}
                                            onChange={(e) => updateGuidelines(guideline.key, 'calorie_target', e.target.value)}
                                        />
                                    </div>
                                    {guidelinesArray.length > 1 && (
                                        <div className="space-y-2">
                                            <Separator />
                                            <Button onClick={() => removeGuideline(guideline.key)}>Remove Guideline</Button>
                                        </div>
                                    )}
                                </ItemContent>
                            </Item>
                            <div>
                                <h1>Macronutrients</h1>
                            </div>
                            <div>
                                {guideline.macronutrients.map((macro, macroIndex) => (
                                    <Item variant="outline">
                                        <div>
                                            <Label>Protein Grams</Label>
                                            <Input
                                                type="number"
                                                value={macro.protein_grams}
                                                onChange={(e) => updateMacro(guideline.key, macroIndex, 'protein_grams', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Carbohydrates</Label>
                                            <Input
                                                type="number"
                                                value={macro.carbohydrates}
                                                onChange={(e) => updateMacro(guideline.key, macroIndex, 'carbohydrates', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Fats</Label>
                                            <Input
                                                type="number"
                                                value={macro.fats}
                                                onChange={(e) => updateMacro(guideline.key, macroIndex, 'fats', e.target.value)}
                                            />
                                        </div>
                                    </Item>
                                ))}
                            </div>
                            <div>
                                <h1>Rules</h1>
                            </div>
                            <div>
                                <Button type="button" onClick={() => addRule(guideline.key)}>
                                    Add Rule
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {guideline.rules.map((rule, ruleIndex) => (
                                    <Item variant="outline">
                                        <ItemContent>
                                            <div>
                                                <Label>Rule</Label>
                                                <Input
                                                    type="text"
                                                    value={rule.name}
                                                    onChange={(e) => updateRule(guideline.key, ruleIndex, 'rule', e.target.value)}
                                                    placeholder="Rule Title"
                                                />
                                            </div>
                                            {guideline.rules.length > 1 && (
                                                <div className="space-y-2">
                                                    <Separator />
                                                    <Button type="button" onClick={() => removeRule(guideline.key, ruleIndex)}>
                                                        Remove Rule
                                                    </Button>
                                                </div>
                                            )}
                                        </ItemContent>
                                    </Item>
                                ))}
                            </div>
                            <div>
                                <h1>Foods Recommendations</h1>
                            </div>
                            <div>
                                <Button type="button" onClick={() => addRecommendation(guideline.key)}>
                                    Add Food
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {guideline.foods_recommendations.map((recommendation, recommendationIndex) => (
                                    <Item variant="outline">
                                        <ItemContent>
                                            <div>
                                                <Label>Food</Label>
                                                <Input
                                                    type="text"
                                                    value={recommendation.food}
                                                    onChange={(e) => updateRecommendation(guideline.key, recommendationIndex, 'food', e.target.value)}
                                                    placeholder="Food"
                                                />
                                            </div>
                                            {guideline.foods_recommendations.length > 1 && (
                                                <div className="space-y-2">
                                                    <Separator />
                                                    <Button type="button" onClick={() => removeRecommendation(guideline.key, recommendationIndex)}>
                                                        Remove Food
                                                    </Button>
                                                </div>
                                            )}
                                        </ItemContent>
                                    </Item>
                                ))}
                            </div>
                            <div>
                                <h1>Foods Limitation</h1>
                            </div>
                            <div>
                                <Button type="button" onClick={() => addLimitation(guideline.key)}>
                                    Add Food
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {guideline.foods_limitations.map((limitation, limitationIndex) => (
                                    <Item variant="outline">
                                        <ItemContent>
                                            <div>
                                                <Label>Food</Label>
                                                <Input
                                                    type="text"
                                                    value={limitation.food}
                                                    onChange={(e) => updateLimitation(guideline.key, limitationIndex, 'food', e.target.value)}
                                                    placeholder="Food"
                                                />
                                            </div>
                                            {guideline.foods_limitations.length > 1 && (
                                                <div className="space-y-2">
                                                    <Separator />
                                                    <Button type="button" onClick={() => removeLimitation(guideline.key, limitationIndex)}>
                                                        Remove Food
                                                    </Button>
                                                </div>
                                            )}
                                        </ItemContent>
                                    </Item>
                                ))}
                            </div>

                        </div>
                    ))}
                    <div className="space-x-2">
                        <Button type="submit"><Save /> Save Changes</Button>
                    </div>
                </form>
            </div>
        </AppLayout >
    );
}
