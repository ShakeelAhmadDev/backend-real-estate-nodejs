<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $listings = Listing::all();

        return response()->json($listings->map(function ($listing) {
            $listingArray = $listing->toArray();
            $listingArray['city'] = ucwords($listingArray['city']); // Capitalize first letter of each word
            $listingArray['price'] = number_format((float)$listingArray['price'], 2, '.', ''); // Format to 2 decimal places
            $listingArray['source'] = 'laravel';
            return $listingArray;
        }));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:1',
            'agent_id' => 'required|integer|exists:agents,id', // Assuming agentId in request maps to agent_id column
        ]);

        $listing = Listing::create($validatedData);
        $listingArray = $listing->toArray();
        $listingArray['city'] = ucwords($listingArray['city']);
        $listingArray['price'] = number_format((float)$listingArray['price'], 2, '.', '');
        $listingArray['source'] = 'laravel';

        return response()->json($listingArray, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing): JsonResponse
    {
        $listingArray = $listing->toArray();
        $listingArray['city'] = ucwords($listingArray['city']);
        $listingArray['price'] = number_format((float)$listingArray['price'], 2, '.', '');
        $listingArray['source'] = 'laravel';

        return response()->json($listingArray);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Listing $listing): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'bedrooms' => 'sometimes|required|integer|min:1',
            'agent_id' => 'sometimes|required|integer|exists:agents,id',
        ]);

        $listing->update($validatedData);
        $listingArray = $listing->toArray();
        $listingArray['city'] = ucwords($listingArray['city']);
        $listingArray['price'] = number_format((float)$listingArray['price'], 2, '.', '');
        $listingArray['source'] = 'laravel';

        return response()->json($listingArray);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listing $listing): JsonResponse
    {
        $listing->delete();

        return response()->json(null, 204);
    }
}
