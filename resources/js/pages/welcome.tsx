import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="DynaFit - Your Fitness Journey" />
            <div className="min-h-screen bg-white dark:bg-gray-900">
                {/* Header */}
                <header className="px-6 py-6">
                    <nav className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                            DynaFit
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                        >
                                            Sign up
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto px-6 py-16">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Your Fitness Journey Starts Here
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
                            Plan, track, and achieve your fitness goals with our simple and effective workout planner.
                        </p>

                        {!auth.user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={register()}
                                    className="px-8 py-3.5 bg-orange-600 text-white rounded-lg text-base font-medium hover:bg-orange-700 transition-colors"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={login()}
                                    className="px-8 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-base font-medium hover:border-orange-600 dark:hover:border-orange-500 transition-colors"
                                >
                                    Log in to your account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Features Section */}
                    <div className="space-y-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                Everything you need to succeed
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-orange-600">📅</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Workout Planning
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Create personalized workout schedules that fit your routine
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-orange-600">📊</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Progress Tracking
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Monitor your progress with detailed analytics and insights
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl text-orange-600">🎯</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Goal Setting
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Set and achieve specific fitness goals with guided planning
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    {!auth.user && (
                        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Ready to start your fitness journey?
                            </p>
                            <Link
                                href={register()}
                                className="inline-block px-8 py-3.5 bg-orange-600 text-white rounded-lg text-base font-medium hover:bg-orange-700 transition-colors"
                            >
                                Create your account
                            </Link>
                            <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
                                Already have an account?{' '}
                                <Link
                                    href={login()}
                                    className="text-orange-600 hover:text-orange-700 underline"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
                    <div className="max-w-6xl mx-auto px-6 py-8 text-center">
                        <p className="text-gray-500 dark:text-gray-500 text-sm">
                            © 2024 FitPlan. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
