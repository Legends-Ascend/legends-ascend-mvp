# Backend Player Data Model & API

**ID:** US-044  
**Story Points:** 13  
**Priority:** MUST  
**Epic/Feature:** Foundation  
**Dependencies:** Database schema (ready), Neon PostgreSQL connection

---

## User Story

As a **football manager**,  
I want **a robust backend system to manage my player roster, inventory, and squad formations**,  
So that **I can build and customize my team, organize lineups, and prepare for matches**.

---

## Context

### Summary
This story establishes the foundational backend infrastructure for player data management in Legends Ascend. It implements the core database schema for players, user inventories, squads, and squad positions, along with REST API endpoints that enable managers to view their player inventory, create squads, manage lineups, and retrieve squad information. This is a critical P0 foundation story that all roster management features depend on.

### Scope

**In Scope:**
- Database schema creation for: `players`, `user_inventory`, `squads`, `squad_positions`
- REST API endpoints for player inventory and squad management
- Player attribute mapping (pace, shooting, passing, dribbling, defending, physical)
- Basic validation for player stats (1-100 range), position constraints, and lineup rules
- Error handling for common scenarios (invalid data, duplicate entries, not found)
- User-scoped data isolation (users can only access their own inventory/squads)
- Support for 5 core formations (4-3-3, 4-2-4, 5-3-2, 3-5-2, 4-4-2)
- Position-based lineup management (GK, DF, MF, FW, UT)

**Out of Scope:**
- Player acquisition/gacha system (separate story)
- Chemistry calculation system (separate story)
- Player fusion/upgrade system (separate story)
- Match simulation integration (separate story)
- AI opponent data management (separate story)
- Transfer market system (separate story)
- Player development/training (separate story)
- Contract management (separate story)
- Frontend UI implementation (separate story)

### Assumptions
- PostgreSQL database (Neon) is already configured and accessible
- User authentication/authorization middleware exists or will be added separately
- Player data will initially be seeded manually or via separate seeding scripts
- Base player stats are integers (1-100 range) representing ratings
- Each user can have multiple squads but typically uses one active squad
- Squads must have exactly 18 player positions (11 starters + 7 bench)
- Players can only be assigned to positions matching their role (GK, DF, MF, FW) or UT (utility)
- UK English terminology used throughout (squad, footballer, pitch, manager)
- All database timestamps use UTC
- API follows RESTful patterns with `/api/v1/` prefix per TECHNICAL_ARCHITECTURE.md

### Foundation Document Compliance
This story adheres to:
- ✅ DEFINITION_OF_READY.md
- ✅ TECHNICAL_ARCHITECTURE.md  
- ✅ BRANDING_GUIDELINE.md (backend; UI text uses UK English)
- ✅ ACCESSIBILITY_REQUIREMENTS.md (API responses structured for accessible frontend)
- ✅ AI_PROMPT_ENGINEERING.md

---

## Functional Requirements

### FR-1: Players Table Schema
Create `players` table to store all available player cards in the game:
- **id** (UUID, PRIMARY KEY): Unique player card identifier
- **name** (VARCHAR(100), NOT NULL): Player name (e.g., "Cristiano Ronaldo")
- **position** (VARCHAR(10), NOT NULL): Player position (GK, DF, MF, FW, UT)
- **rarity** (INTEGER, NOT NULL): Player rarity tier (1-5 stars)
- **base_overall** (INTEGER, NOT NULL, CHECK 40-99): Base overall rating
- **tier** (INTEGER, DEFAULT 0, CHECK 0-5): Upgrade tier from fusion
- **pace** (INTEGER, NOT NULL, CHECK 1-100): Speed and acceleration rating
- **shooting** (INTEGER, NOT NULL, CHECK 1-100): Shooting accuracy and power rating
- **passing** (INTEGER, NOT NULL, CHECK 1-100): Passing accuracy rating
- **dribbling** (INTEGER, NOT NULL, CHECK 1-100): Ball control and agility rating
- **defending** (INTEGER, NOT NULL, CHECK 1-100): Defensive ability rating
- **physical** (INTEGER, NOT NULL, CHECK 1-100): Strength and stamina rating
- **created_at** (TIMESTAMP, DEFAULT NOW()): Record creation timestamp
- **updated_at** (TIMESTAMP, DEFAULT NOW()): Record update timestamp

**Constraints:**
- CHECK constraint: `base_overall >= 40 AND base_overall <= 99`
- CHECK constraint: `tier >= 0 AND tier <= 5`
- CHECK constraint: All stat fields (pace, shooting, etc.) `>= 1 AND <= 100`
- CHECK constraint: `rarity >= 1 AND rarity <= 5`
- CHECK constraint: `position IN ('GK', 'DF', 'MF', 'FW', 'UT')`

**Indexes:**
- Primary key index on `id`
- Index on `position` for filtering
- Index on `rarity` for rarity-based queries
- Index on `base_overall` for rating-based searches

### FR-2: User Inventory Table Schema
Create `user_inventory` table to track which players each user owns:
- **id** (UUID, PRIMARY KEY): Unique inventory record identifier
- **user_id** (UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE): Owner user ID
- **player_id** (UUID, NOT NULL, REFERENCES players(id) ON DELETE CASCADE): Player card ID
- **quantity** (INTEGER, DEFAULT 1, CHECK >= 1): Number of duplicate copies owned
- **acquired_at** (TIMESTAMP, DEFAULT NOW()): When player was acquired
- **created_at** (TIMESTAMP, DEFAULT NOW()): Record creation timestamp

**Constraints:**
- UNIQUE constraint on `(user_id, player_id)`: Users cannot have duplicate inventory records
- CHECK constraint: `quantity >= 1 AND quantity <= 50` (max 50 copies per game design)
- Foreign key cascade delete: If user deleted, remove inventory; if player deleted, remove inventory

**Indexes:**
- Primary key index on `id`
- Index on `user_id` for fast inventory lookups
- Composite index on `(user_id, player_id)` for duplicate checking

### FR-3: Squads Table Schema
Create `squads` table to store user-created team squads:
- **id** (UUID, PRIMARY KEY): Unique squad identifier
- **user_id** (UUID, NOT NULL, REFERENCES users(id) ON DELETE CASCADE): Squad owner
- **name** (VARCHAR(100), NOT NULL): Squad name (e.g., "Main Squad", "Cup Team")
- **formation** (VARCHAR(10), NOT NULL): Formation code (4-3-3, 4-2-4, 5-3-2, 3-5-2, 4-4-2)
- **is_active** (BOOLEAN, DEFAULT false): Whether this is the user's active squad
- **created_at** (TIMESTAMP, DEFAULT NOW()): Squad creation timestamp
- **updated_at** (TIMESTAMP, DEFAULT NOW()): Squad last modified timestamp

**Constraints:**
- CHECK constraint: `formation IN ('4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2')`
- Only one squad per user can have `is_active = true` (enforced via application logic or trigger)

**Indexes:**
- Primary key index on `id`
- Index on `user_id` for listing user's squads
- Index on `(user_id, is_active)` for finding active squad

### FR-4: Squad Positions Table Schema
Create `squad_positions` table to store player assignments within squads:
- **id** (UUID, PRIMARY KEY): Unique position assignment identifier
- **squad_id** (UUID, NOT NULL, REFERENCES squads(id) ON DELETE CASCADE): Squad this position belongs to
- **player_id** (UUID, NULL, REFERENCES players(id) ON DELETE SET NULL): Assigned player (nullable for empty positions)
- **position_slot** (VARCHAR(20), NOT NULL): Position identifier (e.g., "GK_1", "DF_1", "MF_1", "FW_1", "BENCH_1")
- **slot_type** (VARCHAR(10), NOT NULL): "STARTER" or "BENCH"
- **created_at** (TIMESTAMP, DEFAULT NOW()): Assignment creation timestamp
- **updated_at** (TIMESTAMP, DEFAULT NOW()): Assignment update timestamp

**Constraints:**
- UNIQUE constraint on `(squad_id, position_slot)`: Each position slot occupied once per squad
- UNIQUE constraint on `(squad_id, player_id)` WHERE player_id IS NOT NULL: Same player cannot occupy multiple positions in same squad
- CHECK constraint: `slot_type IN ('STARTER', 'BENCH')`
- CHECK constraint: `position_slot LIKE 'GK_%' OR position_slot LIKE 'DF_%' OR position_slot LIKE 'MF_%' OR position_slot LIKE 'FW_%' OR position_slot LIKE 'BENCH_%'`

**Indexes:**
- Primary key index on `id`
- Index on `squad_id` for listing squad lineup
- Index on `player_id` for finding where a player is assigned

### FR-5: REST API Endpoint - GET /api/v1/players/my-inventory
Retrieve the authenticated user's player inventory with details:

**Authentication:** Required (JWT or session-based)

**Query Parameters:**
- `position` (optional, string): Filter by position (GK, DF, MF, FW, UT)
- `rarity` (optional, integer): Filter by rarity (1-5)
- `min_overall` (optional, integer): Filter by minimum base_overall
- `max_overall` (optional, integer): Filter by maximum base_overall
- `sort` (optional, string): Sort field (name, base_overall, rarity, acquired_at). Default: acquired_at
- `order` (optional, string): Sort order (asc, desc). Default: desc
- `page` (optional, integer, min 1): Page number for pagination. Default: 1
- `limit` (optional, integer, min 1, max 100): Items per page. Default: 20

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "inventory_id": "uuid-inventory-1",
        "player": {
          "id": "uuid-player-1",
          "name": "Cristiano Ronaldo",
          "position": "FW",
          "rarity": 5,
          "base_overall": 95,
          "tier": 0,
          "pace": 92,
          "shooting": 95,
          "passing": 82,
          "dribbling": 90,
          "defending": 34,
          "physical": 78
        },
        "quantity": 3,
        "acquired_at": "2025-11-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total_items": 45,
      "total_pages": 3
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** User not authenticated
- **400 Bad Request:** Invalid query parameters (e.g., invalid position, rarity out of range)
- **500 Internal Server Error:** Database or server error

**Validation Rules:**
- `position` must be one of: GK, DF, MF, FW, UT
- `rarity` must be 1-5
- `min_overall` and `max_overall` must be 40-99
- `page` must be >= 1
- `limit` must be 1-100

### FR-6: REST API Endpoint - POST /api/v1/squads
Create a new squad for the authenticated user:

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Champions League Squad",
  "formation": "4-3-3",
  "is_active": false
}
```

**Request Validation:**
- `name` (required, string, 1-100 chars): Squad name
- `formation` (required, string): Must be one of: 4-3-3, 4-2-4, 5-3-2, 3-5-2, 4-4-2
- `is_active` (optional, boolean): Whether this is the active squad. Default: false

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "squad": {
      "id": "uuid-squad-1",
      "user_id": "uuid-user-1",
      "name": "Champions League Squad",
      "formation": "4-3-3",
      "is_active": false,
      "created_at": "2025-11-18T12:00:00Z",
      "updated_at": "2025-11-18T12:00:00Z",
      "positions": [
        {
          "id": "uuid-position-1",
          "position_slot": "GK_1",
          "slot_type": "STARTER",
          "player_id": null
        },
        // ... 17 more positions (total 18: 11 starters + 7 bench)
      ]
    }
  },
  "message": "Squad created successfully"
}
```

**Error Responses:**
- **401 Unauthorized:** User not authenticated
- **400 Bad Request:** Invalid formation, missing name, name too long
- **409 Conflict:** Squad name already exists for this user
- **500 Internal Server Error:** Database error

**Business Logic:**
- Automatically creates 18 `squad_positions` records based on formation:
  - Formation-specific starters (e.g., 4-3-3: 1 GK, 4 DF, 3 MF, 3 FW)
  - 7 bench slots (BENCH_1 through BENCH_7)
- All positions initially have `player_id = null` (empty lineup)
- If `is_active = true` is requested, deactivate any other active squad for this user

### FR-7: REST API Endpoint - PUT /api/v1/squads/:squadId/lineup
Update player assignments in a squad's lineup:

**Authentication:** Required

**URL Parameters:**
- `squadId` (UUID): Squad identifier

**Request Body:**
```json
{
  "positions": [
    {
      "position_slot": "GK_1",
      "player_id": "uuid-player-goalkeeper"
    },
    {
      "position_slot": "DF_1",
      "player_id": "uuid-player-defender-1"
    },
    {
      "position_slot": "BENCH_1",
      "player_id": "uuid-player-substitute-1"
    }
    // Can include partial or full lineup updates
  ]
}
```

**Request Validation:**
- `positions` (required, array): Array of position assignments
- Each position object must have:
  - `position_slot` (required, string): Valid position slot identifier
  - `player_id` (required, UUID or null): Player to assign (null to clear position)
- User must own all assigned players (check `user_inventory`)
- Player position type must be compatible with slot (e.g., GK players only in GK slots)
- Same player cannot be assigned to multiple positions in the squad
- Squad must belong to authenticated user

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "squad": {
      "id": "uuid-squad-1",
      "name": "Champions League Squad",
      "formation": "4-3-3",
      "positions": [
        {
          "id": "uuid-position-1",
          "position_slot": "GK_1",
          "slot_type": "STARTER",
          "player_id": "uuid-player-goalkeeper",
          "player": {
            "id": "uuid-player-goalkeeper",
            "name": "Manuel Neuer",
            "position": "GK",
            "base_overall": 89
          }
        }
        // ... all 18 positions
      ],
      "updated_at": "2025-11-18T13:00:00Z"
    }
  },
  "message": "Lineup updated successfully"
}
```

**Error Responses:**
- **401 Unauthorized:** User not authenticated
- **403 Forbidden:** Squad does not belong to authenticated user
- **404 Not Found:** Squad not found, or player not found
- **400 Bad Request:** Invalid position_slot, player not in user's inventory, position type mismatch (e.g., FW player in GK slot)
- **409 Conflict:** Player already assigned to another position in this squad
- **500 Internal Server Error:** Database error

**Position Compatibility Rules:**
- GK_* slots: Only GK or UT players
- DF_* slots: Only DF or UT players
- MF_* slots: Only MF or UT players
- FW_* slots: Only FW or UT players
- BENCH_* slots: Any position (GK, DF, MF, FW, UT)

### FR-8: REST API Endpoint - GET /api/v1/squads/:squadId
Retrieve complete squad information including lineup:

**Authentication:** Required

**URL Parameters:**
- `squadId` (UUID): Squad identifier

**Query Parameters:**
- `include_stats` (optional, boolean): Include full player stats. Default: false

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "squad": {
      "id": "uuid-squad-1",
      "user_id": "uuid-user-1",
      "name": "Champions League Squad",
      "formation": "4-3-3",
      "is_active": true,
      "created_at": "2025-11-18T12:00:00Z",
      "updated_at": "2025-11-18T13:00:00Z",
      "positions": [
        {
          "id": "uuid-position-1",
          "position_slot": "GK_1",
          "slot_type": "STARTER",
          "player_id": "uuid-player-goalkeeper",
          "player": {
            "id": "uuid-player-goalkeeper",
            "name": "Manuel Neuer",
            "position": "GK",
            "rarity": 4,
            "base_overall": 89,
            "tier": 2,
            "pace": 58,
            "shooting": 45,
            "passing": 72,
            "dribbling": 68,
            "defending": 42,
            "physical": 81
          }
        }
        // ... all 18 positions
      ],
      "starters_count": 11,
      "bench_count": 7,
      "filled_positions": 15,
      "empty_positions": 3
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** User not authenticated
- **403 Forbidden:** Squad does not belong to authenticated user
- **404 Not Found:** Squad not found
- **500 Internal Server Error:** Database error

### FR-9: Input Validation & Sanitization
All API endpoints must validate and sanitize inputs:
- UUID format validation for all ID parameters
- String length limits enforced (name max 100 chars)
- Enum validation for position, formation, slot_type
- Integer range validation for stats (1-100), rarity (1-5), overall (40-99)
- SQL injection prevention via parameterized queries
- XSS prevention by not rendering user input in responses without escaping (JSON API safe by default)

### FR-10: Error Handling & Messaging
Standardized error response format:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FORMATION",
    "message": "Formation must be one of: 4-3-3, 4-2-4, 5-3-2, 3-5-2, 4-4-2",
    "details": {
      "field": "formation",
      "value": "3-4-3"
    }
  }
}
```

**Error Codes:**
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks permission
- `NOT_FOUND`: Resource not found
- `INVALID_INPUT`: Validation failed
- `PLAYER_NOT_IN_INVENTORY`: Player not owned by user
- `POSITION_MISMATCH`: Player position incompatible with slot
- `DUPLICATE_ASSIGNMENT`: Player already assigned in squad
- `INVALID_FORMATION`: Formation not supported
- `DATABASE_ERROR`: Database operation failed

**Security Considerations:**
- Error messages must NOT expose sensitive data (e.g., other users' data, internal IDs)
- Stack traces only logged server-side, never returned to client
- Rate limiting applied to prevent abuse (not implemented in this story)

---

## Non-Functional Requirements

### Performance
- **API Response Time:** All endpoints must respond within 500ms at p95 for normal loads (<1000 records)
- **Database Query Optimization:**
  - Index on `user_inventory.user_id` for fast inventory lookups
  - Index on `squads.user_id` for listing squads
  - Composite index on `(squad_id, position_slot)` for lineup queries
  - Use `SELECT` with specific columns instead of `SELECT *`
  - Pagination for inventory endpoint (max 100 items per page)
- **Concurrent Users:** Support at least 100 concurrent users without degradation
- **Connection Pooling:** PostgreSQL connection pool with min 5, max 20 connections

### Security
- **Authentication:** All endpoints require valid JWT token or session
- **Authorization:** Users can only access/modify their own inventory and squads
  - Enforce `user_id` filtering in WHERE clauses
  - Validate squad ownership before updates (403 Forbidden if user doesn't own squad)
- **Input Validation:** 
  - Zod schemas for all request bodies and query parameters
  - Reject requests with invalid UUIDs, out-of-range values, or malformed data
- **SQL Injection Prevention:** Use parameterized queries exclusively (no string concatenation)
- **Data Isolation:** Database queries MUST filter by `user_id` to prevent cross-user data access
- **Error Messages:** Do not expose internal database errors or sensitive data in API responses

### Accessibility
- **API Design:** Structure responses to support accessible frontend rendering
- **UK English:** All API field names, messages, and documentation use UK English terminology:
  - "squad" not "roster"
  - "footballer" not "soccer player"
  - "formation" not "lineup formation system"
  - "match" not "game"
- **Consistent Naming:** Field names use snake_case for database, camelCase for JSON API responses

### Branding
- API response messages use professional, clear language
- UK English spelling (e.g., "organisation" if applicable, "colour" in future)
- Terminology consistent with BRANDING_GUIDELINE.md principles

### Internationalization
- **UK English Terminology:** "squad", "formation", "footballer", "pitch", "manager"
- **Metric System:** Not applicable for this story (no measurements)
- **Date Format:** All timestamps in ISO 8601 UTC format (YYYY-MM-DDTHH:MM:SSZ)
- **Currency:** Not applicable for this story (no transactions)
- **Externalizable Strings:** Error messages and API responses structured for future i18n

### Observability
- **Structured Logging:**
  - Log all API requests with method, path, user_id, timestamp
  - Log database queries with execution time
  - Log errors with stack traces (server-side only)
  - Use JSON log format for aggregation
- **Metrics/Telemetry:**
  - Track API endpoint response times (p50, p95, p99)
  - Track database query execution times
  - Track error rates by endpoint
- **Error Tracking:** Integrate with error monitoring service (e.g., Sentry) for production
- **Audit Trails:** Log squad creation, lineup updates with user_id and timestamp

---

## Acceptance Criteria

### AC-1: Database Tables Created Successfully
**Given** the application is initialized  
**When** the database migration runs  
**Then** the following tables exist with correct schemas:
- `players` table with all specified columns, constraints, and indexes
- `user_inventory` table with foreign key references to users and players
- `squads` table with user_id foreign key
- `squad_positions` table with foreign keys to squads and players
**And** all CHECK constraints are enforced (stat ranges, rarity, position enums)
**And** all indexes are created for performance optimization

### AC-2: User Can Retrieve Their Player Inventory
**Given** a user is authenticated with user_id "user-123"  
**And** the user owns 3 players in their inventory  
**When** the user sends GET /api/v1/players/my-inventory  
**Then** the API returns 200 OK  
**And** the response contains exactly 3 player records  
**And** each record includes player details (name, position, stats) and quantity  
**And** the response does NOT include players owned by other users

### AC-3: Inventory Filtering Works Correctly
**Given** a user has players of various positions (GK, DF, MF, FW)  
**When** the user sends GET /api/v1/players/my-inventory?position=FW  
**Then** the API returns only FW (Forward) players  
**And** the response excludes GK, DF, MF players

**When** the user sends GET /api/v1/players/my-inventory?rarity=5  
**Then** the API returns only 5-star (Mythic) rarity players

**When** the user sends GET /api/v1/players/my-inventory?min_overall=85  
**Then** the API returns only players with base_overall >= 85

### AC-4: Inventory Pagination Works Correctly
**Given** a user owns 45 players  
**When** the user sends GET /api/v1/players/my-inventory?page=1&limit=20  
**Then** the API returns 20 players  
**And** the pagination object shows: `{"page": 1, "limit": 20, "total_items": 45, "total_pages": 3}`

**When** the user sends GET /api/v1/players/my-inventory?page=3&limit=20  
**Then** the API returns 5 players (remaining items)

### AC-5: User Can Create a Squad
**Given** a user is authenticated  
**When** the user sends POST /api/v1/squads with:
```json
{
  "name": "Main Squad",
  "formation": "4-3-3",
  "is_active": true
}
```
**Then** the API returns 201 Created  
**And** a new squad is created in the database with user_id matching the authenticated user  
**And** 18 squad_positions records are created (11 starters + 7 bench)  
**And** all positions have player_id = null initially  
**And** the squad formation matches the requested formation (4-3-3)  
**And** position slots match formation: GK_1 (1), DF_1 to DF_4 (4), MF_1 to MF_3 (3), FW_1 to FW_3 (3), BENCH_1 to BENCH_7 (7)

### AC-6: Squad Creation Validates Formation
**Given** a user is authenticated  
**When** the user sends POST /api/v1/squads with `"formation": "3-4-3"` (invalid)  
**Then** the API returns 400 Bad Request  
**And** the error message indicates: "Formation must be one of: 4-3-3, 4-2-4, 5-3-2, 3-5-2, 4-4-2"

**When** the user sends POST /api/v1/squads with missing `name` field  
**Then** the API returns 400 Bad Request  
**And** the error indicates name is required

### AC-7: User Can Update Squad Lineup
**Given** a user owns a squad with id "squad-123"  
**And** the user owns players: "player-gk", "player-df1", "player-mf1"  
**When** the user sends PUT /api/v1/squads/squad-123/lineup with:
```json
{
  "positions": [
    {"position_slot": "GK_1", "player_id": "player-gk"},
    {"position_slot": "DF_1", "player_id": "player-df1"},
    {"position_slot": "MF_1", "player_id": "player-mf1"}
  ]
}
```
**Then** the API returns 200 OK  
**And** the squad_positions table is updated with the new assignments  
**And** the response includes the updated lineup with player details

### AC-8: Lineup Update Validates Player Ownership
**Given** a user owns a squad "squad-123"  
**And** the user does NOT own player "player-other-user"  
**When** the user sends PUT /api/v1/squads/squad-123/lineup with player_id "player-other-user"  
**Then** the API returns 400 Bad Request  
**And** the error message indicates: "Player not found in your inventory"  
**And** no positions are updated in the database

### AC-9: Lineup Update Validates Position Compatibility
**Given** a user owns a Forward player "player-fw"  
**And** the user owns a squad "squad-123"  
**When** the user sends PUT /api/v1/squads/squad-123/lineup assigning "player-fw" to "GK_1" slot  
**Then** the API returns 400 Bad Request  
**And** the error message indicates: "Player position FW is not compatible with GK slot"  
**And** the lineup is not updated

**Given** a user owns a Utility player "player-ut"  
**When** the user assigns "player-ut" to any position slot (GK_1, DF_1, MF_1, FW_1, BENCH_1)  
**Then** the assignment is successful (UT players can play any position)

### AC-10: Lineup Update Prevents Duplicate Assignments
**Given** a user owns a squad "squad-123"  
**And** the user owns midfielder "player-mf1"  
**When** the user sends PUT /api/v1/squads/squad-123/lineup with:
```json
{
  "positions": [
    {"position_slot": "MF_1", "player_id": "player-mf1"},
    {"position_slot": "MF_2", "player_id": "player-mf1"}
  ]
}
```
**Then** the API returns 409 Conflict  
**And** the error message indicates: "Player is already assigned to another position in this squad"  
**And** no positions are updated

### AC-11: User Can Retrieve Squad Details
**Given** a user owns a squad "squad-123" with name "Champions League Squad"  
**And** the squad has formation "4-3-3"  
**And** the squad has 5 positions filled with players  
**When** the user sends GET /api/v1/squads/squad-123  
**Then** the API returns 200 OK  
**And** the response includes squad metadata (id, name, formation, is_active)  
**And** the response includes all 18 position slots  
**And** filled positions include player details (name, position, base_overall, stats)  
**And** empty positions have player_id = null  
**And** the response includes summary counts: starters_count=11, bench_count=7, filled_positions=5, empty_positions=13

### AC-12: Squad Access is User-Scoped
**Given** user "user-A" owns squad "squad-A"  
**And** user "user-B" is authenticated  
**When** user "user-B" sends GET /api/v1/squads/squad-A  
**Then** the API returns 403 Forbidden  
**And** the error message indicates: "You do not have permission to access this squad"

**When** user "user-B" sends PUT /api/v1/squads/squad-A/lineup  
**Then** the API returns 403 Forbidden

### AC-13: Data Isolation and Security
**Given** multiple users exist in the system  
**And** each user has their own inventory and squads  
**When** any API endpoint is called  
**Then** the database queries MUST filter by the authenticated user's user_id  
**And** users can NEVER see or modify another user's data  
**And** all SQL queries use parameterized statements (no SQL injection possible)

### AC-14: Error Handling for Not Found Resources
**Given** a user is authenticated  
**When** the user sends GET /api/v1/squads/non-existent-id  
**Then** the API returns 404 Not Found  
**And** the error message indicates: "Squad not found"

**When** the user sends PUT /api/v1/squads/squad-123/lineup with player_id "non-existent-player"  
**Then** the API returns 404 Not Found  
**And** the error message indicates: "Player not found"

### AC-15: Performance Targets Met
**Given** the database contains 1000 players and 100 users with inventories  
**When** a user requests GET /api/v1/players/my-inventory  
**Then** the API responds in <500ms at p95  
**And** the database query uses indexed lookups on user_id

**When** a user requests GET /api/v1/squads/squad-123  
**Then** the API responds in <500ms at p95  
**And** the query includes JOIN optimizations for fetching player details

---

## Test Scenarios

### TS-1: [Maps to AC-1] - Database Schema Creation
**Steps:**
1. Run database migration script
2. Query database to verify tables exist: `SELECT table_name FROM information_schema.tables WHERE table_name IN ('players', 'user_inventory', 'squads', 'squad_positions')`
3. Check column definitions for each table
4. Verify constraints (CHECK, UNIQUE, FOREIGN KEY) are in place
5. Verify indexes are created

**Expected Result:** All 4 tables exist with correct schemas, constraints, and indexes

### TS-2: [Maps to AC-2, AC-3, AC-4] - Retrieve and Filter Inventory
**Setup:**
- Create test user "test-user-1"
- Seed players: GK (OVR 85), DF (OVR 78), MF (OVR 90), FW (OVR 92)
- Add all 4 players to test-user-1's inventory

**Steps:**
1. Authenticate as test-user-1
2. GET /api/v1/players/my-inventory → Expect 4 players
3. GET /api/v1/players/my-inventory?position=FW → Expect 1 player (FW)
4. GET /api/v1/players/my-inventory?min_overall=85 → Expect 3 players (GK, MF, FW)
5. GET /api/v1/players/my-inventory?page=1&limit=2 → Expect 2 players, pagination shows total_items=4

**Expected Result:** All filters and pagination work correctly, returning only user's own players

### TS-3: [Maps to AC-5, AC-6] - Create Squad with Validation
**Setup:**
- Authenticate as test-user-1

**Steps:**
1. POST /api/v1/squads with valid data (name="Test Squad", formation="4-3-3", is_active=true)
   - Expect 201 Created
   - Verify squad created with 18 positions
   - Verify positions match formation (1 GK, 4 DF, 3 MF, 3 FW, 7 BENCH)
2. POST /api/v1/squads with invalid formation="3-4-3"
   - Expect 400 Bad Request with error message
3. POST /api/v1/squads with missing name field
   - Expect 400 Bad Request

**Expected Result:** Valid squad creation succeeds, invalid requests rejected with clear errors

### TS-4: [Maps to AC-7, AC-8, AC-9, AC-10] - Update Squad Lineup with Validations
**Setup:**
- User owns squad "test-squad" with formation 4-3-3
- User owns players: GK "player-gk", DF "player-df1", MF "player-mf1", FW "player-fw1", UT "player-ut1"
- Another user owns player "player-other"

**Steps:**
1. PUT /api/v1/squads/test-squad/lineup - Assign player-gk to GK_1
   - Expect 200 OK, position updated
2. PUT /api/v1/squads/test-squad/lineup - Assign player-other to DF_1
   - Expect 400 Bad Request "Player not in inventory"
3. PUT /api/v1/squads/test-squad/lineup - Assign player-fw1 to GK_1
   - Expect 400 Bad Request "Position mismatch"
4. PUT /api/v1/squads/test-squad/lineup - Assign player-ut1 to GK_1
   - Expect 200 OK (UT can play any position)
5. PUT /api/v1/squads/test-squad/lineup - Assign player-mf1 to both MF_1 and MF_2
   - Expect 409 Conflict "Duplicate assignment"

**Expected Result:** All validation rules enforced correctly

### TS-5: [Maps to AC-11, AC-12] - Retrieve Squad with Access Control
**Setup:**
- User-A owns squad "squad-A" with 5 players assigned
- User-B is authenticated

**Steps:**
1. Authenticate as User-A
2. GET /api/v1/squads/squad-A
   - Expect 200 OK with full squad details
   - Verify 18 positions returned
   - Verify filled_positions=5, empty_positions=13
3. Authenticate as User-B
4. GET /api/v1/squads/squad-A
   - Expect 403 Forbidden

**Expected Result:** User can only access their own squads

### TS-6: [Maps to AC-13] - Data Isolation Across Users
**Setup:**
- User-A has inventory with 5 players
- User-B has inventory with 3 different players

**Steps:**
1. Authenticate as User-A
2. GET /api/v1/players/my-inventory → Expect 5 players (User-A's)
3. Authenticate as User-B
4. GET /api/v1/players/my-inventory → Expect 3 players (User-B's)
5. Verify no overlap in returned data

**Expected Result:** Each user sees only their own data, complete isolation

### TS-7: [Maps to AC-14] - Error Handling for Not Found
**Steps:**
1. GET /api/v1/squads/non-existent-uuid
   - Expect 404 Not Found
2. PUT /api/v1/squads/valid-squad-id/lineup with player_id="non-existent-player"
   - Expect 404 Not Found

**Expected Result:** Clear 404 errors for missing resources

### TS-8: [Maps to AC-15] - Performance Benchmarks
**Setup:**
- Database with 1000 players
- 100 users with 20-50 players each in inventory

**Steps:**
1. Run load test: 50 concurrent GET /api/v1/players/my-inventory requests
2. Measure response times (p50, p95, p99)
3. Run query EXPLAIN on inventory and squad queries
4. Verify indexes are being used

**Expected Result:** p95 response time <500ms, indexes used in queries

---

## Technical Notes

### API Design

**Base Path:** `/api/v1/`

**Authentication:** All endpoints require valid JWT token in `Authorization: Bearer <token>` header

**Endpoints Summary:**
```
GET    /api/v1/players/my-inventory       # List user's player inventory
POST   /api/v1/squads                     # Create new squad
PUT    /api/v1/squads/:squadId/lineup     # Update squad lineup
GET    /api/v1/squads/:squadId            # Get squad details
```

**Standard Headers:**
- Request: `Content-Type: application/json`, `Authorization: Bearer <token>`
- Response: `Content-Type: application/json`

### Data Model

**Database: PostgreSQL (Neon)**

**Schema DDL:**
```sql
-- Players table (master list of all player cards)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  position VARCHAR(10) NOT NULL CHECK (position IN ('GK', 'DF', 'MF', 'FW', 'UT')),
  rarity INTEGER NOT NULL CHECK (rarity >= 1 AND rarity <= 5),
  base_overall INTEGER NOT NULL CHECK (base_overall >= 40 AND base_overall <= 99),
  tier INTEGER DEFAULT 0 CHECK (tier >= 0 AND tier <= 5),
  pace INTEGER NOT NULL CHECK (pace >= 1 AND pace <= 100),
  shooting INTEGER NOT NULL CHECK (shooting >= 1 AND shooting <= 100),
  passing INTEGER NOT NULL CHECK (passing >= 1 AND passing <= 100),
  dribbling INTEGER NOT NULL CHECK (dribbling >= 1 AND dribbling <= 100),
  defending INTEGER NOT NULL CHECK (defending >= 1 AND defending <= 100),
  physical INTEGER NOT NULL CHECK (physical >= 1 AND physical <= 100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_players_position ON players(position);
CREATE INDEX idx_players_rarity ON players(rarity);
CREATE INDEX idx_players_base_overall ON players(base_overall);

-- User inventory (which players each user owns)
CREATE TABLE user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 50),
  acquired_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, player_id)
);

CREATE INDEX idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX idx_user_inventory_composite ON user_inventory(user_id, player_id);

-- Squads (user-created teams)
CREATE TABLE squads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  formation VARCHAR(10) NOT NULL CHECK (formation IN ('4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2')),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_squads_user_id ON squads(user_id);
CREATE INDEX idx_squads_user_active ON squads(user_id, is_active);

-- Squad positions (player assignments within squads)
CREATE TABLE squad_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  position_slot VARCHAR(20) NOT NULL,
  slot_type VARCHAR(10) NOT NULL CHECK (slot_type IN ('STARTER', 'BENCH')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(squad_id, position_slot),
  UNIQUE(squad_id, player_id) WHERE player_id IS NOT NULL
);

CREATE INDEX idx_squad_positions_squad_id ON squad_positions(squad_id);
CREATE INDEX idx_squad_positions_player_id ON squad_positions(player_id);
```

### Validation Schemas

**TypeScript with Zod:**

```typescript
import { z } from 'zod';

// Player position enum
export const PlayerPosition = z.enum(['GK', 'DF', 'MF', 'FW', 'UT']);

// Formation enum
export const Formation = z.enum(['4-3-3', '4-2-4', '5-3-2', '3-5-2', '4-4-2']);

// Inventory query params schema
export const inventoryQuerySchema = z.object({
  position: PlayerPosition.optional(),
  rarity: z.coerce.number().int().min(1).max(5).optional(),
  min_overall: z.coerce.number().int().min(40).max(99).optional(),
  max_overall: z.coerce.number().int().min(40).max(99).optional(),
  sort: z.enum(['name', 'base_overall', 'rarity', 'acquired_at']).default('acquired_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Create squad request schema
export const createSquadSchema = z.object({
  name: z.string().min(1).max(100),
  formation: Formation,
  is_active: z.boolean().default(false),
});

// Update lineup request schema
export const updateLineupSchema = z.object({
  positions: z.array(
    z.object({
      position_slot: z.string().regex(/^(GK|DF|MF|FW|BENCH)_\d+$/),
      player_id: z.string().uuid().nullable(),
    })
  ).min(1),
});

// Player model schema
export const playerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  position: PlayerPosition,
  rarity: z.number().int().min(1).max(5),
  base_overall: z.number().int().min(40).max(99),
  tier: z.number().int().min(0).max(5),
  pace: z.number().int().min(1).max(100),
  shooting: z.number().int().min(1).max(100),
  passing: z.number().int().min(1).max(100),
  dribbling: z.number().int().min(1).max(100),
  defending: z.number().int().min(1).max(100),
  physical: z.number().int().min(1).max(100),
  created_at: z.date(),
  updated_at: z.date(),
});
```

### Migrations

**Required:** Yes

**Migration Files:**
1. `001_create_players_table.sql` - Creates players table with constraints and indexes
2. `002_create_user_inventory_table.sql` - Creates user_inventory table with foreign keys
3. `003_create_squads_table.sql` - Creates squads table
4. `004_create_squad_positions_table.sql` - Creates squad_positions table

**Rollback Plan:**
- Drop tables in reverse order: squad_positions → squads → user_inventory → players
- Use transactions for atomic migration/rollback
- Backup database before running migrations in production
- Test migrations in staging environment first

**Sample Migration (TypeScript with node-pg-migrate or similar):**
```typescript
export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('players', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(100)',
      notNull: true,
    },
    position: {
      type: 'varchar(10)',
      notNull: true,
      check: "position IN ('GK', 'DF', 'MF', 'FW', 'UT')",
    },
    // ... other columns
    created_at: {
      type: 'timestamp',
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('players', 'position', { name: 'idx_players_position' });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('players');
}
```

### Integration Points

**Authentication System:**
- Requires JWT middleware to extract `user_id` from token
- Middleware: `authenticateUser` - validates token and attaches `req.user.id`

**Frontend Integration:**
- Frontend will call these APIs to:
  - Display player inventory with filters
  - Create and manage squads
  - Build lineup with drag-and-drop (calls PUT lineup endpoint)
  - View squad details in squad management UI

**Future Integrations:**
- **Match Engine:** Will read squad lineup from `squad_positions` to simulate matches
- **Chemistry System:** Will calculate chemistry bonuses based on position adjacency in lineup
- **Gacha System:** Will add players to `user_inventory` when acquired
- **Player Development:** Will update player stats in `players` table
- **Transfer Market:** Will modify `user_inventory` quantities when players are bought/sold

### Failure Modes & Resilience

**Database Unavailable:**
- Retry connection with exponential backoff (3 attempts, 1s, 2s, 4s delays)
- Return 503 Service Unavailable if database cannot be reached
- Log critical error for alerting

**Query Timeouts:**
- Set query timeout to 5 seconds
- Return 504 Gateway Timeout if query exceeds limit
- Log slow query for investigation

**Invalid User Token:**
- Return 401 Unauthorized immediately
- Do not attempt database queries without valid user_id

**Concurrent Squad Updates:**
- Use database transactions with row-level locking
- Handle deadlock exceptions with retry (max 3 attempts)
- Return 409 Conflict if concurrent update detected

**Invalid Data in Requests:**
- Validate with Zod before database operations
- Return 400 Bad Request with specific field errors
- Never insert invalid data into database

### Performance Targets

**API Endpoints:**
- GET /api/v1/players/my-inventory: <500ms p95 (with pagination)
- POST /api/v1/squads: <300ms p95
- PUT /api/v1/squads/:id/lineup: <400ms p95
- GET /api/v1/squads/:id: <300ms p95

**Database Queries:**
- Inventory lookup by user_id: <100ms (with index)
- Squad creation with 18 positions: <150ms (batch insert)
- Lineup update (multiple positions): <100ms (transaction with prepared statements)
- Squad details with player joins: <100ms (indexed joins)

**Optimization Strategies:**
- Use prepared statements for repeated queries
- Batch insert 18 squad_positions in single transaction
- Use SELECT with specific columns instead of SELECT *
- Implement database connection pooling (min 5, max 20)
- Cache frequently accessed data (e.g., player stats) with Redis if needed (future enhancement)

---

## Task Breakdown for AI Agents

### Phase 1: Database Schema Design & Migration
- [x] Review game design specifications for player attributes and squad rules
- [ ] Design database schema (players, user_inventory, squads, squad_positions)
- [ ] Create migration files for each table
- [ ] Define indexes for performance optimization
- [ ] Write rollback scripts for each migration
- [ ] Test migrations in local development environment
- [ ] Document schema design decisions

### Phase 2: API Implementation (Coding Agent)
- [ ] Set up TypeScript project structure for API endpoints
- [ ] Install dependencies: Express/Fastify, Zod, pg (PostgreSQL client)
- [ ] Implement authentication middleware (JWT validation)
- [ ] Create Zod validation schemas for all request/response types
- [ ] Implement GET /api/v1/players/my-inventory endpoint
  - [ ] Query user_inventory with filters and pagination
  - [ ] Join with players table for details
  - [ ] Implement sorting and filtering logic
- [ ] Implement POST /api/v1/squads endpoint
  - [ ] Validate request body
  - [ ] Create squad record
  - [ ] Generate 18 squad_positions based on formation
  - [ ] Handle is_active flag (deactivate other squads)
- [ ] Implement PUT /api/v1/squads/:squadId/lineup endpoint
  - [ ] Validate ownership (squad belongs to user)
  - [ ] Validate player ownership (players in user_inventory)
  - [ ] Validate position compatibility (GK in GK slot, etc.)
  - [ ] Check for duplicate assignments
  - [ ] Update squad_positions in transaction
- [ ] Implement GET /api/v1/squads/:squadId endpoint
  - [ ] Validate ownership
  - [ ] Fetch squad with all positions
  - [ ] Join with players table for assigned players
  - [ ] Calculate summary counts (filled/empty positions)
- [ ] Implement standardized error handling
  - [ ] Create error response formatter
  - [ ] Handle database errors gracefully
  - [ ] Ensure no sensitive data in errors
- [ ] Add structured logging for all endpoints
- [ ] Ensure user data isolation in all queries

### Phase 3: Testing (Testing Agent)
- [ ] Unit tests for Zod schemas
- [ ] Unit tests for validation logic (position compatibility, ownership checks)
- [ ] Integration tests for GET /api/v1/players/my-inventory
  - [ ] Test with no inventory
  - [ ] Test with multiple players
  - [ ] Test filters (position, rarity, overall)
  - [ ] Test pagination
  - [ ] Test sorting
- [ ] Integration tests for POST /api/v1/squads
  - [ ] Test valid squad creation
  - [ ] Test invalid formation
  - [ ] Test missing required fields
  - [ ] Test position generation for each formation
- [ ] Integration tests for PUT /api/v1/squads/:id/lineup
  - [ ] Test valid lineup update
  - [ ] Test player not in inventory
  - [ ] Test position mismatch (FW in GK slot)
  - [ ] Test duplicate assignment
  - [ ] Test ownership validation
- [ ] Integration tests for GET /api/v1/squads/:id
  - [ ] Test with filled lineup
  - [ ] Test with empty lineup
  - [ ] Test ownership validation
- [ ] Security tests
  - [ ] Test data isolation (user cannot access other user's data)
  - [ ] Test SQL injection prevention
  - [ ] Test authentication requirement
- [ ] Performance/load tests
  - [ ] Benchmark inventory endpoint with 1000 players
  - [ ] Benchmark squad creation
  - [ ] Benchmark lineup updates
  - [ ] Verify p95 response times <500ms
- [ ] Database migration tests
  - [ ] Test up migrations
  - [ ] Test down migrations (rollback)
  - [ ] Verify constraints are enforced

### Phase 4: Documentation & Verification
- [ ] Generate OpenAPI/Swagger documentation for all endpoints
- [ ] Document request/response examples
- [ ] Document error codes and messages
- [ ] Update TECHNICAL_ARCHITECTURE.md if new patterns introduced
- [ ] Create database schema diagram (ERD)
- [ ] Write developer guide for extending the API
- [ ] Document deployment steps for migrations

### Phase 5: Deployment Readiness
- [ ] All unit and integration tests passing
- [ ] Code review completed
- [ ] Performance benchmarks met (<500ms p95)
- [ ] Security review passed (no SQL injection, data isolation verified)
- [ ] Database migrations tested in staging environment
- [ ] API documentation published
- [ ] Logging and error tracking configured
- [ ] Database indexes verified in staging/production
- [ ] Connection pooling configured
- [ ] Rollback plan documented and tested

---

## Definition of Ready Confirmation

**This user story satisfies all DoR requirements from DEFINITION_OF_READY.md:**

- ✅ **Clear User Story:** Written in standard format with role (manager), goal (manage roster/squads), benefit (team building)
- ✅ **Acceptance Criteria:** 15 detailed, testable ACs covering database creation, API functionality, validation, security, and performance
- ✅ **Technical Alignment:** Follows TECHNICAL_ARCHITECTURE.md (TypeScript, Node.js, PostgreSQL, REST API with /v1/, Zod validation)
- ✅ **Dependencies Identified:** Database schema ready, Neon PostgreSQL connection, authentication middleware
- ✅ **Story Points Estimated:** 13 points (Complex - 2-3 days, at the threshold for splitting but manageable as foundation)
- ✅ **Priority Assigned:** MUST (MoSCoW) - P0 critical foundation story
- ✅ **Non-Functional Requirements:** Security (authentication, authorization, data isolation), performance (<500ms p95), observability (structured logging), UK English
- ✅ **Branding Compliance:** UK English terminology (squad, footballer, formation), professional API responses
- ✅ **Accessibility:** API structure supports accessible frontend (clear field names, UK English)
- ✅ **AI Agent Context:** Comprehensive technical details, validation rules, database schema, API specs, error handling, test scenarios

**Story Points:** 13  
**Priority:** MUST  
**Risk Level:** Medium - Database schema changes require careful migration planning and testing, but scope is well-defined with clear acceptance criteria

---

## Handover Notes for Pull Request

**When creating the implementation PR, include this summary:**

> **US-044: Backend Player Data Model & API**
> 
> This PR implements the foundational backend infrastructure for player roster and squad management in Legends Ascend. It establishes the core database schema and REST API endpoints that enable managers to view their player inventory, create squads, manage lineups, and organize formations.
> 
> **Key Deliverables:**
> - Database schema: `players`, `user_inventory`, `squads`, `squad_positions` tables with constraints and indexes
> - REST API endpoints:
>   - GET /api/v1/players/my-inventory (with filtering, sorting, pagination)
>   - POST /api/v1/squads (create squad with formation-based positions)
>   - PUT /api/v1/squads/:id/lineup (update player assignments with validation)
>   - GET /api/v1/squads/:id (retrieve squad details)
> - Validation: Player ownership, position compatibility, duplicate checks
> - Security: User data isolation, parameterized queries, authentication required
> - Performance: Indexed queries, <500ms p95 response times
> 
> **Testing:** All 15 acceptance criteria verified with 8+ comprehensive test scenarios covering happy paths, edge cases, validation, security, and performance.
> 
> **DoR Compliance:** ✅ All DEFINITION_OF_READY.md requirements met

---

## Open Questions & Clarifications

- [ ] **Question 1:** Should the `users` table already exist, or does it need to be created in this story?
  - **Assumption:** `users` table exists with `id` (UUID) and basic auth fields. If not, will create minimal users table.

- [ ] **Question 2:** What authentication mechanism should be used (JWT, session-based, OAuth)?
  - **Assumption:** JWT-based authentication with Bearer token in Authorization header. Middleware provides `req.user.id`.

- [ ] **Question 3:** Should there be a limit on the number of squads a user can create?
  - **Assumption:** No hard limit for MVP. Users can create multiple squads (e.g., one for league, one for cup). Future enhancement could add limit.

- [ ] **Question 4:** For the formation position generation, should the specific position slots (e.g., DF_1, DF_2) have semantic meaning (e.g., LB, CB, RB), or are they just numbered?
  - **Assumption:** Positions are numbered sequentially (GK_1, DF_1, DF_2, etc.) without left/right/center semantics. Future enhancement could add positional roles.

- [ ] **Question 5:** Should the API support deleting squads, or is that out of scope for MVP?
  - **Assumption:** Out of scope for this story. Add DELETE /api/v1/squads/:id endpoint in future story if needed.

- [ ] **Question 6:** Should there be a default/starter squad created automatically when a user registers?
  - **Assumption:** No automatic squad creation. User creates squads manually via API. Future onboarding flow could auto-create starter squad.

**Resolution Plan:** If any assumptions are incorrect, these can be addressed in follow-up stories or clarified before development begins.
