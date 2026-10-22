<?php

use App\Http\Controllers\Public\PagesController;
use Illuminate\Support\Facades\Route;

// Public pages
Route::get('/', [PagesController::class, 'home'])->name('home');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
