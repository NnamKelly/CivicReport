<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable =[
        'telephone_number',
        'full_name',
        'urgency',
        'category',
        'location',
        'status',
        'description',
        'photographic_evidence',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

}
