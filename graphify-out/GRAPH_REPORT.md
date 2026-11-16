# Graph Report - shion  (2026-11-13)

## Corpus Check
- 62 files · ~133,568 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 4, (none) 3, .example 1)

## Summary
- 248 nodes · 511 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9

## God Nodes (most connected - your core abstractions)
1. `errorText()` - 24 edges
2. `todayISO()` - 17 edges
3. `compilerOptions` - 15 edges
4. `react` - 13 edges
5. `UserError` - 11 edges
6. `formatDate()` - 10 edges
7. `api` - 10 edges
8. `useLive()` - 10 edges
9. `useLang()` - 9 edges
10. `Api` - 9 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --calls--> `errorText()`  [EXTRACTED]
  apps/web/src/pages/Invitation.tsx → apps/web/src/lib/api.ts
- `Contact()` --calls--> `useLang()`  [EXTRACTED]
  apps/web/src/pages/Home.tsx → apps/web/src/i18n/lang.tsx
- `Dusk()` --calls--> `useLang()`  [EXTRACTED]
  apps/web/src/pages/Home.tsx → apps/web/src/i18n/lang.tsx
- `Invitation()` --calls--> `useLang()`  [EXTRACTED]
  apps/web/src/pages/Invitation.tsx → apps/web/src/i18n/lang.tsx
- `Invitation()` --calls--> `formatDate()`  [EXTRACTED]
  apps/web/src/pages/Invitation.tsx → apps/web/src/i18n/lang.tsx

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (35): Db, DEMO_GUEST_TOKEN, hoursAgo(), listeners, load(), nextSaturdayAfter(), requireAdmin(), resetDemo() (+27 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (32): formatDate(), api, key, url, demoApi, Api, ReservationStatus, RsvpStatus (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (23): en, homeCopy, id, box(), live(), useHomeMotion(), initial(), LangContext (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (31): dependencies, jsqr, qrcode, react, react-dom, react-router-dom, @supabase/supabase-js, devDependencies (+23 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (22): brand, coupleStory, en, generic, id, inviteCopy, stories, DEMO_ADMIN (+14 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (16): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.23
Nodes (12): errorText(), ParsedGuests, parseGuestCsv(), splitLine(), NewGuest, Login(), submit(), GuestTools() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.21
Nodes (9): CheckInResult, CheckinPage(), Queued, readQueue(), Scanner(), Shown, tokenFromQr(), writeQueue() (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (3): config, esc(), middleware()

## Knowledge Gaps
- **76 isolated node(s):** `config`, `name`, `private`, `version`, `type` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 119 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 1` to `Community 2`, `Community 3`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `errorText()` connect `Community 6` to `Community 1`, `Community 2`, `Community 4`, `Community 7`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **What connects `config`, `name`, `private` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0677555958862674 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08282828282828283 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._