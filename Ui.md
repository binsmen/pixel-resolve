# PIXELRESOLVE — MASTER ANTIGRAVITY UI/UX IMPLEMENTATION PROMPT

## 0. ROLE

You are an expert frontend engineer, product designer, interaction designer, and UI animator.

Your task is to build/refactor the **PixelResolve** website.

PixelResolve is a goal-resolution platform built around one simple idea:

> **Create a resolution → turn it into a quest → make progress → clear it → earn XP → upgrade your profile.**

This is NOT a conventional productivity dashboard.

It should feel like a **premium pixel-art RPG interface fused with a futuristic terminal/HUD system**, while still feeling natural, usable, modern, and professionally designed.

The supplied HTML file is the **PRIMARY VISUAL REFERENCE AND SOURCE OF TRUTH**.

Do not reinterpret the design into a generic AI-generated SaaS aesthetic.

Do not replace the visual language with:

* generic gradients
* excessive rounded cards
* purple/blue AI gradients
* generic glassmorphism
* oversized marketing illustrations
* stock images
* generic dashboard templates
* excessive floating blobs
* excessive shadows
* unnecessarily complicated navigation

The final result must look like a carefully designed product called:

# PIXELRESOLVE

---

# 1. CORE PRODUCT IDEA

PixelResolve turns real-life resolutions into RPG-style quests.

The user's journey is:

**RESOLUTION**
↓
**QUEST**
↓
**PROGRESS**
↓
**COMPLETION**
↓
**XP**
↓
**LEVEL UP**
↓
**PROFILE UPGRADE**

Example:

Resolution:

> Read 12 books this year.

PixelResolve transforms it into:

QUEST

> Read 12 Books

Progress:

> 8 / 12 Books

Completion:

> 67%

Reward:

> +5 XP

Eventually:

> QUEST CLEARED

and the user earns XP and progresses toward the next profile level.

The entire website should communicate this concept visually.

---

# 2. MOST IMPORTANT RULE — PRESERVE THE REFERENCE DESIGN

The supplied HTML is not merely an inspiration.

Treat its visual system as the foundation.

Preserve the following characteristics:

* almost-black background
* monochrome silver/white primary UI
* restrained green accent
* pixel typography
* monospace body typography
* Matrix-style animated background
* subtle glow
* dark HUD cards
* glass hero container
* pixel/RPG terminology
* strong spacing
* crisp borders
* controlled shadows
* subtle animations
* terminal-inspired UI
* game-like progression
* minimal visual noise

The current reference uses:

Background:
`#0a0a0b`

Surface:
`#131315`

Raised surface:
`#19191c`

Border:
`#29292d`

Bright border:
`#3a3a40`

Primary text:
`#f4f4f2`

Body text:
`#aeaeac`

Dim text:
`#77777a`

Green accent:
`#22c55e`

Use this general palette.

Do NOT introduce a rainbow color system.

Green should be used primarily to communicate:

* active state
* success
* progression
* completion
* important interaction
* XP/reward

Silver/white should remain the dominant visual identity.

---

# 3. TYPOGRAPHY

The typography is extremely important.

Use:

### Pixel/display font

Prefer:

`Press Start 2P`

for:

* PIXELRESOLVE logo text
* hero heading
* eyebrow labels
* buttons
* quest labels
* level badges
* status labels
* step titles
* RPG/HUD terminology

### Body font

Use:

`JetBrains Mono`

or:

`IBM Plex Mono`

or another high-quality monospace fallback.

Body text should feel technical but readable.

Do NOT use:

* Inter as the primary identity
* Poppins
* Roboto
* generic startup typography
* huge bold sans-serif headings

The typography should immediately make the user understand:

**this is a productivity RPG.**

---

# 4. GLOBAL VISUAL LANGUAGE

The UI should feel like:

**"A futuristic command terminal for upgrading yourself."**

Think:

* RPG quest log
* retro computer terminal
* developer HUD
* pixel game interface
* futuristic monochrome console
* personal progression system

But do NOT make it look like a childish arcade game.

The design must remain:

* premium
* mature
* minimal
* cinematic
* focused
* technically polished

The pixel aesthetic should be subtle and intentional.

---

# 5. BACKGROUND SYSTEM

Create a full-page animated Matrix-style background.

Use a `<canvas>` layer positioned behind the UI.

The background should contain:

* Japanese katakana characters
* numbers
* vertical falling characters
* cyan/green-ish atmospheric glow
* very low opacity
* slow continuous movement

The original implementation uses a canvas with falling characters and a dark fade effect. Preserve that behavior and improve only where necessary for responsiveness/performance.

The canvas must:

* cover the entire page
* resize with the viewport
* account for document height
* remain behind all UI
* never interfere with clicks
* never make text difficult to read

Add a subtle dark vignette over it.

The center of the page should remain readable.

The Matrix effect is atmosphere, NOT the primary content.

Do not make it excessively bright.

---

# 6. HEADER / NAVIGATION

Create a sticky top navigation.

Structure:

LEFT:

[ PIXEL ICON ] PIXELRESOLVE
mini quests • real goals

RIGHT:

[ Log In ] [ Sign Up ]

The logo should be a small pixel-inspired emblem.

The supplied reference currently uses a sword-like symbol.

Preserve this general concept.

The logo container should be:

* approximately 44×44px
* square-ish
* slightly rounded
* silver/white gradient
* dark icon
* thin bright border
* subtle glow

Brand text:

`PIXELRESOLVE`

Use pixel typography.

Subtitle:

`mini quests • real goals`

Use small monospace typography.

Header:

* sticky
* translucent black background
* subtle backdrop blur
* thin bottom border
* generous horizontal padding
* no excessive height

The navigation must remain clean.

---

# 7. HERO SECTION

The hero is the visual centerpiece.

It should immediately communicate the product.

At the top:

`◆ A TINY RPG FOR YOUR REAL-LIFE GOALS`

This is an eyebrow label.

It should look like a small system/status indicator.

Use green for the accent.

Below it:

# TURN YOUR

# RESOLUTIONS INTO

# QUESTS.

The final word:

`QUESTS.`

must use the green accent.

The heading must remain pixelated.

The heading should feel large but not absurdly oversized.

---

# 8. HERO GLASS CONTAINER

The hero heading sits inside a premium translucent glass panel.

The panel should have:

* transparent white/black glass
* subtle border
* approximately 28px radius
* backdrop blur
* saturation
* brightness adjustment
* inner highlight
* subtle inset borders
* deep but soft shadow

The original visual treatment includes:

* `rgba(255,255,255,0.04)`
* thin white border
* approximately 28px radius
* `backdrop-filter: blur(...)`
* inset highlights
* deep shadow

Preserve this concept closely.

---

# 9. HERO SHINE ANIMATION

The glass hero panel must have a subtle diagonal light sweep.

The shine should:

* begin outside the left side
* travel across the glass
* disappear toward the right
* take approximately 6 seconds
* use a very subtle white translucent gradient
* loop continuously
* never distract from the heading

This animation is essential.

The reference uses a `shineSweep` keyframe animation. Preserve the same visual behavior.

Do not replace it with a generic hover animation.

---

# 10. HERO DESCRIPTION

Below the heading:

> Track your goals, build momentum, and level up as you make progress.
> No overwhelming spreadsheets — just simple, rewarding pixel gamification.

Use:

* readable monospace
* approximately 15px
* muted gray
* comfortable line-height
* centered layout
* constrained width

The copy should feel calm and confident.

---

# 11. PRIMARY CTA

Primary CTA:

`Start Your Quest →`

Secondary CTA:

`Log In`

Primary button:

* silver/white metallic gradient
* dark text
* thin bright border
* subtle glow
* pixel typography
* approximately 18px vertical padding
* clear hover glow
* tiny press-down animation

Secondary button:

* transparent
* dark background
* bright border
* white text
* subtle hover glow

Buttons should feel like controls from a premium RPG interface.

---

# 12. DEMO QUEST HUD

Immediately below the hero CTA, display a large quest demonstration card.

This card is one of the most important elements on the landing page.

It should resemble a terminal/HUD window.

Approximate width:

`620px`

Centered.

Dark surface.

Border:

`2px`

Radius:

approximately `14px`

Deep shadow.

The card should feel like a physical game terminal.

---

# 13. QUEST WINDOW TITLE BAR

At the top of the quest card:

three tiny circular dots on the left.

Centered/right:

`QUEST_LOG.EXE`

The title bar should look like a terminal window.

Use:

* slightly raised dark background
* thin bottom border
* small pixel font
* muted gray text

---

# 14. LEVEL BADGE

At the top-right of the quest card, make the badge slightly overlap the card.

Text:

`LVL 4 HERO`

The badge should:

* use silver metallic gradient
* dark text
* green border/accent
* glow
* small pixel typography
* slightly float above the card

This communicates the profile-upgrade mechanic.

---

# 15. QUEST CONTENT

Inside the card:

Icon:

`📚`

Quest:

`Read 12 Books`

Description:

`Expand the mind with sci-fi novels and tech books`

Progress:

`8 / 12 Books`

Percentage:

`67%`

Progress bar.

Footer:

`+5 XP on update`

Status:

`QUEST ACTIVE`

Preserve this exact information in the landing-page demo unless there is a strong product reason to change it.

---

# 16. PROGRESS BAR ANIMATION

The progress bar MUST animate when the page loads.

Initial state:

`0%`

Then animate toward:

`67%`

The number should simultaneously animate:

`0% → 67%`

Use easing similar to:

`1 - Math.pow(1 - progress, 3)`

Duration:

approximately:

`1400ms`

Delay before starting:

approximately:

`350ms`

The original implementation uses this animation strategy. Preserve it closely.

The progress bar should have:

* dark track
* bright silver fill
* subtle glow
* smooth transition

Once the animation reaches 67%:

* briefly pulse the glow
* reveal `+5 XP on update`

The XP text should fade in.

---

# 17. QUEST STATUS

The status pill should read:

`QUEST ACTIVE`

Use:

* pixel font
* green text
* green translucent background
* green border
* compact padding
* slightly rounded corners

The green indicates that the quest is currently active.

---

# 18. THREE-STEP PRODUCT EXPLANATION

Below the hero/demo section, create three cards.

They explain the complete PixelResolve loop.

### CARD 01

Icon:

`⚔`

Title:

`1. CREATE`

Description:

`Turn your personal goals and resolutions into trackable, bite-sized quests with targets and units.`

### CARD 02

Icon:

`🔥`

Title:

`2. PROGRESS`

Description:

`Update your numbers with single clicks whenever you take a step forward. Watch your progress bars fill up.`

### CARD 03

Icon:

`🏆`

Title:

`3. LEVEL UP`

Description:

`Earn XP for every step and enjoy pixel confetti and level promotions when your quests are completed.`

These cards must visually explain:

**Create → Progress → Level Up**

This is the central product loop.

The reference uses a three-column grid, dark cards, borders, and strong bottom shadows. Preserve that treatment.

---

# 19. CARD DESIGN

Cards should NOT look like generic SaaS cards.

Use:

* dark surface
* 2px border
* approximately 14px radius
* approximately 32px padding
* subtle black bottom shadow
* clean spacing
* strong hierarchy

The icon should be a compact square:

approximately:

`44 × 44px`

with:

* bright border
* silver gradient
* dark icon
* subtle glow

Each card should feel like an RPG instruction panel.

---

# 20. LANDING PAGE INFORMATION ARCHITECTURE

The landing page should follow this exact visual hierarchy:

HEADER

↓

EYEBROW

↓

MAIN HERO

`TURN YOUR RESOLUTIONS INTO QUESTS.`

↓

DESCRIPTION

↓

CTA

↓

INTERACTIVE QUEST DEMO

↓

THREE-STEP SYSTEM

`CREATE → PROGRESS → LEVEL UP`

↓

Continue naturally into the application experience.

Do not overwhelm the first screen with excessive sections.

The user should understand PixelResolve within approximately 5 seconds.

---

# 21. PRODUCT APPLICATION EXPERIENCE

After clicking:

`Start Your Quest`

the user should enter the actual PixelResolve application.

The app should retain the exact same design system.

Do NOT suddenly switch to a completely different UI.

The landing page and application must feel like the same product.

Application layout:

LEFT/SIDE:

Profile information

* avatar
* username
* current level
* XP
* progress toward next level
* completed quests
* active quests

MAIN:

Quest dashboard

* active resolutions
* progress
* deadlines
* XP rewards
* completion states

PRIMARY ACTION:

`+ NEW RESOLUTION`

---

# 22. CREATE RESOLUTION FLOW

When the user clicks:

`+ NEW RESOLUTION`

open a polished modal/panel.

Title:

`CREATE NEW RESOLUTION`

Fields:

### Resolution name

Example:

`Read 12 Books`

### Description

Example:

`Expand the mind with sci-fi novels and technology books.`

### Target

Example:

`12`

### Unit

Examples:

* books
* workouts
* projects
* hours
* problems
* days
* pages
* kilometers

### Deadline

Optional.

### XP Reward

Automatically calculated or configurable.

CTA:

`CREATE QUEST`

Secondary:

`CANCEL`

The modal must use the same dark/HUD/pixel aesthetic.

---

# 23. QUEST CARD SYSTEM

Every created resolution becomes a quest card.

Example:

---

QUEST
Read 12 Books

Expand the mind...

8 / 12 BOOKS

██████████████░░░░ 67%

+5 XP

## QUEST ACTIVE

Each card should support:

* increment progress
* decrement progress if appropriate
* edit
* pause
* complete
* delete
* view details

Keep controls minimal.

Avoid clutter.

---

# 24. PROGRESS INTERACTION

When the user makes progress:

Example:

8 → 9 books

the progress bar should animate smoothly.

XP should be awarded.

Display a small feedback animation:

`+5 XP`

The feedback should briefly appear and disappear.

Do not create giant popups for tiny actions.

The interface should reward the user without interrupting them.

---

# 25. QUEST COMPLETION

When progress reaches 100%:

Trigger a satisfying completion sequence.

Sequence:

1. Progress bar reaches 100%.
2. Bar briefly glows.
3. Quest card receives a subtle highlight.
4. Display:
   `QUEST CLEARED`
5. Show:
   `+XP`
6. Trigger subtle pixel confetti.
7. Update profile XP.
8. If enough XP is earned:
   `LEVEL UP!`

The animation should feel rewarding but restrained.

Do not use cheesy fireworks.

---

# 26. PROFILE LEVEL SYSTEM

The profile should have a visible RPG progression system.

Example:

`LVL 04`

XP:

`340 / 500 XP`

Next level:

`LVL 05`

Progress bar:

`68%`

Completed quests:

`18`

Active quests:

`5`

Resolutions cleared:

`13`

The profile should visually communicate:

**I am upgrading myself.**

---

# 27. PROFILE UPGRADE EXPERIENCE

When a user levels up:

Show a short cinematic UI state.

Example:

`LEVEL UP`

`LVL 04 → LVL 05`

`+1 PROFILE LEVEL`

`NEW TITLE UNLOCKED`

Possible titles:

* BEGINNER
* GRINDER
* BUILDER
* EXPLORER
* ACHIEVER
* MASTER
* LEGEND

Keep these subtle and game-like.

---

# 28. RESOLUTION HISTORY

Create a history section where users can see completed resolutions.

Example:

`QUEST HISTORY`

✓ Read 12 Books
✓ Complete Java Project
✓ Workout 50 Times
✓ Solve 100 Problems

Each completed quest can show:

* completion date
* XP earned
* final target
* duration

Use subdued styling so the active quests remain the focus.

---

# 29. EMPTY STATES

Never leave blank areas.

If the user has no quests:

Display:

`NO ACTIVE QUESTS`

Then:

`Your next upgrade starts with one resolution.`

Button:

`+ CREATE YOUR FIRST QUEST`

Make the empty state feel intentional rather than unfinished.

---

# 30. INTERACTION PHILOSOPHY

Animations should communicate state.

Use animation for:

* progress
* XP
* level up
* quest completion
* hover feedback
* page transitions
* glass shine
* Matrix background

Do NOT animate every element.

Avoid:

* constant floating cards
* excessive bouncing
* excessive scaling
* random particle effects
* unnecessary parallax
* overdone gradients

The interface should feel alive, not noisy.

---

# 31. MICROINTERACTIONS

Buttons:

Hover:

* slightly brighter
* glow increases

Press:

* move down approximately 1px

Progress:

* smooth easing

XP:

* fade/slide in

Quest completion:

* subtle glow pulse

Level up:

* brief highlight

Cards:

* very subtle border/glow response on hover

All transitions should be fast and intentional.

---

# 32. RESPONSIVE DESIGN

The website MUST be fully responsive.

Desktop:

* three-step cards in 3 columns
* spacious hero
* centered quest demo

Tablet:

* reduced spacing
* two-column or stacked layout as appropriate

Mobile:

* single-column cards
* stacked CTA buttons
* smaller hero heading
* smaller quest demo
* compact header
* simplified navigation

The original reference collapses the three-step grid to one column below approximately 860px. Preserve this responsive philosophy.

Never allow:

* horizontal overflow
* broken cards
* text clipping
* overflowing buttons
* unusable forms

---

# 33. ACCESSIBILITY

Use:

* semantic HTML
* accessible button labels
* keyboard navigation
* visible focus states
* sufficient text contrast
* reduced-motion support

For users with:

`prefers-reduced-motion: reduce`

reduce/disable:

* Matrix animation
* shine animation
* excessive progress animation
* confetti

The product must remain usable without animation.

---

# 34. PERFORMANCE

The Matrix canvas must not destroy performance.

Optimize:

* animation frequency
* canvas dimensions
* resize handling
* DOM updates
* unnecessary re-renders

Do not create thousands of DOM elements for Matrix rain.

Canvas is preferred.

The original reference uses canvas for this purpose. Preserve that architecture.

---

# 35. CODE ARCHITECTURE

Use clean, maintainable frontend architecture.

If the existing project already has a framework, preserve it.

Do not unnecessarily rewrite the entire application.

Separate:

* components
* styles
* data
* state
* animations
* utilities

The landing page should be reusable.

Quest cards should be reusable components.

Buttons should use reusable variants.

Progress bars should be reusable.

Profile components should be reusable.

---

# 36. DATA MODEL

A resolution/quest should conceptually contain:

```text
id
title
description
target
currentProgress
unit
deadline
xpReward
status
createdAt
completedAt
```

User profile:

```text
username
avatar
level
xp
xpToNextLevel
completedQuests
activeQuests
```

Keep the architecture ready for future backend integration.

Do not hardcode the entire application in one giant HTML file if the existing project architecture supports reusable components.

---

# 37. VISUAL CONSISTENCY RULE

Every screen must feel like it belongs to the landing page.

If the landing page uses:

* silver
* black
* green
* pixel font
* monospace
* terminal windows
* quest cards
* subtle glow

then the dashboard must use the same system.

Never create a dashboard that looks like:

"standard React admin panel."

PixelResolve should be recognizable even without the logo.

---

# 38. DO NOT MAKE IT LOOK AI-GENERATED

This is extremely important.

Avoid the visual patterns commonly produced by generic AI website generators:

NO:

* giant gradient blobs
* excessive purple
* neon rainbow
* generic glass cards everywhere
* floating 3D objects
* stock illustrations
* generic SaaS hero
* huge rounded rectangles
* excessive whitespace with no purpose
* random decorative icons
* excessive shadows
* meaningless gradients
* generic dashboard statistics
* unnecessary testimonial sections
* fake logos
* meaningless marketing copy

Instead:

Make it feel designed by a human product designer who understands:

**RPG systems + productivity + retro computing + modern UX.**

---

# 39. BRAND PERSONALITY

PixelResolve should feel:

* focused
* intelligent
* slightly mysterious
* rewarding
* technical
* ambitious
* game-like
* personal
* motivating

The emotional message is:

> Your goals are not chores.
> They are quests.
> Your progress is XP.
> Your consistency upgrades you.

---

# 40. LANDING PAGE COPY

Primary:

`TURN YOUR RESOLUTIONS INTO QUESTS.`

Supporting:

`Track your goals, build momentum, and level up as you make progress. No overwhelming spreadsheets — just simple, rewarding pixel gamification.`

Eyebrow:

`◆ A TINY RPG FOR YOUR REAL-LIFE GOALS`

Primary CTA:

`Start Your Quest →`

Secondary:

`Log In`

Product loop:

`CREATE`

`PROGRESS`

`LEVEL UP`

Quest example:

`Read 12 Books`

Description:

`Expand the mind with sci-fi novels and tech books`

Progress:

`8 / 12 Books`

Status:

`QUEST ACTIVE`

Reward:

`+5 XP on update`

---

# 41. ANIMATION REQUIREMENTS

The following animations are REQUIRED:

### Matrix rain

Continuous falling characters.

### Glass shine

6-second diagonal sweep.

### Hero appearance

Subtle initial fade/slide.

### Progress

0 → 67%.

### Percentage

0% → 67%.

### XP

Fade in after progress reaches target.

### Progress glow

Short pulse when progress lands.

### Button interaction

Subtle hover and press response.

### Quest completion

Glow → cleared → XP → confetti.

### Level up

Short progression animation.

Keep all animations smooth.

Prefer:

* CSS transitions
* CSS keyframes
* requestAnimationFrame where numeric animation is required

---

# 42. EXACT REFERENCE BEHAVIOR

The uploaded reference contains the following critical behavior:

* Matrix canvas background
* full-page height calculation
* animated Japanese characters
* dark vignette
* sticky translucent header
* pixel logo
* glass hero
* diagonal glass shine
* animated quest progress
* percentage counter
* XP fade-in
* progress glow pulse
* responsive three-card layout

These are not optional decorative ideas.

## They are part of the PixelResolve visual identity.

# 43. IMPORTANT IMPLEMENTATION PRINCIPLE

Do not simply reproduce the reference as a static landing page.

Use the reference to establish the DESIGN LANGUAGE.

Then expand it into a complete product.

The progression should be:

LANDING PAGE
→ CREATE QUEST
→ QUEST DASHBOARD
→ PROGRESS
→ COMPLETE
→ XP
→ LEVEL UP
→ PROFILE

The product should feel like one continuous experience.

---

# 44. FINAL VISUAL CHECK

Before considering the task complete, inspect the actual rendered UI.

Ask:

1. Does this immediately look like PixelResolve?
2. Does it feel like a productivity RPG?
3. Does the landing page resemble the supplied reference?
4. Is the Matrix background subtle enough?
5. Is the pixel typography consistent?
6. Is the silver/black/green palette preserved?
7. Does the hero glass panel look premium?
8. Does the shine animation work?
9. Does the progress animation work?
10. Does XP appear after progress?
11. Does the quest card look like a HUD?
12. Do the three steps communicate the product instantly?
13. Does the dashboard feel like the same product?
14. Does the UI avoid generic AI-generated SaaS aesthetics?
15. Does it work on mobile?
16. Are interactions smooth?
17. Are there any visual inconsistencies?
18. Are there any console errors?
19. Are buttons actually functional?
20. Does creating a resolution actually create a quest?

Fix every issue found during this review.

---

# 45. NON-NEGOTIABLE FINAL REQUIREMENT

The final website must NOT merely be:

"a website about goals with pixel styling."

It must communicate the core fantasy:

# "UPGRADE YOURSELF BY COMPLETING YOUR REAL-LIFE QUESTS."

PixelResolve is essentially:

**Duolingo-style progression + RPG quests + personal resolutions + XP + profile leveling**

wrapped inside the visual language defined by the supplied HTML reference.

The landing page should make the user think:

> "I want to start my next quest."

The application should make the user think:

> "I want to level up."

Build the interface around that feeling.

Use the supplied HTML as the visual source of truth and preserve its proportions, colors, typography, animation timing, component hierarchy, and interaction character wherever applicable.

Do not replace the design with your own generic interpretation.

Make it feel intentional, premium, human-designed, and uniquely PixelResolve.