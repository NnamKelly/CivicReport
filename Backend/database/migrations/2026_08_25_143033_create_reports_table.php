<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Authority;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class, 'reporter_id')->constrained('users', 'id');
            $table->foreignIdFor(Authority::class, 'authority_id')->nullable()->constrained('authorities', 'id');
            $table->string('status')->default('reported'); // 'pending', 'under review', 'reported', 'resolved', 'in preogress'
            $table->string('urgency'); // '
            $table->string('category'); // 'infrastructure damage', 'safety hazard', 'noise complaint', 'vandalism', 'suspiscious activity'
            $table->string('location');
            $table->text('description');
            $table->text('photographic_evidence')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
