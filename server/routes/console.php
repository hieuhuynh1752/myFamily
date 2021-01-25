<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('user', function () {
    \App\Models\User::create([
        'name' => 'Huynh Thai Hieu',
        'email' => 'thaihieuhuynh1752@email.com',
        'password' => bcrypt('Password@123')
    ]);
})->describe('Create sample user');
