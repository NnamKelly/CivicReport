<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReportResource;
use Gate;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\User;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ReportResource::collection(Report::all());

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->merge([
            'category' => strtolower($request->category),
            'urgency' => strtolower($request->urgency),
        ]);

        $validated = $request->validate([
            'full_name' => ['required', 'string'],
            'telephone_number' => ['required', 'integer', 'min:9'],
            'category' => ['required', 'string', 'in:infrastructure damage,theft,safety hazard,noise complaint,vandalism,suspiscious activity,other,'],
            'urgency' => ['required', 'string', 'in:low,medium,high,critical,'],
            'location' => ['required', 'string'],
            'description' => ['required', 'string'],
            'photographic_evidence' => ['nullable', 'image', 'max:5120'],
        ]);

        $path = null;
        if ($request->hasFile('photographic_evidence')) {
            $path = $request->file('photographic_evidence')->store('evidence', 'public');
        }

        $report = Report::create([
            'full_name' => $validated['full_name'],
            'telephone_number' => $validated['telephone_number'],
            'category' => $validated['category'],
            'urgency' => $validated['urgency'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            'photographic_evidence' => $path,
        ]);
            // $report->reporter_id = $request->user()->id;
            // $report->save();

        // return response()->json($report, 201)->setEncodingOptions(JSON_PRETTY_PRINT);
        return new ReportResource($report);

    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
       return new ReportResource($report);

    }


    //  Update the specified resource in storage.

    public function update(Request $request, Report $report)
    {
        Gate::authorize('modify', $report);

        $request->merge([
            'category' => strtolower($request->category),
            'urgency' => strtolower($request->urgency),
        ]);


        $data = $request->validate([
            'full_name' => ['required', 'string'],
            'telephone_number' => ['required', 'integer', 'min:9'],
            'category' => ['required', 'string', 'in:infrastructure damage,theft,safety hazard,noise complaint,vandalism,suspiscious activity,other,'],
            'urgency' => ['required', 'string', 'in:low,medium,high,critical,'],
            'location' => ['required', 'string'],
            'description' => ['required', 'string'],
            'photographic_evidence' => ['nullable', 'image', 'max:5120'],
        ]);

        $path = null;
        if ($request->hasFile('photographic_evidence')) {
            $path = $request->file('photographic_evidence')->store('evidence', 'public');
        }

        $report->update($data);

        return new ReportResource($report);

    }


    // Remove the specified resource from storage.

    public function destroy(Report $report)
    {
        Gate::authorize('modify', $report);

        $report->delete();

        return response()->json([
            'message' => 'The post was deleted'
        ], 204)->setEncodingOptions(JSON_PRETTY_PRINT);
    }

    public function status_update(Request $request, Report $report)
    {
        $request->merge([
            'status' => strtolower($request->status),
        ]);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,under review,reported,resolved,in preogress']
        ]);

        $data = $report->update($validated);
        return [
            'message' => 'status updated successsfull',
        ];
    }


}
