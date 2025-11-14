import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Dumbbell, CalendarClock, NotebookPen, UserCog, UserPen, Users, LayoutTemplate } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Workout Progress',
        href: '/workout-progress',
        icon: Dumbbell,
        permission: 'access-workout-progress-module',
    },
    {
        title: 'Fitness Plan',
        href: '/fitness-plan',
        icon: NotebookPen,
        permission: 'access-fitness-plan-module',
    },
    {
        title: 'Appointments',
        href: '/appointments',
        icon: CalendarClock,
        permission: 'access-appointments-module',
    },
    {
        title: 'Schedules',
        href: '/schedules',
        icon: CalendarClock,
        permission: 'access-schedules-module',
    },
    {
        title: 'Plan Templates',
        href: '/plan-templates',
        icon: LayoutTemplate,
        permission: 'access-plan-templates-module'
    },
    {
        title: 'Trainers',
        href: '/trainers',
        icon: Users,
        permission: 'access-trainers-module',
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        permission: 'access-users-module',
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: UserCog,
        permission: 'access-roles-module',
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: UserPen,
        permission: 'access-permissions-module',
    },
];

export function AppSidebar() {

    const { auth } = usePage().props as any;
    const permissions = auth.permissions;
    const permissionNames = permissions.map(permission => permission.name);
    const filteredNavItems = mainNavItems.filter((item) => !item.permission || permissionNames.includes(item.permission));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
