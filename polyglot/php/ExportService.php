<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class ExportService
{
    public function exportUser(User $user): void
    {
        Storage::put("exports/users/{$user->id}.json", json_encode($user->toArray()));
    }
}
