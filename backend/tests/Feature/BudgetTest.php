<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BudgetTest extends TestCase
{
    use RefreshDatabase;

    private function authenticatedUser(): array
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [$user, $token];
    }

    public function test_user_can_list_budgets(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $user->budgets()->create(['category' => 'Cibo', 'amount' => 300]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/budgets');

        $response->assertOk()
            ->assertJsonCount(1);
    }

    public function test_user_can_create_budget(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/budgets', ['category' => 'Cibo', 'amount' => 300]);

        $response->assertStatus(201)
            ->assertJsonFragment(['category' => 'Cibo', 'amount' => 300.0]);
    }

    public function test_upsert_updates_existing_budget(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $user->budgets()->create(['category' => 'Cibo', 'amount' => 300]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/budgets', ['category' => 'Cibo', 'amount' => 500]);

        $response->assertStatus(200)
            ->assertJsonFragment(['amount' => 500.0]);

        $this->assertDatabaseCount('budgets', 1);
    }

    public function test_user_cannot_see_other_users_budgets(): void
    {
        [$user1,] = $this->authenticatedUser();
        $user1->budgets()->create(['category' => 'Cibo', 'amount' => 300]);

        $user2 = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);
        $token2 = $user2->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token2")
            ->getJson('/api/budgets');

        $response->assertOk()
            ->assertJsonCount(0);
    }

    public function test_user_can_delete_budget(): void
    {
        [$user, $token] = $this->authenticatedUser();

        $budget = $user->budgets()->create(['category' => 'Cibo', 'amount' => 300]);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->deleteJson("/api/budgets/{$budget->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('budgets', ['id' => $budget->id]);
    }

    public function test_user_cannot_delete_other_users_budget(): void
    {
        [$user1,] = $this->authenticatedUser();
        $budget = $user1->budgets()->create(['category' => 'Cibo', 'amount' => 300]);

        $user2 = User::create([
            'name' => 'Other User',
            'email' => 'other@example.com',
            'password' => 'password123',
        ]);
        $token2 = $user2->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token2")
            ->deleteJson("/api/budgets/{$budget->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('budgets', ['id' => $budget->id]);
    }

    public function test_create_budget_validates_required_fields(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/budgets', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category', 'amount']);
    }

    public function test_create_budget_rejects_negative_amount(): void
    {
        [, $token] = $this->authenticatedUser();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/budgets', ['category' => 'Cibo', 'amount' => -100]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_unauthenticated_user_cannot_access_budgets(): void
    {
        $response = $this->getJson('/api/budgets');

        $response->assertStatus(401);
    }
}
