<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyMember extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class, 'family_id');
    }

    public function event(): HasMany
    {
        return $this->hasMany(Event::class, 'member_id');
    }

    public function toDoList(): HasMany
    {
        return $this->hasMany(ToDoList::class, 'member_id');
    }

    public function invite(): HasMany
    {
        return $this->hasMany(Invite::class, 'member_id');
    }

    public function toDo(): HasMany
    {
        return $this->hasMany(ToDo::class, 'assignee_id');
    }

    public function post(): HasMany
    {
        return $this->hasMany(Post::class, 'member_id');
    }

    public function comment(): HasMany
    {
        return $this->hasMany(Comment::class, 'member_id');
    }

    public function like(): HasMany
    {
        return $this->hasMany(Like::class, 'member_id');
    }
}
