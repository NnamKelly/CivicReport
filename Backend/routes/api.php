<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthorityAuthController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

require __DIR__.'/auth.php';

Route::prefix('authority')->group(function(){
    Route::post('/signup', [AuthorityAuthController::class, 'signup']);
    Route::post('/login', [AuthorityAuthController::class, 'login']);
    Route::post('/logout', [AuthorityAuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function()
{
    Route::post('/user/report', [ReportController::class, 'store']);
    Route::put('/user/report/{report}', [ReportController::class, 'update']);
    Route::delete('/user/report/{report}', [ReportController::class, 'destroy']);

});

Route::get('/user/report', [ReportController::class, 'index']);
Route::get('/user/report/{report}', [ReportController::class, 'show']);

Route::get('/authority/report', [AuthorityAuthController::class, 'index']);
Route::get('/authority/report/{report}', [ReportController::class, 'show']);

Route::get('/admin/report', [AdminController::class, 'index']);
Route::get('/admin/report/{report}', [ReportController::class, 'show']);


