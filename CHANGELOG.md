# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **US-044: Backend Player Data Model & API** - Foundational player roster management system
  - Database schemas for players, user_inventory, squads, and squad_positions with UUID primary keys
  - REST API endpoints:
    - `GET /api/v1/players/my-inventory` - Retrieve player inventory with filtering, sorting, and pagination
    - `POST /api/v1/squads` - Create squads with formation validation (4-3-3, 4-2-4, 5-3-2, 3-5-2, 4-4-2)
    - `GET /api/v1/squads/:squadId` - Retrieve squad details including lineup
    - `PUT /api/v1/squads/:squadId/lineup` - Update player positions with compatibility validation
  - Player position system (GK, DF, MF, FW, UT) with position compatibility rules
  - User-scoped data isolation for inventory and squad management
  - Zod schema validation for all API inputs
  - Authentication middleware stub for x-user-id header
  - Comprehensive test coverage (69+ tests)

### Security
- Fixed js-yaml prototype pollution vulnerability (moderate severity)
- Parameterized SQL queries to prevent injection attacks
- User isolation enforced at database query level
