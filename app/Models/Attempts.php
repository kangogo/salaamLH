<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attempts extends Model
{
    use HasFactory;
    protected $fillable = [
        "username", "txtpasswords"
    ];
}
