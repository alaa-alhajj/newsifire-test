<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

/*
  |--------------------------------------------------------------------------
  | Web Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register web routes for your application. These
  | routes are loaded by the RouteServiceProvider within a group which
  | contains the "web" middleware group. Now create something great!
  |
 */

Route::get('/', function () {
	return view('auth.login');
});

Route::get('/register', function () {
	return view('auth.register');
});

Route::get('/forgot-password', function () {
	return view('auth.forgot-password');
});

Route::get('/dashboard', function () {
	return view('dashboard');
})->middleware(['auth'])->name('dashboard');


//Route::resource('articles', ArticleController::class);
Route::get('{slug}', [ArticleController::class, 'show'])->name('articles.show');

Route::prefix('admin')->group(function () {
	Route::group(['middleware' => 'auth'], function() {
		Route::get('/articles', [ArticleController::class, 'index'])->name('articles');
		Route::post('/article/store', [ArticleController::class, 'store'])->name('articles.store');
		Route::get('/article/create', [ArticleController::class, 'create'])->name('articles.create');
		Route::get('/article/edit/{id}', [ArticleController::class, 'edit'])->name('articles.edit');
		Route::put('/article/edit/{id}', [ArticleController::class, 'update'])->name('articles.update');
		Route::delete('/article/destroy/{id}', [ArticleController::class, 'destroy'])->name('articles.destroy');
		
	});
});

require __DIR__ . '/auth.php';





