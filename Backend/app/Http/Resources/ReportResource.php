<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            // 'telephone_number' => $this->telephone_number,
            'category' => $this->category,
            'urgency' => $this->urgency,
            'status' => $this->status,
            'location' => $this->location,
            'description' => $this->description,
            'photographic_evidence' => $this->photographic_evidence
                ? asset('storage/' . $this->photographic_evidence)
                : null,
            'created_at' => $this->created_at->format('Y/m/d H/i/s'),
            'updated_at' => $this->updated_at->format('Y/m/d H/i/s'),
        ];
    }
}
