<?php

use App\Http\Controllers\Api\AuthorityAuthController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;

// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });

require __DIR__.'/auth.php'; //Auth for users

//Auth for authority
Route::prefix('authority')->group(function(){
    Route::post('/signup', [AuthorityAuthController::class, 'signup']);
    Route::post('/login', [AuthorityAuthController::class, 'login']);
});

//Create, Update and Delete report operations
Route::post('report', [ReportController::class, 'store']);

//Read a/all report(s)
Route::get('report', [ReportController::class, 'index']);
Route::get('report/{report}', [ReportController::class, 'show']);

//update status
Route::middleware('auth:sanctum')->group(function(){
    Route::put('report/{report}', [ReportController::class, 'update']);
    Route::patch('report/{report}', [ReportController::class, 'status_update']);
    Route::delete('report/{report}', [ReportController::class, 'destroy']);
});

