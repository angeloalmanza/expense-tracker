<?php

namespace App\Http\Controllers;

use App\Contracts\AiProvider;
use App\Http\Requests\AiCategorizeRequest;
use App\Services\AiInsightsService;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function categorize(AiCategorizeRequest $request, AiProvider $ai)
    {
        $category = $ai->categorize(
            $request->validated('name'),
            $request->validated('categories'),
        );

        return response()->json(['category' => $category]);
    }

    public function insights(Request $request, AiInsightsService $service)
    {
        $insights = $service->getInsights($request->user());

        return response()->json(['insights' => $insights]);
    }

    public function clearInsightsCache(Request $request, AiInsightsService $service)
    {
        $service->clearCache($request->user());

        return response()->json(['status' => 'ok']);
    }
}
