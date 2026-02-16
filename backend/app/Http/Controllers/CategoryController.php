<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = $request->user()->categories()->orderBy('name')->get();
        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->validated();

        $category = $request->user()->categories()->firstOrCreate(
            ['name' => $validated['name']],
            ['color' => $validated['color'] ?? null],
        );

        return response()->json($category, 201);
    }

    public function update(UpdateCategoryRequest $request, string $id)
    {
        $category = $request->user()->categories()->findOrFail($id);
        $category->update($request->validated());

        return response()->json($category);
    }

    public function destroy(Request $request, string $id)
    {
        $category = $request->user()->categories()->findOrFail($id);
        $category->delete();

        return response()->json(null, 204);
    }
}
