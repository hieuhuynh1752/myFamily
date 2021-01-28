<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ToDo extends Model
{
    use HasFactory;

    public function familyMember(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class, 'assignee_id');
    }
}
