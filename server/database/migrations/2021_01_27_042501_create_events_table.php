<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('member_id');
            $table->string('title');
            $table->string('description');
            $table->dateTime('start_date_time');
            $table->dateTime('end_date_time');
            $table->string('color');
            $table->string('recurrence')->nullable();
            $table->unsignedBigInteger('event_id')->nullable();
            $table->string('reminder');
            $table->timestamps();
            $table->foreign('member_id')->references('id')->on('family_members')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
