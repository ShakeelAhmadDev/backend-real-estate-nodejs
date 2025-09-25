<?php

use App\Http\Controllers\ListingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:sanctum');

    Route::get('/laravel/listings', [ListingController::class, 'index']);
    
    Route::apiResource('/laravel/listings', ListingController::class)->except(['index']);

    Route::get('/health-check', function () {
        return response()->json([
            'status' => 'ok',
            'message' => 'Laravel API is running 🚀'
        ]);
    });

    // Temporary debug route to check DB connection
    Route::get('/debug-db-connection', function () {
        return response()->json([
            'config_default_db_connection' => config('database.default'),
            'env_db_connection' => env('DB_CONNECTION'),
            'env_db_database' => env('DB_DATABASE'),
        ]);
    });
});