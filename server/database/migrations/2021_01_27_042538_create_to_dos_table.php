<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToDosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('to_dos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('list_id');
            $table->unsignedBigInteger('assignee_id');
            $table->string('name');
            $table->string('description');
            $table->string('image')->nullable();
            $table->boolean('is_completed');
            $table->timestamps();
            $table->foreign('list_id')->references('id')->on('to_do_lists')->onDelete('cascade');
            $table->foreign('assignee_id')->references('id')->on('family_members')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('to_dos');
    }
}