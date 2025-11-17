SECTION 1: SQUAD & TEAM MANAGEMENT SYSTEM
========================================

Squad Composition
- Maximum Squad Size: 25 players
- Active Roster: 18 players (11 starters + 7 bench)
- Roster Setup: Drag-and-drop interface to assign players to starting XI and bench
- Locked Positions: Position-based assignment (not free-form)

Player Positions (5 Core Positions)
1. Goalkeeper (GK): Defensive positions, specialist role
2. Defender (DF): Defensive line positions (CB, LB, RB)
3. Midfielder (MF): Midfield positions (CM, CAM, CDM)
4. Forward (FW): Offensive positions (ST, LW, RW)
5. Utility (UT): Flexible players usable in multiple positions

Formation System (5 Available Formations)
1. 4-3-3: 1 GK, 4 DF, 3 MF, 3 FW (Classic balanced formation)
2. 4-2-4: 1 GK, 4 DF, 2 MF, 4 FW (Attacking formation)
3. 5-3-2: 1 GK, 5 DF, 3 MF, 2 FW (Defensive formation)
4. 3-5-2: 1 GK, 3 DF, 5 MF, 2 FW (Midfield-focused formation)
5. 4-4-2: 1 GK, 4 DF, 4 MF, 2 FW (Classic two-striker formation)

Chemistry Link System
- Link Types: Position-adjacent players (same row or diagonal)
- Bonus Per Link: +2 OVR per active link
- Maximum Bonus: +8 OVR (4 links per player)
- Recalculation: Real-time as squad is modified
- Example: A midfielder with 3 active links receives +6 OVR bonus

========================================
SECTION 2: PLAYER ATTRIBUTES & OVERALL RATING SYSTEM
========================================

Core Player Stats (6 Attributes)
1. Pace (SPD): Movement speed, acceleration, sprint speed
2. Shooting (SHO): Accuracy, power, long shots
3. Passing (PAS): Short/medium/long pass accuracy
4. Dribbling (DRI): Ball control, agility, skill moves
5. Defense (DEF): Tackling, positioning, interceptions
6. Physical (PHY): Strength, stamina, heading

Overall Rating (OVR) Calculation
Formula: Weighted average based on player position
Base Range: 40-99 (min-max)
Position-Weighted Formula Applied to Each Position Type

Example OVR Calculation for Midfielder:
OVR = (Passing × 0.35) + (Dribbling × 0.30) + (Pace × 0.20) + (Defense × 0.15)

Rarity Distribution & OVR Ranges
- Common (1-Star): OVR 40-65
- Rare (2-Star): OVR 60-75
- Epic (3-Star): OVR 75-85
- Legendary (4-Star): OVR 85-94
- Mythic (5-Star): OVR 95-99

Player Tier Progression
- Tier 0 (Base): Player as pulled from gacha
- Tier 1-5: Upgradeable through fusion system
- Each tier adds +7 to +10 OVR
- Stats are recalculated at each tier
- Position-specific stat distributions maintain role identity

========================================
SECTION 3: GACHA & PLAYER ACQUISITION SYSTEM
========================================

Pull Rates (Standard Banner)
- Common (Rarity 1): 50% base rate
- Rare (Rarity 2): 30% base rate
- Epic (Rarity 3): 15% base rate
- Legendary (Rarity 4): 4% base rate
- Mythic (Rarity 5): 1% base rate

Pity System (Guaranteed Pull Mechanics)
- Guaranteed Rare+: Every 10 pulls
- Guaranteed Epic+: Every 50 pulls
- Guaranteed Legendary+: Every 100 pulls
- Soft Pity (Legendary): Pulls 75-90 receive 2.5× rate-up
- Hard Pity: Guaranteed Legendary at 100 pulls

Daily Free Pull
- Frequency: 1 pull per 24 hours
- Reset Time: 11:00 AM UTC+0
- Rarity: Standard pull rates apply
- Bonus: 1 free pull per day (no stamina cost)

Duplicate System
- Duplicate Cap: Maximum 50 copies of same player
- Excess Handling: After 50 copies, additional pulls yield rewards instead
- Rewards for Excess: COINS equivalent to pull cost

========================================
SECTION 4: LEGENDS FUSION SYSTEM
========================================

Fusion Tier Requirements

Base → Tier 1:
- Duplicates Needed: 2 copies
- Fusion XP Cost: 500
- Sacrifice Materials: None
- OVR Gain: +7
- New Skill: Unlock 1

Tier 1 → Tier 2:
- Duplicates Needed: 3 copies
- Fusion XP Cost: 1000
- Sacrifice Materials: 1 Common rarity player
- OVR Gain: +8
- New Skill: Unlock 1

Tier 2 → Tier 3:
- Duplicates Needed: 4 copies
- Fusion XP Cost: 1500
- Sacrifice Materials: 2 Rare rarity players
- OVR Gain: +8
- New Skill: Unlock 1

Tier 3 → Tier 4:
- Duplicates Needed: 5 copies
- Fusion XP Cost: 2000
- Sacrifice Materials: 3 Epic rarity players
- OVR Gain: +9
- New Skill: Unlock 1

Tier 4 → Tier 5:
- Duplicates Needed: 6 copies
- Fusion XP Cost: 2500
- Sacrifice Materials: 4 Legendary rarity players
- OVR Gain: +10
- New Skill: Unlock 1 (Ultimate/Signature skill)

Fusion XP Sources
- Match Wins: 1-5 XP per match
- Event Completion: 50-200 XP per event
- Daily Missions: 25-100 XP per mission
- Accumulation: No daily cap, accumulates indefinitely

Fusion Mechanics
- Cooldown: None (instant fusion available)
- Position-Specific Skills: Each tier unlocks skills unique to player position
- Skill Level: Each skill starts at Level 1, can be upgraded

========================================
SECTION 5: MATCH SIMULATION & ASYNC PVP SYSTEM
========================================

Match Scheduling
- Opponent Selection: Players schedule matches 24+ hours in advance
- Match Time: Specified time in future (minimum 24 hours)
- Timezone: All times in UTC+0 for consistency

Opponent Matching
- Matching Algorithm: Rank-based proximity
- Search Window: Similar ranked players (within 30 seconds of request)
- Matchmaking Pool: All active players in rank range
- Fairness: Based on current tier and rating

Match Simulation Formula
- Total Score = (Team OVR × 0.6) + (Formation Bonus × 0.2) + (RNG Factor × 0.2)
- Team OVR: Average of 11 starters
- Formation Bonus: Varies by formation matchup (0.9-1.1 multiplier)
- RNG Factor: Random range -15% to +15% (upset possibility)

Result Determination
- Winner: Higher total score
- MVP Award: Player with highest average stat performance
- Upsets: RNG range allows lower-rated teams to win
- Margin: Affects bonus rewards

Result Delivery
- Simulation Time: At scheduled match time
- Notification: Next calendar day
- Timing: Within 24 hours of match time
- Result Format: Win/Loss/Draw with detailed stats

Rewards System
- Base Reward: 100 COINS + 25 XP for participation
- MVP Bonus: +50 COINS for MVP team
- Tier Multiplier: ×0.5 Bronze, ×1.0 Silver/Gold, ×2.0 Platinum+
- Total: 150-300 COINS per match based on tier

========================================
SECTION 6: PROGRESSION & RANKING SYSTEM
========================================

Rank Tiers (7 Levels)
1. Bronze: 0-99 points, OVR 40-60 minimum
2. Silver: 100-249 points, OVR 60-70 minimum
3. Gold: 250-499 points, OVR 70-80 minimum
4. Platinum: 500-749 points, OVR 80-85 minimum
5. Diamond: 750-999 points, OVR 85-90 minimum
6. Master: 1000-1499 points, OVR 90-95 minimum
7. Grandmaster: 1500+ points, OVR 95+ minimum

Ranked Points System
- Win (Same Tier): +50 points
- Win (Higher Tier Opponent): +100 points
- Loss (Same Tier): -10 points
- Loss (Lower Tier Opponent): -50 points
- Formation Bonus: ±5 points based on matchup efficiency

Seasonal Reset Mechanics
- Season Duration: 60 calendar days
- Reset Frequency: Every 60 days
- Tier Demotion: All players drop one tier on reset (Bronze stays Bronze)
- Points Reset: All seasonal points reset to 0
- Cosmetic Rewards: Top 1000 players receive exclusive seasonal cosmetics
- Rank Downgrade Protection: None (automatic demotion)

Daily Ranked Limits
- Soft Limit: 50 ranked matches per day
- Hard Limit: None (can play unlimited after 50)
- Rewards: Full rewards throughout
- Timer Reset: 24-hour rolling window

========================================
SECTION 7: CURRENCY & ECONOMY SYSTEM
========================================

Two-Currency Model
- COINS: In-game currency earned free through play (primary)
- GEMS: Premium currency purchased with real money (secondary)

Booster Pack Pricing (GEMS)
- 1× Booster Bundle: $2.99 USD (contains 1 pull)
- 5× Booster Bundle: $12.99 USD (contains 5 pulls, ~$2.60 per pull)
- 10× Booster Bundle: $24.99 USD (contains 10 pulls, ~$2.50 per pull)
- Best Value: 10× bundle with bulk discount

Cosmetic Item Pricing (GEMS)
- Jersey: $2.99 each
- Badge: $1.99 each
- Stadium: $3.99 each
- Avatar: $1.99 each
- Emote: $0.99 each

Battle Pass System (Per Season)
- Free Pass: $0 (unlocks free track rewards)
  * 50 reward tiers
  * Rewards: 500 COINS, 1000 XP, 5 cosmetics
  
- Premium Pass: $4.99 USD (unlocks premium track rewards)
  * 50 reward tiers
  * Rewards: 1500 COINS, 3000 XP, 15 cosmetics, 300 GEMS
  
- VIP Pass: $9.99 USD (unlocks VIP track + 10 exclusive tiers)
  * 60 total reward tiers
  * Rewards: 3000 COINS, 5000 XP, 30 cosmetics, 1000 GEMS, 5 exclusive cosmetics

Pity Cost Cap
- Spending Cap: $24.99 USD guarantees 100 pulls (hard pity)
- Value: Best protection for F2P to whale transition
- Rate: $0.25 per pull at maximum value


LEGENDS ASCEND - GAME SYSTEMS SPECIFICATION

Version: 1.0
Status: AUTHORITATIVE REFERENCE
Last Updated: Current Session

========================================
SECTION 8: TIME SYSTEMS
========================================

Daily Reset
- UTC+0 Time: 11:00 AM
- Regional Adjustment: Games may offer localized reset times in Phase 2+
- Affected Systems:
  * Daily free gacha pull (resets at reset time)
  * Daily match rewards cap
  * Daily ranked match limit (soft cap at 50)
  * Daily missions and challenges

Weekly Reset
- Day: Every Monday
- Time: 11:00 AM UTC+0
- Affected Systems:
  * Weekly challenges/missions
  * Weekly leaderboards reset and recalculate
  * Guild tournament weeks
  * Weekly cosmetic rotation

Seasonal Reset
- Duration: 60 calendar days
- Schedule: Approximate seasons are 8-9 weeks with 1-2 week breaks
- Reset Mechanics:
  * All ranked players drop down one tier (Bronze stays Bronze)
  * Tier points reset to 0
  * Top 1000 players (by end-of-season rank) receive exclusive cosmetics
  * Seasonal rewards are finalized and distributed
  * Battle Pass resets (new pass unlocks)
  * Event calendar shifts to new theme

Match Resolution Timing
- Scheduled Matches: Played at specified time (24+ hours in future)
- Simulation Execution: At scheduled time, both players' teams are simulated
- Result Delivery: Next calendar day, within 24 hours of match time
- Timezone Handling: All match times in UTC+0 for consistency

========================================
SECTION 9: EVENT SYSTEM
========================================

Event Types

1. Limited-Time Events (14 days typical)
   - Duration: 2 weeks per event
   - Frequency: 2-3 running concurrently
   - Format: Special cosmetics, limited rewards, unique mechanics
   - Example: "Summer Festival" with beach-themed cosmetics

2. Mini-Game Events (7 days typical)
   - Scouting Challenges: Players complete specific match conditions
   - Rewards: COINS, XP, event tokens
   - Completion: 3-5 challenges per event

3. Seasonal Events
   - Aligned to season resets (60-day cycles)
   - Major theme changes
   - Exclusive seasonal cosmetics
   - Seasonal battle pass activation

Cosmetic Drop Mechanics

- Exclusive Cosmetics: Event cosmetics unavailable elsewhere
- Direct Purchase: Cosmetics sold at 50% discount during event
- Event Tokens: Earned through mini-games, exchangeable for cosmetics
- Rotation: After 14 days, event cosmetics moved to standard shop (full price)

Banner System (Gacha Rate-Ups)

- Standard Banner: All rates at base (no featured player)
- Featured Banner: 50% of Epic+ pulls go to featured player (Phase 2+)
- Duration: 2-week cycles, rotating
- Rate Details:
  * Featured player pull rate: 50% of Epic+ probability
  * Non-featured Epic/Legendary: Split remaining 50% equally

Event Scheduling Calendar

- Week 1-2: Event A running
- Week 3-4: Event B running + Event A cosmetics move to shop
- Week 5-6: Event C running + seasonal banner rotation
- Week 7-8: Mini-game event + cosmetic sales
- Week 9: Preparation for new season + seasonal event

========================================
SECTION 10: SOCIAL & GUILD SYSTEM
========================================

Guild System (Phase 2+)

Guild Creation
- Requirement: Minimum player OVR 70
- Capacity: 30 members per guild
- Creation Cost: 50,000 COINS
- Leader Privileges:
  * Invite/remove members
  * Set guild description
  * Access guild treasury
  * Organize guild tournaments

Guild Mechanics
- Guild Level: Increases with member participation (XP-based)
- Guild Treasury: Shared storage for COINS (earned from donations)
- Member Roles: Leader, Officer, Member (3 levels)

Guild Tournaments
- Format: 5v5 squad battles
- Scheduling: Organized by guild leader, weekly or bi-weekly
- Rewards: Guild treasury COINS, exclusive guild badges
- Leaderboard: Top guilds ranked globally

Friend System
- Add Friends: Direct by player ID or discovery
- Friend Matching: In ranked mode, friends appear in opponent matching pool
- Friend Challenges: Direct 1v1 matches (exhibition, no rank change)
- Friend List Capacity: Unlimited

Leaderboards

- Global Ranked: Top 1000 players by rank tier and points
- Guild Rankings: Top 100 guilds by tournament wins
- Friend Challenges: Weekly leaderboard of friend match results
- Seasonal Archives: Previous season rankings preserved

========================================
SECTION 11: DATA CONSTANTS & REFERENCE TABLES
========================================

Player Stat Ranges by Rarity

- Common (Rarity 1): OVR 40-65
- Rare (Rarity 2): OVR 60-75
- Epic (Rarity 3): OVR 75-85
- Legendary (Rarity 4): OVR 85-94
- Mythic (Rarity 5): OVR 95-99

Position-Specific Stat Weightings (OVR Calculation)
- Goalkeeper (GK): Defense (40%) + Physical (30%) + Passing (20%) + Dribbling (10%)
- Defender (DF): Defense (35%) + Physical (35%) + Passing (20%) + Pace (10%)
- Midfielder (MF): Passing (35%) + Dribbling (30%) + Pace (20%) + Defense (15%)
- Forward (FW): Shooting (40%) + Pace (30%) + Dribbling (20%) + Physical (10%)
- Utility (UT): Pace (20%) + Shooting (20%) + Passing (20%) + Dribbling (20%) + Defense (10%) + Physical (10%)

Fusion Tier Progression

- Tier 0 (Base): OVR as pulled
- Tier 1 -> 2: +7 OVR, +1 Skill
- Tier 2 -> 3: +8 OVR, +1 Skill
- Tier 3 -> 4: +9 OVR, +1 Skill
- Tier 4 -> 5: +10 OVR, +1 Skill

Cosmetic Item Pricing

- Jersey: $2.99 (1 per bundle)
- Badge: $1.99 (3 per bundle)
- Stadium: $3.99 (1 per bundle)
- Avatar: $1.99 (1 per bundle)
- Emote: $0.99 (2 per bundle)

Battle Pass Rewards Structure

Free Track (No Purchase):
- 50 reward tiers
- Rewards: COINS (500 total), XP (1000 total), cosmetic items (5)

Premium Track ($4.99/season):
- 50 reward tiers
- Rewards: COINS (1500 total), XP (3000 total), cosmetic items (15), GEMS (300)

VIP Track ($9.99/season):
- 50 reward tiers + 10 exclusive tiers
- Rewards: COINS (3000 total), XP (5000 total), cosmetic items (30), GEMS (1000), Exclusive cosmetics (5)

Achievements & Badges List

- Welcome to Legends: Complete first match (Badge: Novice)
- Squad Master: Assemble a full squad of 18 players (Badge: Squad Master)
- Tier Climber: Reach Gold rank (Badge: Ascendant)
- Perfect Season: Maintain Diamond rank for entire season (Badge: Eternal)
- Social Butterfly: Add 50 friends (Badge: Connector)
- Guild Founder: Create a guild (Badge: Guild Leader)
- Event Champion: Win featured event tournament (Badge: Champion)

Quick Reference Formulas

- OVR Calculation (Example - Midfielder): (Passing_stat × 0.35) + (Dribbling_stat × 0.30) + (Pace_stat × 0.20) + (Defense_stat × 0.15)
- Ranked Points Gain: Base 50 pts + (Tier Difference × 10) +/- (Formation Bonus × 5)
- Match Reward Calculation: Base_coins + MVP_bonus + (Tier_multiplier × 0.5 to 2.0)

========================================
TABLE OF CONTENTS & QUICK REFERENCE
========================================

1. Squad & Team Management System
2. Player Attributes & Overall Rating System
3. Gacha & Player Acquisition System
4. Legends Fusion System
5. Match Simulation & Async PVP System
6. Progression & Ranking System
7. Currency & Economy System
8. Time Systems
9. Event System
10. Social & Guild System
11. Data Constants & Reference Tables

========================================
IMPLEMENTATION NOTES
========================================

This document serves as the authoritative reference for all game mechanics and specifications. Every user story, feature request, and development task should reference the relevant sections when specific mechanics, numbers, or rules are required. The specifications defined here prevent ambiguity and ensure consistent implementation across all features.

For questions about implementation details not covered in user stories, developers should:
1. Reference the appropriate section in this document
2. Use the "Quick Reference Formulas" for calculations
3. Refer to "Data Constants & Reference Tables" for exact values
4. Contact product team if clarification is needed beyond these specifications

Version History:
- v1.0 (Current): Initial comprehensive system specifications document


