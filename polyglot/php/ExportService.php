<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class ExportService
{
    public function exportUser(User $user): void
    {
        $row = ['id' => $user->id, 'name' => $user->name];

        Storage::put("exports/users/{$user->id}.json", json_encode($row));
    }
}
