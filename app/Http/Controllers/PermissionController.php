<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::get();
        return Inertia::render('permissions/index', [
            'permissions' => $permissions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('permissions/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'module' => 'required|string',
            'label' => 'required|string',
            'description' => 'nullable|string'
        ]);

        $permission = Permission::create([
            'module' => $request->module,
            'label' => $request->label,
            'name' => Str::slug($request->label),
            'description' => $request->description
        ]);

        if($permission) {
            return redirect()->route('permissions.index')->with('success', 'Permissions successfully created!');
        }
        return redirect()->back()->with('error', 'Permission creation failed.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $permission = Permission::find($id);
        return Inertia::render('permissions/show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $permission = Permission::find($id);
        return Inertia::render('permissions/edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $permission = Permission::find($id);

        if($permission) {
            $request->validate([
                'module' => 'required|string',
                'label' => 'required|string',
                'description' => 'nullable|string'
            ]);

            $permission->update([
                'module' => $request->module,
                'label' => $request->label,
                'name' => Str::slug($request->label),
                'description' => $request->description
            ]);

            return redirect()->route('permissions.index')->with('message', 'Permissions successfully updated!');
        }
        return redirect()->back()->with('message', 'Permission update failed.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Permission::destroy($id);
        return redirect()->route('permissions.index')->with('message', 'Permission successfully removed!');
    }
}
