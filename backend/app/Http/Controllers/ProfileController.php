<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        if (!empty($validated['new_password'])) {
            if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['errors' => ['current_password' => ['Password attuale non corretta']]], 422);
            }
            $user->password = $validated['new_password'];
        }

        $user->name   = $validated['name'];
        $user->email  = $validated['email'];
        $user->avatar = $validated['avatar'] ?? $user->avatar;
        $user->save();

        return response()->json($user);
    }
}
