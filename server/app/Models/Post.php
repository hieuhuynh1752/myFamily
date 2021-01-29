<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    public function familyMember(): BelongsTo
    {
        return $this->belongsTo(FamilyMember::class, 'member_id');
    }
    public function comment(): HasMany
    {
        return $this->hasMany(Comment::class, 'post_id');
    }

    public function like(): HasMany
    {
        return $this->hasMany(Like::class, 'post_id');
    }
}
