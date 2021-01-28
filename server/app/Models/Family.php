<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Family extends Model
{
    use HasFactory;

    public function familyMember(): HasMany
    {
        return $this->hasMany(FamilyMember::class, 'family_id');
    }
}
