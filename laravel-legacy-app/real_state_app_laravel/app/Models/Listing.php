<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'listings';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'title',
        'city',
        'price',
        'bedrooms',
        'agent_id',
    ];

    /**
     * Set the city attribute to lowercase.
     *
     * @param  string  $value
     * @return void
     */
    public function setCityAttribute(string $value): void
    {
        $this->attributes['city'] = strtolower($value);
    }
}
