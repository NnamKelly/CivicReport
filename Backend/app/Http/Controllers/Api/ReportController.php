<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Gate;
use Illuminate\Http\Request;
use App\Models\Report;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Report::all())->setEncodingOptions(JSON_PRETTY_PRINT);
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
            'reporter_id' => ['required', 'integer'],
            'category' => ['required', 'string', '
                in:infrastructure damage,safety hazard,noise complaint,vandalism,suspiscious activity,other,
            '],
            'urgency' => ['required', 'string', '
                in:low,medium,high,critical,
            '],
            'location' => ['required', 'string'],
            'description' => ['required', 'string'],
            'photographic_evidence' => ['string'],
        ]);

        $report = $request->user()->reports()->create([
            'category' => $validated['category'],
            'urgency' => $validated['urgency'],
            'reporter_id' => $validated['reporter_id'],
            'location' => $validated['location'],
            'description' => $validated['description'],
            // 'photographic_evidence' => $validated['photographic_evidence']
        ]);

        return response()->json($report, 201)->setEncodingOptions(JSON_PRETTY_PRINT);

    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        // $data = Report::find($id);
        // if(!$data){
        //     return response()->json([
        //         'error' => 'Report not found'
        //     ], 404)->setEncodingOptions(JSON_PRETTY_PRINT);
        // }
        return response()->json($report, 200)->setEncodingOptions(JSON_PRETTY_PRINT);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Report $report)
    {
        Gate::authorize('modify', $report);

        $data = $request->validate([
            'reporter_id' => ['required', 'integer'],
            'category' => ['required', 'string'],   //
            'urgency' => ['required', 'string'],
            'location' => ['required', 'string'],
            'description' => ['required', 'string'],
            'photographic_evidence' => ['string'],
        ]);

        $report->update($data);

        return response()->json($report, 200)->setEncodingOptions(JSON_PRETTY_PRINT);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        Gate::authorize('modify', $report);

        return response()->json([
            'message' => 'The post was deleted'
        ], 204)->setEncodingOptions(JSON_PRETTY_PRINT);
    }
}
