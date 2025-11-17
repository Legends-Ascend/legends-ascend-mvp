# Legends Ascend - Unified Game Systems & Design Document

**Version:** 2.0 (Merged)  
**Last Updated:** November 17, 2025  
**Status:** MVP Phase

---

## TABLE OF CONTENTS

1. Executive Summary
2. Game Overview
3. Core Gameplay Features
4. Squad & Team Management System
5. Player Attributes & Overall Rating System
6. Player Acquisition System (Gacha)
7. Legends Fusion System
8. Match Simulation & PvP System
9. Progression & Ranking System
10. Currency & Economy System
11. Time Systems
12. Contract Management System
13. Transfer Market Dynamics
14. AI Integration
15. Technical Architecture
16. User Experience & Interface
17. Branding & Visual Identity
18. Roadmap & Success Metrics

---

## 1. EXECUTIVE SUMMARY

Legends Ascend is an AI-powered football manager game combining traditional sports management gameplay with cutting-edge AI technology. Players build and manage their dream football team, make strategic decisions, and compete in an immersive simulation environment.

### Core Vision

Create the next-generation football management experience empowering players to:
- Build and manage their dream football team
- Make strategic decisions that impact match outcomes
- Compete against intelligent AI opponents
- Experience personalized gameplay through AI-driven content generation

**GAME DESIGN FOCUS:** This is a simulation of TEAM OWNERSHIP, not in-game coaching. Players make strategic management decisions (squad building, transfers, contracts, formations) but do NOT make in-game tactical adjustments during matches.

---

## 2. GAME OVERVIEW

### Genre & Platform

**Genre:** Sports Management Simulation / Strategy Game

**Target Platforms:**
- Web (React/TypeScript frontend)
- Desktop compatible
- Mobile-responsive design

**Target Audience:**
- Football enthusiasts aged 13+
- Strategy game players
- Sports simulation fans
- Casual to hardcore gamers

### Game Loop

1. **Team Management Phase:** Scout players, arrange formations, manage contracts, execute transfers, develop players
2. **Pre-Match Preparation:** Select starting XI, choose formation, set tactics (no in-game changes allowed)
3. **Match Simulation Phase:** Watch AI-driven match simulation with player interactions
4. **Results & Progression:** Analyze results, earn rewards, progress through leagues
5. **Strategy Planning:** Analyze performance, plan squad improvements

---

## 3. CORE GAMEPLAY FEATURES

### 3.1 Team Management
- Squad Building: Purchase, scout, and develop players
- Formation Setup: Customize team formations (4-3-3, 3-5-2, 5-3-2, etc.)
- Contract Management: Negotiate and manage player contracts
- Player Development: Train players to improve stats and skills
- Transfer Management: Buy/sell players in the transfer market

### 3.2 Match Simulation
- Real-time Simulation: Watch AI-driven matches with dynamic events
- NO In-Game Tactical Changes: All tactics set before match starts
- Stats-Based Performance: Player performance based on attributes with variance
- Match Events: Goals, injuries, yellow/red cards, substitutions
- Replay System: Review key moments and match highlights

### 3.3 Progression Systems
- League Competition: Rise through multiple league divisions
- Tournament Play: Qualify for and participate in cup competitions
- Seasonal Progression: Multi-phase seasons with playoffs
- Ranking System: ELO-based ranking against other managers
- Achievement System: Unlock badges and milestones

### 3.4 Economic System
- Budget Management: Limited budget for transfers and operations
- Revenue Streams: Match winnings, sponsorships, ticket sales
- Transfer Market: Buy/sell players with dynamic pricing
- Wage Management: Player salary negotiations

---## 4. SQUAD & TEAM MANAGEMENT SYSTEM

### Squad Composition
- Maximum Squad Size: 25 players
- Active Roster: 18 players (11 starters + 7 bench)
- Roster Setup: Drag-and-drop interface to assign players to starting XI and bench
- Locked Positions: Position-based assignment (not free-form)

### Player Positions (5 Core Positions)
1. Goalkeeper (GK): Defensive positions, specialist role
2. Defender (DF): Defensive line positions (CB, LB, RB)
3. Midfielder (MF): Midfield positions (CM, CAM, CDM)
4. Forward (FW): Offensive positions (ST, LW, RW)
5. Utility (UT): Flexible players usable in multiple positions

### Formation System (5 Available Formations)
1. 4-3-3: 1 GK, 4 DF, 3 MF, 3 FW (Classic balanced formation)
2. 4-2-4: 1 GK, 4 DF, 2 MF, 4 FW (Attacking formation)
3. 5-3-2: 1 GK, 5 DF, 3 MF, 2 FW (Defensive formation)
4. 3-5-2: 1 GK, 3 DF, 5 MF, 2 FW (Midfield-focused formation)
5. 4-4-2: 1 GK, 4 DF, 4 MF, 2 FW (Classic two-striker formation)

### Chemistry Link System
- Link Types: Position-adjacent players (same row or diagonal)
- Bonus Per Link: +2 OVR per active link
- Maximum Bonus: +8 OVR (4 links per player)
- Recalculation: Real-time as squad is modified
- Example: A midfielder with 3 active links receives +6 OVR bonus

---

## 5. PLAYER ATTRIBUTES & OVERALL RATING SYSTEM

### Core Player Stats (6 Attributes)
1. Pace (SPD): Movement speed, acceleration, sprint speed
2. Shooting (SHO): Accuracy, power, long shots
3. Passing (PAS): Short/medium/long pass accuracy
4. Dribbling (DRI): Ball control, agility, skill moves
5. Defense (DEF): Tackling, positioning, interceptions
6. Physical (PHY): Strength, stamina, heading

### Overall Rating (OVR) Calculation
- Base Range: 40-99 (min-max)
- Formula: Weighted average based on player position
- Example for Midfielder: OVR = (Passing × 0.35) + (Dribbling × 0.30) + (Pace × 0.20) + (Defense × 0.15)

### Rarity Distribution & OVR Ranges
- Common (1-Star): OVR 40-65
- Rare (2-Star): OVR 60-75
- Epic (3-Star): OVR 75-85
- Legendary (4-Star): OVR 85-94
- Mythic (5-Star): OVR 95-99

### Player Tier Progression
- Tier 0 (Base): Player as pulled from gacha
- Tier 1-5: Upgradeable through fusion system
- Each tier adds +7 to +10 OVR
- Position-specific stat distributions maintain role identity

---## 6. PLAYER ACQUISITION SYSTEM (GACHA)

### Pull Rates (Standard Banner)
- Common (Rarity 1): 50% base rate
- Rare (Rarity 2): 30% base rate
- Epic (Rarity 3): 15% base rate
- Legendary (Rarity 4): 4% base rate
- Mythic (Rarity 5): 1% base rate

### Pity System (Guaranteed Pull Mechanics)
- Guaranteed Rare+: Every 10 pulls
- Guaranteed Epic+: Every 50 pulls
- Guaranteed Legendary+: Every 100 pulls
- Soft Pity (Legendary): Pulls 75-90 receive 2.5× rate-up
- Hard Pity: Guaranteed Legendary at 100 pulls

### Daily Free Pull
- Frequency: 1 pull per 24 hours
- Reset Time: 11:00 AM UTC+0
- Rarity: Standard pull rates apply

### Duplicate System
- Duplicate Cap: Maximum 50 copies of same player
- Excess Handling: After 50 copies, additional pulls yield rewards
- Rewards for Excess: COINS equivalent to pull cost

---

## 7. LEGENDS FUSION SYSTEM

The Legends Fusion System allows players to combine duplicate player cards to create stronger versions with higher overall ratings and improved stats.

### Fusion Mechanics
- Combine multiple copies of same player card
- Result: Upgraded player at higher tier with increased OVR
- Tier progression: Tier 0 (base) → Tier 1-5 (fused)
- Each tier adds 7-10 OVR points
- Stats scale proportionally at each tier

### Fusion Requirements
- Minimum copies: Varies by rarity (1-star requires fewer copies than 5-star)
- Currency cost: COINS required per fusion
- Time cost: Fusion takes X hours to complete
- Result: Single higher-tier player card

---

## 8. MATCH SIMULATION & PVP SYSTEM

### Match Structure
- 90-minute simulation with dynamic events
- Real-time rendering of key moments
- AI opponent adapts to player tactics
- Dynamic difficulty scaling

### Match Events
- Goals (positions, timing, player involvement)
- Injuries and yellow/red cards
- Substitutions based on game state
- Weather effects on performance
- Tactical shifts by both teams

### Player Performance in Matches
- Stats-based calculation with variance
- Position and formation impact performance
- Chemistry bonuses affect individual and team performance
- Fatigue management affects available stamina
- Form status (hot/cold) affects output

### Match Results
- Victory/Draw/Loss determination
- Player ratings calculated for each participant
- Goal scorers and assist providers tracked
- Performance bonuses for standout players

---

## 9. PROGRESSION & RANKING SYSTEM

### League Divisions
- Multiple tier structure from amateur to professional
- Promotion/Relegation based on seasonal performance
- Points system: 3 for win, 1 for draw, 0 for loss

### Ranking System
- ELO-based ranking against other player managers
- Base rating: 1200 for new players
- Rating adjustments per match based on opponent strength
- Leaderboard rankings updated in real-time
- Seasonal resets with rank protection for top players

### Tournament System
- Knockout cup competitions
- Qualification requirements based on league standing
- Seasonal tournaments with special rewards
- Limited-time events with exclusive prizes

### Achievements
- Milestone-based badges
- Performance-based achievements (win streaks, etc.)
- Collection achievements (complete squad types)
- Seasonal exclusive achievements

---## 10. CURRENCY & ECONOMY SYSTEM

### Currency Types

**COINS:**
- Primary in-game currency earned from matches
- Used for: Player training, fusions, contract renewals
- Earning sources: Match victories, daily login bonuses, achievements
- No real-money purchase

**PREMIUM CURRENCY:**
- Secondary currency purchased with real money
- Used for: Gacha pulls, cosmetics, battle pass
- Earning sources: Special events, achievements (limited)
- One-way conversion: Real money → Premium currency

### Match Rewards
- Victory: 100-500 COINS (based on opponent strength)
- Draw: 50-300 COINS
- Loss: 10-50 COINS (participation reward)
- Bonus objectives: Extra COINS for performance metrics

### Revenue Streams
- Sponsorship earnings: Fixed weekly COINS
- Ticket sales: Match-based revenue (varies by stadium level)
- Championship prizes: Tournament winnings
- Special events: Time-limited revenue opportunities

---

## 11. TIME SYSTEMS

### Match Scheduling
- Regular matches: Fixed schedule per week
- Cup matches: Triggered by tournament qualification
- Friendly matches: Optional player-initiated
- Simulation time: 1-2 minutes per 90-minute match

### Seasonal System
- Season duration: 30-60 days per season
- Season phases: Group stage, playoffs, finals
- Seasonal rewards: Based on final ranking
- Seasonal reset: ELO protection for top 10%

### Daily/Weekly Activities
- Daily tasks: Login bonus, free gacha pull, daily challenge
- Weekly tasks: Win targets, tournament participation
- Monthly events: Limited-time competitions
- Annual calendar: Seasonal tournaments and events

---

## 12. CONTRACT MANAGEMENT SYSTEM

Players must actively manage player contracts to maintain squad strength and control costs.

### Contract Basics
- Contract Duration: 1-5 seasons per contract
- Wage Cost: Weekly salary deducted from team budget
- Contract Status: Active, Expiring (last 3 matches), Expired
- Renewal Window: 4 weeks before contract end

### Contract Types

**Standard Contract:**
- Fixed wage throughout contract duration
- Automatic renewal option (if player agrees)
- Includes: Base salary, performance bonuses, loyalty bonus
- Release clause: Buy-out value if sold

**High-Performance Contract:**
- Higher base wage for elite players
- Performance-based bonuses (goals, assists, clean sheets)
- Higher signing bonus upfront
- Potential team-stacking incentive

### Wage Management
- Total budget: Determined by team tier and sponsorships
- Weekly deductions: Automatic from team account
- Budget alerts: Notifications when approaching cap
- Wage cap compliance: League restrictions on team payroll

### Contract Negotiations
- Player satisfaction: Affects performance and retention
- Contract demands: Players request wage increases
- Negotiation outcomes: Accept, Counter, Reject
- Dissatisfaction penalties: Reduced performance, increased injury risk

### Contract Expiration
- Expiring player notification: 4 weeks warning
- Renewal options: Auto-renew, negotiate new terms, release
- Free agency: Expired players enter transfer market
- Contract buyout: Pay remaining wages to end early

### Squad Morale Impact
- Fair wages maintain morale
- Wage inequality affects team chemistry
- Star players demand premium compensation
- Low wages increase injury and disciplinary risk

---

## 13. TRANSFER MARKET DYNAMICS

The transfer market is the core mechanism for squad building and long-term team development.

### Player Valuation
- Base Value: Determined by OVR rating
- Market Multipliers: Supply/demand affects pricing
- Player Age: Younger = higher value
- Form Status: Hot/cold status affects temporary value
- Injury Status: Injured players valued lower

**Valuation Formula:**
```
Market Price = Base Value × (1 + Demand Factor) × (1 - Supply Factor) × Age Factor × Form Factor
```

### Transfer Windows
- Transfer Seasons: Winter (mid-season) and Summer (off-season)
- Listing Period: 7-14 days to receive offers
- Negotiation Period: Accepts best offer or negotiates
- Completion: Funds transfer, player moves to new team

### Buying Players
- Browse Market: View available players
- Make Offer: Submit bid below asking price
- Negotiate: Back-and-forth on wage and fee
- Purchase: If agreed, immediate squad addition
- Player Integration: Needs 1-2 matches to reach full form

### Selling Players
- List Player: Set asking price or automatic listing
- Receive Offers: Multiple bids possible
- Negotiate: Accept, counter, or reject offers
- Completion: Funds added to team account
- Replacement Needs: Sold player leaves squad immediately

### Market Dynamics
- Supply-Demand: High-demand players cost more
- League Status: Players in higher leagues cost more
- Injury Effects: Injured players listed at 30-50% discount
- Young Talents: Higher valuation for promising youth
- Fan Favorites: Popular players maintain premium pricing

### Trading Restrictions
- Minimum team age: Squad must average 23+ OVR
- Maximum sales: Can't sell more than 5 players per season
- Squad continuity: Key positions must maintain coverage
- Fair market rules: Prevent artificial price manipulation

### Market Trends
- Seasonal trends: Certain positions more valuable at different times
- Meta shifts: Popular formations drive positional demand
- Injury waves: Mass injuries create buying opportunities
- Form cycles: Player form affects market value temporarily

---## 14. AI INTEGRATION

### AI-Powered Features

**Opponent AI:**
- Intelligent opponent managers with adaptive strategies
- AI opponents learn player patterns and counter-strategies
- Dynamic difficulty scaling based on player performance
- Personality-driven AI with distinct playstyles

**Content Generation:**
- AI-generated match commentary and analysis
- Post-match tactical breakdowns and insights
- Personalized challenge recommendations
- Dynamic event generation for seasonal content

**Player Behavior:**
- Realistic AI-driven player decision-making in matches
- Stats-based performance predictions
- Chemistry system reflects real team dynamics
- Injury probability and recovery modeling

**Adaptive Gameplay:**
- AI analyzes player playstyle and tactics
- Difficulty adjusts based on win/loss ratio
- Opponent selection matches player skill level
- Progressive difficulty for new players

### Implementation
- Machine Learning: Performance prediction and analysis
- Natural Language Generation: Commentary and descriptions
- Behavioral Trees: Player decision-making systems
- Agent-Based Modeling: Opponent AI autonomy

---

## 15. TECHNICAL ARCHITECTURE

### Frontend Stack
- Framework: React with TypeScript
- State Management: Redux or Context API
- UI Components: Custom components aligned with branding
- Styling: CSS Modules / Styled Components
- Build Tool: Vite or Webpack

### Backend Stack
- Runtime: Node.js
- Framework: Express or similar
- Database: PostgreSQL for relational data
- Cache: Redis for performance optimization
- APIs: RESTful or GraphQL

### Simulation Engine
- Match Simulation: Custom engine or Godot-based
- Physics: Simplified football simulation physics
- Event Generation: Probabilistic event system
- Performance: Optimized for 1-2 minute simulations

### AI & ML
- TensorFlow.js for browser-side ML (optional)
- Python-based agent framework for server-side AI
- Integration with external AI services if needed
- Model training pipeline for difficulty scaling

---

## 16. USER EXPERIENCE & INTERFACE

### Main Menu
- New Game / Continue Game
- Settings (Audio, Graphics, Controls)
- Leaderboards
- Tutorial
- Help & Support

### Game Screens

**Dashboard:**
- Team status overview
- Upcoming matches
- Financial summary
- Quick actions

**Squad Screen:**
- Team roster display
- Player stats and management
- Formation visualization
- Chemistry display

**Tactics Screen:**
- Formation selection
- Tactical setup
- Pre-match preparation
- Strategy notes

**Match Screen:**
- Live match simulation
- Key moments display
- Real-time statistics
- Match timeline

**Transfer Market:**
- Player browsing
- Offer system
- Contract management
- Transaction history

**League Table:**
- Current standings
- Match results
- Historical records
- Playoff brackets

### Design Principles
- Intuitive Navigation: Clear menu structure
- Information Hierarchy: Prioritize important data
- Responsive Design: Adapt to screen sizes
- Accessibility: WCAG 2.1 AA compliance
- Performance: Fast load times, smooth interactions

---

## 17. BRANDING & VISUAL IDENTITY

### Color Palette
- Primary: Deep Blue (#1E3A8A)
- Accent: Gold (#F59E0B)
- Dark: Navy (#0F172A)
- Light: Soft Gray (#F1F5F9)
- Success: Green (#10B981)
- Warning: Orange (#F97316)
- Danger: Red (#EF4444)

### Typography
- Headers: Modern, clean sans-serif (Inter, Outfit)
- Body: Readable sans-serif for accessibility (Roboto, Open Sans)
- Mono: For stats and numbers (JetBrains Mono, Inconsolata)

### Visual Style
- Modern & Professional: Clean, contemporary aesthetic
- Immersive: Football-themed visual elements
- Accessible: High contrast, clear iconography
- Dynamic: Smooth animations and transitions

### Branding Elements
- Logo: Legends Ascend wordmark
- Iconography: Football-themed custom icons
- Imagery: Stadium and player photography
- Effects: Subtle animations enhance UX

---

## 18. ROADMAP & SUCCESS METRICS

### Phase 1: MVP (Current)
- Basic team management
- Simple match simulation
- Single-player league
- Core UI implementation
- Gacha and fusion systems
- Basic contract management
- Transfer market MVP

### Phase 2: Early Access
- Enhanced AI opponents
- Multiplayer league support
- Advanced tactics system
- Player development depth
- Social features (guilds/clans)
- Seasonal content system

### Phase 3: Full Release
- Tournament systems
- Trading and market depth
- Mobile app launch
- Cross-platform play
- Advanced AI commentary
- Esports integration

### Phase 4: Post-Launch
- Seasonal content updates
- New competitions
- Community features
- Cosmetics and customization
- Analytics and performance tools
- Advanced strategic features

### Success Metrics
- Player Retention: 30-day retention > 40%
- Daily Active Users (DAU): Growth trajectory
- Session Length: Average 30+ minutes
- Feature Engagement: >70% using tactical features
- AI Satisfaction: >4/5 stars for AI opponents
- Performance: Page load < 2s, matches smooth (60fps)
- Economic Health: Positive DAU/MAU ratio
- Market Engagement: >60% use transfer market

---

## IMPLEMENTATION NOTES

This document serves as the authoritative reference for all game mechanics and specifications. Every user story, feature request, and development task should reference the relevant sections when specific mechanics, numbers, or rules are required.

**Document Version History:**
- v1.0: Initial Game Systems Specification
- v2.0: Merged GDD + Game Systems Spec + Contract Management + Transfer Market Dynamics
- **Status:** Complete unified specification ready for development

**Last Updated:** November 17, 2025  
**Document Owner:** Legends Ascend Development Team  
**Next Review:** December 17, 2025
