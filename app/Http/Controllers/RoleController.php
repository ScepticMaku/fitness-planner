<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        return Inertia::render('roles/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::get();
        return Inertia::render('roles/create', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $role = Role::create([
            'label' => $request->label,
            'name' => Str::slug($request->label),
            'description' => $request->description,
        ]);

        if($role) {
            $role->syncPermissions($request->permissions);
            return redirect()->route('roles.index')->with('message', 'Role successfully created!');
        }
        return redirect()->back()->with('message', 'Role creation failed.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $role = Role::find($id);
        $permissions = $role->permissions()->get();
        return Inertia::render('roles/show', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $role = Role::find($id);
        $permissions = Permission::get();
        return Inertia::render('roles/edit', [
            'role' => $role,
            'rolePermissions' => $role->permissions()->pluck('name'),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $role = Role::find($id);

        if($role) {
            $request->validate([
                'label' => 'required|string',
                'description' => 'nullable|string',
                'permissions' => 'nullable|array',
                'permissions.*' => 'string|exists:permissions,name'
            ]);

            $role->update([
                'label' => $request->label,
                'name' => Str::slug($request->label),
                'description' => $request->description,
            ]);

            $role->syncPermissions($request->permissions);

            return redirect()->route('roles.index')->with('message', 'Role successfully updated!');
        }
        return redirect()->back()->with('message', 'Role update failed.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Role::destroy($id);
        return redirect()->route('roles.index')->with('message', 'Role successfully deleted!');
    }
}
