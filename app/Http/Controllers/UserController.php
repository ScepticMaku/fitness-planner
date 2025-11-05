<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $authUser = Auth::user();
        $authUserRole = $authUser->roles->first()?->name;
        $userQuery = User::with('roles');

        if (!in_array($authUserRole, ['super-admin', 'admin', 'tester', 'trainer', 'member', 'user'])) {
            abort(403, 'Unauthorized Access Prevented.');
        }

        if ($authUserRole === 'super-admin') {
            $userQuery->whereDoesntHave('roles', function($q) {
                $q->where('name', 'super-admin');
            });
        }
        elseif ($authUserRole === 'admin') {
            $userQuery->whereDoesntHave('roles', function($q) {
                $q->where('name', 'admin');
            });
        } elseif ($authUserRole === 'tester') {
             $userQuery->whereDoesntHave('roles', function($q) {
                $q->where('name', 'tester');
            });
        } elseif ($authUserRole === 'user') {
             $userQuery->whereDoesntHave('roles', function($q) {
                $q->where('name', 'user');
            });
        }

        $users = $userQuery->get();

        return Inertia::render('users/index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $authUser = Auth::user();
        $authUserRole = $authUser->roles->first()?->name;
        $rolesQuery = Role::query();

        if ($authUserRole === 'super-admin') {
            $rolesQuery->whereIn('name', ['super-admin','tester', 'member', 'admin', 'user']);
        } elseif($authUserRole === 'admin') {
            $rolesQuery->whereIn('name', ['admin', 'tester', 'member', 'user']);
        } elseif($authUserRole === 'tester') {
            $rolesQuery->whereIn('name', ['tester', 'user']);
        }

        $roles = $rolesQuery->get();
        return Inertia::render('users/create', [
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string',
            'email' => 'required|unique:users,email',
            'password' => 'required|string|min:8',
            'confirm_password' => 'required|same:password',
            'roles' => 'required'
       ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        if($user) {
            $user->syncRoles($request->roles);
            return redirect()->route('users.index')->with('message', 'User successfully added!');
        }
        return redirect()->back()->with('message', 'User creation failed.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        $userRole = $user->roles()->get();
        $roles = Role::get();
        return Inertia::render('users/show', [
            'user' => $user,
            'userRole' => $userRole,
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        $userRole = $user->roles()->get();

        $authUser = Auth::user();
        $authUserRole = $authUser->roles->first()?->name;
        $rolesQuery = Role::query();

        if ($authUserRole === 'super-admin') {
            $rolesQuery->whereIn('name', ['super-admin', 'tester', 'member', 'admin', 'user']);
        } elseif($authUserRole === 'admin') {
            $rolesQuery->whereIn('name', ['super-admin','admin', 'user']);
        } elseif($authUserRole === 'tester') {
            $rolesQuery->whereIn('name', ['user']);
        } elseif($authUserRole === 'user') {
            $rolesQuery->whereIn('name', ['user']);
        }

        $roles = $rolesQuery->get();
        return Inertia::render('users/edit', [
            'user' => $user,
            'userRole' => $userRole,
            'roles' => $roles
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        if($user) {
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|unique:users,email,' . $user->id,
            ]);

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            $user->syncRoles($request->roles);

            return redirect()->route('users.index')->with('message', 'User successfully updated!');
        }
        return redirect()->back()->with('message', 'User update failed.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::destroy($id);
        return redirect()->route('users.index')->with('message', 'User successfully deleted!');
    }
}
