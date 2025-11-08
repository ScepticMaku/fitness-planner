<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Str;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $teams = config('permission.teams');
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_id';
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';

        throw_if(empty($tableNames), Exception::class, 'Error: config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        throw_if($teams && empty($columnNames['team_foreign_key'] ?? null), Exception::class, 'Error: team_foreign_key on config/permission.php not loaded. Run [php artisan config:clear] and try again.');

        Schema::create($tableNames['permissions'], static function (Blueprint $table) {
            // $table->engine('InnoDB');
            $table->bigIncrements('id'); // permission id
            $table->string('module');
            $table->string('name');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('guard_name'); // For MyISAM use string('guard_name', 25);
            $table->timestamps();

            $table->unique(['name', 'guard_name']);
        });

        Schema::create($tableNames['roles'], static function (Blueprint $table) use ($teams, $columnNames) {
            // $table->engine('InnoDB');
            $table->bigIncrements('id'); // role id
            if ($teams || config('permission.testing')) { // permission.testing is a fix for sqlite testing
                $table->unsignedBigInteger($columnNames['team_foreign_key'])->nullable();
                $table->index($columnNames['team_foreign_key'], 'roles_team_foreign_key_index');
            }
            $table->string('name');       // For MyISAM use string('name', 225); // (or 166 for InnoDB with Redundant/Compact row format)
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('guard_name'); // For MyISAM use string('guard_name', 25);
            $table->timestamps();
            if ($teams || config('permission.testing')) {
                $table->unique([$columnNames['team_foreign_key'], 'name', 'guard_name']);
            } else {
                $table->unique(['name', 'guard_name']);
            }
        });

        Schema::create($tableNames['model_has_permissions'], static function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams) {
            $table->unsignedBigInteger($pivotPermission);

            $table->string('model_type');
            $table->unsignedBigInteger($columnNames['model_morph_key']);
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

            $table->foreign($pivotPermission)
                ->references('id') // permission id
                ->on($tableNames['permissions'])
                ->onDelete('cascade');
            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_permissions_team_foreign_key_index');

                $table->primary([$columnNames['team_foreign_key'], $pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_permissions_permission_model_type_primary');
            } else {
                $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_permissions_permission_model_type_primary');
            }

        });

        Schema::create($tableNames['model_has_roles'], static function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams) {
            $table->unsignedBigInteger($pivotRole);

            $table->string('model_type');
            $table->unsignedBigInteger($columnNames['model_morph_key']);
            $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

            $table->foreign($pivotRole)
                ->references('id') // role id
                ->on($tableNames['roles'])
                ->onDelete('cascade');
            if ($teams) {
                $table->unsignedBigInteger($columnNames['team_foreign_key']);
                $table->index($columnNames['team_foreign_key'], 'model_has_roles_team_foreign_key_index');

                $table->primary([$columnNames['team_foreign_key'], $pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            } else {
                $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type'],
                    'model_has_roles_role_model_type_primary');
            }
        });

        Schema::create($tableNames['role_has_permissions'], static function (Blueprint $table) use ($tableNames, $pivotRole, $pivotPermission) {
            $table->unsignedBigInteger($pivotPermission);
            $table->unsignedBigInteger($pivotRole);

            $table->foreign($pivotPermission)
                ->references('id') // permission id
                ->on($tableNames['permissions'])
                ->onDelete('cascade');

            $table->foreign($pivotRole)
                ->references('id') // role id
                ->on($tableNames['roles'])
                ->onDelete('cascade');

            $table->primary([$pivotPermission, $pivotRole], 'role_has_permissions_permission_id_role_id_primary');
        });

        app('cache')
            ->store(config('permission.cache.store') != 'default' ? config('permission.cache.store') : null)
            ->forget(config('permission.cache.key'));

        $roles = [
            [
                'label' => 'Member',
                'name' => Str::slug('Member'),
                'description' => 'Member Role'
            ],
            [
                'label' => 'Trainer',
                'name' => Str::slug('Trainer'),
                'description' => 'Trainer Role'
            ],
        ];

        $permissions = [
            [
                'module' => 'Users',
                'label' => 'Access Users Module',
                'name' => Str::slug('Access Users Module'),
                'description' => 'Permission to access users'
            ],
            [
                'module' => 'Users',
                'label' => 'View Users',
                'name' => Str::slug('View Users'),
                'description' => 'Permission to view users'
            ],
            [
                'module' => 'Users',
                'label' => 'Create Users',
                'name' => Str::slug('Create Users'),
                'description' => 'Permission to create users'
            ],
            [
                'module' => 'Users',
                'label' => 'Edit Users',
                'name' => Str::slug('Edit Users'),
                'description' => 'Permission to edit users'
            ],
            [
                'module' => 'Users',
                'label' => 'Delete Users',
                'name' => Str::slug('Delete Users'),
                'description' => 'Permission to delete users'
            ],
            [
                'module' => 'Roles',
                'label' => 'Access Roles Module',
                'name' => Str::slug('Access Roles Module'),
                'description' => 'Permission to access roles'
            ],
            [
                'module' => 'Roles',
                'label' => 'View Roles',
                'name' => Str::slug('View Roles'),
                'description' => 'Permission to view roles'
            ],
            [
                'module' => 'Roles',
                'label' => 'Create Roles',
                'name' => Str::slug('Create Roles'),
                'description' => 'Permission to create roles'
            ],
            [
                'module' => 'Roles',
                'label' => 'Edit Roles',
                'name' => Str::slug('Edit Roles'),
                'description' => 'Permission to edit roles'
            ],
            [
                'module' => 'Roles',
                'label' => 'Delete Roles',
                'name' => Str::slug('Delete Roles'),
                'description' => 'Permission to delete roles'
            ],
            [
                'module' => 'Permissions',
                'label' => 'Access Permissions Module',
                'name' => Str::slug('Access Permissions Module'),
                'description' => 'Permission to access permissions'
            ],
            [
                'module' => 'Permissions',
                'label' => 'View Permissions',
                'name' => Str::slug('View Permissions'),
                'description' => 'Permission to view permissions'
            ],
            [
                'module' => 'Permissions',
                'label' => 'Create Permissions',
                'name' => Str::slug('Create Permissions'),
                'description' => 'Permission to create permissions'
            ],
            [
                'module' => 'Permissions',
                'label' => 'Edit Permissions',
                'name' => Str::slug('Edit Permissions'),
                'description' => 'Permission to edit permissions'
            ],
            [
                'module' => 'Permissions',
                'label' => 'Delete Permissions',
                'name' => Str::slug('Delete Permissions'),
                'description' => 'Permission to delete permissions'
            ],
            [
                'module' => 'Trainers',
                'label' => 'Access Trainers Module',
                'name' => Str::slug('Access Trainers Module'),
                'description' => 'Permission to access trainers'
            ],
            [
                'module' => 'Trainers',
                'label' => 'View Trainers',
                'name' => Str::slug('View Trainers'),
                'description' => 'Permission to view trainers'
            ],
            [
                'module' => 'Trainers',
                'label' => 'Create Trainers',
                'name' => Str::slug('Create Trainers'),
                'description' => 'Permission to create trainers'
            ],
            [
                'module' => 'Trainers',
                'label' => 'Edit Trainers',
                'name' => Str::slug('Edit Trainers'),
                'description' => 'Permission to edit trainers'
            ],
            [
                'module' => 'Trainers',
                'label' => 'Delete Trainers',
                'name' => Str::slug('Delete Trainers'),
                'description' => 'Permission to delete trainers'
            ],
            [
                'module' => 'Schedules',
                'label' => 'Access Schedules Module',
                'name' => Str::slug('Access Schedules Module'),
                'description' => 'Permission to access schedules'
            ],
            [
                'module' => 'Schedules',
                'label' => 'View Schedules',
                'name' => Str::slug('View Schedules'),
                'description' => 'Permission to view schedules'
            ],
            [
                'module' => 'Schedules',
                'label' => 'Create Schedules',
                'name' => Str::slug('Create Schedules'),
                'description' => 'Permission to create schedules'
            ],
            [
                'module' => 'Schedules',
                'label' => 'Edit Schedules',
                'name' => Str::slug('Edit Schedules'),
                'description' => 'Permission to edit schedules'
            ],
            [
                'module' => 'Schedules',
                'label' => 'Delete Schedules',
                'name' => Str::slug('Delete Schedules'),
                'description' => 'Permission to delete schedules'
            ],
            [
                'module' => 'Fitness Plans',
                'label' => 'Access Fitness Plan Module',
                'name' => Str::slug('Access Fitness Plan Module'),
                'description' => 'Permission to access fitness plan'
            ],
            [
                'module' => 'Fitness Plans',
                'label' => 'View Fitness Plans',
                'name' => Str::slug('View Fitness Plans'),
                'description' => 'Permission to view fitness plans'
            ],
            [
                'module' => 'Fitness Plans',
                'label' => 'Create Fitness Plans',
                'name' => Str::slug('Create Fitness Plans'),
                'description' => 'Permission to create fitness plans'
            ],
            [
                'module' => 'Fitness Plans',
                'label' => 'Edit Fitness Plans',
                'name' => Str::slug('Edit Fitness Plans'),
                'description' => 'Permission to edit fitness plans'
            ],
            [
                'module' => 'Fitness Plans',
                'label' => 'Delete Fitness Plans',
                'name' => Str::slug('Delete Fitness Plans'),
                'description' => 'Permission to delete fitness plans'
            ],
            [
                'module' => 'Plan Templates',
                'label' => 'Access Plan Templates Module',
                'name' => Str::slug('Access Plan Templates Module'),
                'description' => 'Permission to access plan templates'
            ],
            [
                'module' => 'Plan Templates',
                'label' => 'View Plan Templates',
                'name' => Str::slug('View Plan Templates'),
                'description' => 'Permission to view plan templates'
            ],
            [
                'module' => 'Plan Templates',
                'label' => 'Create Plan Templates',
                'name' => Str::slug('Create Plan Templates'),
                'description' => 'Permission to create plan template'
            ],
            [
                'module' => 'Plan Templates',
                'label' => 'Edit Plan Templates',
                'name' => Str::slug('Edit Plan Templates'),
                'description' => 'Permission to edit plan templates'
            ],
            [
                'module' => 'Plan Templates',
                'label' => 'Delete Plan Templates',
                'name' => Str::slug('Delete Plan Templates'),
                'description' => 'Permission to delete plan templates'
            ],
        ];

        $superAdminPermissions = [
            [
                'permission' => 'access-users-module',
            ],
            [
                'permission' => 'create-users',
            ],
            [
                'permission' => 'view-users',
            ],
            [
                'permission' => 'edit-users',
            ],
            [
                'permission' => 'delete-users',
            ],
            [
                'permission' => 'access-roles-module',
            ],
            [
                'permission' => 'create-roles',
            ],
            [
                'permission' => 'view-roles',
            ],
            [
                'permission' => 'edit-roles',
            ],
            [
                'permission' => 'delete-roles',
            ],
            [
                'permission' => 'access-permissions-module',
            ],
            [
                'permission' => 'create-permissions',
            ],
            [
                'permission' => 'view-permissions',
            ],
            [
                'permission' => 'edit-permissions',
            ],
            [
                'permission' => 'delete-permissions',
            ],
            [
                'permission' => 'access-trainers-module',
            ],
            [
                'permission' => 'create-trainers',
            ],
            [
                'permission' => 'view-trainers',
            ],
            [
                'permission' => 'edit-trainers',
            ],
            [
                'permission' => 'delete-trainers',
            ],
        ];


        foreach($permissions as $permission) {
            Permission::create($permission);
        }

        foreach($roles as $role) {
            Role::create($role);
        }

        $superAdmin = User::find(1);

        Role::create([
                'label' => 'User',
                'name' => Str::slug('User'),
                'description' => 'User Role'
        ]);

        Role::create([
                'label' => 'Super Admin',
                'name' => Str::slug('Super Admin'),
                'description' => 'Super Admin Role'
        ])->syncPermissions($superAdminPermissions);

        $superAdmin->syncRoles('super-admin');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableNames = config('permission.table_names');

        throw_if(empty($tableNames), Exception::class, 'Error: config/permission.php not found and defaults could not be merged. Please publish the package configuration before proceeding, or drop the tables manually.');

        Schema::drop($tableNames['role_has_permissions']);
        Schema::drop($tableNames['model_has_roles']);
        Schema::drop($tableNames['model_has_permissions']);
        Schema::drop($tableNames['roles']);
        Schema::drop($tableNames['permissions']);
    }
};
