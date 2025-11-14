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
        title: 'Edit Template',
        href: 'plan-templates/edit',
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
}

interface PageProps {
    template: PlanTemplate;
}



export default function Edit({ template }: PageProps) {

    console.log(template);

    let workoutId = Date.now();
    let guidelineId = Date.now();
    let macroId = Date.now();
    let ruleId = Date.now();
    let recommendationId = Date.now();
    let limitationId = Date.now();
    let exerciseId = Date.now();

    const { data, setData, put, errors } = useForm({
        title: template.title,
        goal: template.goal,
        fitness_level: template.fitness_level,
        plan_type: template.plan_type,
        description: template.description,
        workout_structure: template.workout_structure.map(workout => ({
            id: workout.id,
            name: workout.name,
            exercises: workout.exercise.map(exercise => ({
                id: exercise.id,
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                rest_seconds: exercise.rest_seconds
            }))
        })),
        diet_guidelines: template.diet_guideline.map(guideline => ({
            id: guideline.id,
            name: guideline.name,
            description: guideline.description,
            diet_type: guideline.diet_type,
            calorie_target: guideline.calorie_target,
            macronutrients: [{
                id: guideline.macronutrient.id,
                protein_grams: guideline.macronutrient.protein_grams,
                carbohydrates: guideline.macronutrient.carbohydrates,
                fats: guideline.macronutrient.fats,
            }],
            rules: guideline.rule.map(r => ({
                id: r.id,
                name: r.name
            })),
            food_recommendations: guideline.food_recommendation.map(recommendation => ({
                id: recommendation.id,
                name: recommendation.name
            })),
            food_limitations: guideline.food_limitation.map(limitation => ({
                id: limitation.id,
                name: limitation.name
            }))
        })),
    });

    console.log(data.diet_guidelines);

    const addWorkout = () => {
        setData('workout_structure', [
            ...data.workout_structure, {
                id: workoutId++,
                name: '',
                exercises: [
                    {
                        id: exerciseId++,
                        name: "",
                        sets: "",
                        reps: "",
                        rest_seconds: ""
                    }
                ]
            }
        ]);
    };

    const addGuideline = () => {

        setData('diet_guidelines', [
            ...data.diet_guidelines,
            {
                id: guidelineId++,
                name: '',
                description: '',
                diet_type: '',
                calorie_target: '',
                macronutrients: [
                    {
                        id: macroId++,
                        protein_grams: '',
                        carbohydrates: '',
                        fats: ''
                    }
                ],
                rules: [
                    {
                        id: ruleId++,
                        name: '',
                    }
                ],
                food_recommendations: [
                    {
                        id: recommendationId++,
                        name: '',
                    }
                ],
                food_limitations: [
                    {
                        id: limitationId++,
                        name: '',
                    }
                ]
            }
        ]);
    };

    const removeWorkout = (workoutIndex) => {
        if (data.workout_structure.length > 1) {
            setData('workout_structure',
                data.workout_structure.filter((_, i) => i !== workoutIndex)
            );
        }
    };

    const removeGuideline = (guidelineIndex) => {
        if (data.diet_guidelines.length > 1) {
            setData('diet_guidelines',
                data.diet_guidelines.filter((_, i) => i !== guidelineIndex)
            );
        }
    };

    const addExercise = (workoutIndex) => {
        const updatedWorkouts = [...data.workout_structure];
        updatedWorkouts[workoutIndex].exercises.push({
            id: exerciseId++,
            name: '',
            sets: '',
            reps: '',
            rest_seconds: ''
        });
        setData('workout_structure', updatedWorkouts);
    };

    const addRule = (guidelineIndex) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].rules.push({
            id: ruleId++,
            name: ''
        });
        setData('diet_guidelines', updatedGuidelines);
    }

    const addRecommendation = (guidelineIndex) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].rules.push({
            id: recommendationId++,
            name: ''
        });
        setData('diet_guidelines', updatedGuidelines);
    }

    const addLimitation = (guidelineIndex) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].rules.push({
            id: limitationId++,
            name: ''
        });
        setData('diet_guidelines', updatedGuidelines);
    }

    const removeExercise = (workoutIndex, exerciseIndex) => {
        const updatedWorkouts = [...data.workout_structure];
        const workoutExercises = updatedWorkouts[workoutIndex].exercises;

        if (workoutExercises.length > 1) {
            updatedWorkouts[workoutIndex].exercises = workoutExercises.filter((_, i) => i !== exerciseIndex);
            setData('workout_structure', updatedWorkouts);
        }
    };

    const removeGuidelineField = (guidelineIndex, ruleIndex) => {
        const updatedGuidelines = [...data.diet_guidelines];
        const guidelineRules = updatedGuidelines[guidelineIndex].rules;

        if (guidelineRules.length > 1) {
            updatedGuidelines[guidelineIndex].rules = guidelineRules.filter((_, i) => i !== ruleIndex);
            setData('diet_guidelines', updatedGuidelines);
        }
    };

    const updateWorkoutField = (workoutIndex, field, value) => {
        const updatedWorkouts = [...data.workout_structure];
        updatedWorkouts[workoutIndex] = {
            ...updatedWorkouts[workoutIndex],
            [field]: value
        };
        setData('workout_structure', updatedWorkouts);
    };

    const updateGuidelineField = (guidelineIndex, field, value) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex] = {
            ...updatedGuidelines[guidelineIndex],
            [field]: value
        };
        setData('diet_guidelines', updatedGuidelines);
    }

    const updateExerciseField = (workoutIndex, exerciseIndex, field, value) => {
        const updatedWorkouts = [...data.workout_structure];
        updatedWorkouts[workoutIndex].exercises[exerciseIndex] = {
            ...updatedWorkouts[workoutIndex].exercises[exerciseIndex],
            [field]: value
        };
        setData('workout_structure', updatedWorkouts);
    };

    const updateMacronutrientField = (guidelineIndex, macroIndex, field, value: number) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].macronutrients[macroIndex] = {
            ...updatedGuidelines[guidelineIndex].macronutrients[macroIndex],
            [field]: value
        };
        setData('diet_guidelines', updatedGuidelines);
    }

    const updateRuleField = (guidelineIndex, ruleIndex, field, value) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].rules[ruleIndex] = {
            ...updatedGuidelines[guidelineIndex].rules[ruleIndex],
            [field]: value
        };
        setData('diet_guidelines', updatedGuidelines);
    }

    const updateRecommendationField = (guidelineIndex, recommendationIndex, field, value) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].food_recommendations[recommendationIndex] = {
            ...updatedGuidelines[guidelineIndex].food_recommendations[recommendationIndex],
            [field]: value
        };
        setData('diet_guidelines', updatedGuidelines);
    }

    const updateLimitationField = (guidelineIndex, limitationIndex, field, value) => {
        const updatedGuidelines = [...data.diet_guidelines];
        updatedGuidelines[guidelineIndex].food_limitations[limitationIndex] = {
            ...updatedGuidelines[guidelineIndex].food_limitations[limitationIndex],
            [field]: value
        };
        setData('diet_guidelines', updatedGuidelines);
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(`submitting data: ${data.diet_guidelines}`);
        put(route('plan-templates.update', template.id));
    };

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
                        <Button type="button" onClick={addWorkout}>Add Workout</Button>
                    </div>
                    <div className="space-y-4 grid grid-cols-3 gap-3">
                        {data.workout_structure.map((workout, index: any) => (
                            <div key={index} className="space-y-2">
                                <Item variant="outline">
                                    <ItemContent>
                                        <Label>Workout Name</Label>
                                        <Input
                                            type="text"
                                            value={workout.name}
                                            onChange={(e) => updateWorkoutField(index, 'name', e.target.value)}
                                            placeholder="Workout Name"
                                        />
                                        <div>
                                            {data.workout_structure.length > 1 && (
                                                <div className="space-y-2">
                                                    <Separator />
                                                    <Button onClick={() => removeWorkout(index)}>Remove Workout</Button>
                                                </div>
                                            )}
                                        </div>
                                    </ItemContent>
                                </Item>
                                <div>
                                    <h1>Exercises</h1>
                                    <Button type="button" onClick={() => addExercise(index)}>
                                        Add Exercise
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {workout.exercises.map((exercise: any, exerciseIndex: any) => (
                                        <div key={exerciseIndex} className="space-y-2">
                                            <Item variant="outline">
                                                <ItemContent >
                                                    <div>
                                                        <Label>Exercise Name</Label>
                                                        <Input
                                                            type="text"
                                                            value={exercise.name}
                                                            onChange={(e) => updateExerciseField(index, exerciseIndex, 'name', e.target.value)}
                                                            placeholder="Jefferson Curls"
                                                        />
                                                    </div>
                                                    <div className="grid grid-flow-col grid-cols-3 gap-3">
                                                        <div>
                                                            <Label>Sets</Label>
                                                            <Input
                                                                type="number"
                                                                value={exercise.sets}
                                                                onChange={(e) => updateExerciseField(index, exerciseIndex, 'sets', parseInt(e.target.value))}
                                                                placeholder="e.g., 3"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Reps</Label>
                                                            <Input
                                                                type="text"
                                                                value={exercise.reps}
                                                                onChange={(e) => updateExerciseField(index, exerciseIndex, 'reps', parseInt(e.target.value))}
                                                                placeholder="e.g., 8-12"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Rest (seconds)</Label>
                                                            <Input
                                                                type="number"
                                                                value={exercise.rest_seconds}
                                                                onChange={(e) => updateExerciseField(index, exerciseIndex, 'rest_seconds', parseInt(e.target.value))}
                                                                placeholder="60"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {workout.exercises.length > 1 && (
                                                            <div className="space-y-2">
                                                                <Separator />
                                                                <Button type="button" onClick={() => removeExercise(index, exerciseIndex)}>
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
                    </div>
                    <div>
                        <h1>Diet Guidelines</h1>
                    </div>
                    <div>
                        <Button type="button" onClick={addGuideline}>Add Guideline</Button>
                    </div>
                    <div className="space-y-4 grid grid-cols-3 gap-3">
                        {data.diet_guidelines.map((guideline, index) => (
                            <div className="space-y-2" key={index}>
                                <Item variant="outline">
                                    <ItemContent>
                                        <div>
                                            <Label>Name</Label>
                                            <Input
                                                type="text"
                                                value={guideline.name}
                                                onChange={(e) => updateGuidelineField(index, 'name', e.target.value)}
                                                placeholder="Vegetarian"
                                            />
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Textarea
                                                placeholder="Guildine Description"
                                                value={guideline.description}
                                                onChange={(e) => updateGuidelineField(index, 'description', e.target.value)}
                                            ></Textarea>
                                        </div>
                                        <div>
                                            <Label>Diet Type</Label>
                                            <Input
                                                type="text"
                                                value={guideline.diet_type}
                                                onChange={(e) => updateGuidelineField(index, 'diet_type', e.target.value)}
                                                placeholder="Maintenance"
                                            />
                                        </div>
                                        <div>
                                            <Label>Target Calories</Label>
                                            <Input
                                                type="number"
                                                value={guideline.calorie_target}
                                                onChange={(e) => updateGuidelineField(index, 'calorie_target', e.target.value)}
                                                placeholder="2000"
                                            />
                                        </div>
                                        {data.diet_guidelines.length > 1 && (
                                            <div className="space-y-2">
                                                <Separator />
                                                <Button onClick={() => removeGuideline(index)}>Remove Guideline</Button>
                                            </div>
                                        )}
                                    </ItemContent>
                                </Item>
                                <div>
                                    <h1>Macronutrients</h1>
                                </div>
                                <div>
                                    {guideline.macronutrients.map((macronutrient, macroIndex: any) => (
                                        <div key={macroIndex}>
                                            <Item variant="outline">
                                                <div>
                                                    <Label>Protein Grams</Label>
                                                    <Input
                                                        type="number"
                                                        value={macronutrient.protein_grams}
                                                        onChange={(e) => updateMacronutrientField(index, macroIndex, 'protein_grams', parseInt(e.target.value))}
                                                        placeholder="140"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Carbohydrates</Label>
                                                    <Input
                                                        type="number"
                                                        value={macronutrient.carbohydrates}
                                                        onChange={(e) => updateMacronutrientField(index, macroIndex, 'carbohydrates', parseInt(e.target.value))}
                                                        placeholder="270"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Fats</Label>
                                                    <Input
                                                        type="number"
                                                        value={macronutrient.fats}
                                                        onChange={(e) => updateMacronutrientField(index, macroIndex, 'fats', parseInt(e.target.value))}
                                                        placeholder="80"
                                                    />
                                                </div>
                                            </Item>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h1>Rules</h1>
                                </div>
                                <div>
                                    <Button type="button" onClick={() => addRule(index)}>
                                        Add Rule
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {guideline.rules.map((rule, ruleIndex) => (
                                        <div key={ruleIndex}>
                                            <Item variant="outline">
                                                <ItemContent>
                                                    <div>
                                                        <Label>Rule</Label>
                                                        <Input
                                                            type="text"
                                                            value={rule.name}
                                                            onChange={(e) => updateRuleField(index, ruleIndex, 'name', e.target.value)}
                                                            placeholder="Rule Title"
                                                        />
                                                    </div>
                                                    {guideline.rules.length > 1 && (
                                                        <div className="space-y-2">
                                                            <Separator />
                                                            <Button type="button" onClick={() => removeGuidelineField(index, ruleIndex)}>
                                                                Remove Rule
                                                            </Button>
                                                        </div>
                                                    )}
                                                </ItemContent>
                                            </Item>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h1>Foods Recommendations</h1>
                                </div>
                                <div>
                                    <Button type="button" onClick={() => addRecommendation(index)}>
                                        Add Food
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {guideline.food_recommendations.map((rec, recommendationIndex) => (
                                        <div key={recommendationIndex}>
                                            <Item variant="outline">
                                                <ItemContent>
                                                    <div>
                                                        <Label>Food</Label>
                                                        <Input
                                                            type="text"
                                                            value={rec.name}
                                                            onChange={(e) => updateRecommendationField(index, recommendationIndex, 'name', e.target.value)}
                                                            placeholder="Food"
                                                        />
                                                    </div>
                                                    {guideline.food_recommendations.length > 1 && (
                                                        <div className="space-y-2">
                                                            <Separator />
                                                            <Button type="button" onClick={() => removeGuidelineField(index, recommendationIndex)}>
                                                                Remove Food
                                                            </Button>
                                                        </div>
                                                    )}
                                                </ItemContent>
                                            </Item>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h1>Foods Limitation</h1>
                                </div>
                                <div>
                                    <Button type="button" onClick={() => addLimitation(index)}>
                                        Add Food
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {guideline.food_limitations.map((limitation, limitationIndex) => (
                                        <div key={index}>
                                            <Item variant="outline">
                                                <ItemContent>
                                                    <div>
                                                        <Label>Food</Label>
                                                        <Input
                                                            type="text"
                                                            value={limitation.name}
                                                            onChange={(e) => updateLimitationField(index, limitationIndex, 'name', e.target.value)}
                                                            placeholder="Food"
                                                        />
                                                    </div>
                                                    {guideline.food_limitations.length > 1 && (
                                                        <div className="space-y-2">
                                                            <Separator />
                                                            <Button type="button" onClick={() => removeGuidelineField(index, limitationIndex)}>
                                                                Remove Food
                                                            </Button>
                                                        </div>
                                                    )}
                                                </ItemContent>
                                            </Item>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="space-x-2">
                        <Button type="submit"><Save />Save Changes</Button>
                    </div>
                </form>
            </div>
        </AppLayout >
    );
}
