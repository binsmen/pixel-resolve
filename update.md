PIXELRESOLVE — NEXT DEVELOPMENT PROMPT

You are working on the existing PixelResolve project.

IMPORTANT:

This is an existing working application.

Do NOT rewrite the project from scratch.

Do NOT remove or break any existing functionality.

Preserve the current visual identity: clean, minimal, pixel-art / gamified aesthetic.

The current application should remain deployable and runnable.

For this phase, DO NOT implement production email verification, production infrastructure, production admin security, or a production database.

Use mock/local data and clean interfaces so these systems can be replaced with real infrastructure later.

Keep the code modular so the final production database/auth/admin system can be added without redesigning the UI.

================================================

CURRENT USER FLOW
================================================

The public website starts with the existing PixelResolve landing page.

Landing page:

PixelResolve branding

Existing introduction/content

Log In

Sign Up

Keep the existing design and functionality unless an improvement is required for the new flow.

SIGN UP:

User creates an account.

Validate:

Name is required.

Email is required.

Email must have a valid format.

If the product currently accepts Gmail only, validate Gmail addresses correctly.

Reject obviously invalid/fake placeholder emails such as "anything@example.com".

Do NOT pretend that frontend validation can prove that a real Gmail inbox exists.

For this phase, implement a clear mock "email validation/verification status" architecture so real email verification can be connected later.

Username is required.

Username must be unique.

Username rules should be clear and user-friendly.

Show a useful message if the username is already taken.

After successful signup, redirect the user to PROFILE SETUP.

PROFILE SETUP:

New users should be required to complete their basic profile before entering the normal application experience.

Do not make this frustrating or overly long.

Clearly show that this is the initial profile setup.

Allow the user to save and continue.

LOGIN:

Existing users log in normally.

After successful login, redirect them to the MAIN DASHBOARD / MAIN PAGE.

After login, the user should see a simple main dashboard.

The dashboard must contain exactly THREE primary cards:

PROFILE

RESOLUTIONS

CONTACT US

Do NOT add a leaderboard.

The dashboard should feel like the user's personal PixelResolve home/base.

Each card should:

Have a clear title.

Have a short explanation.

Have an obvious action.

Be visually consistent with the PixelResolve pixel/gamified design.

PROFILE CARD:

Clicking it opens the user's profile.

RESOLUTION CARD:

Clicking it opens the resolution system.

CONTACT US CARD:

Clicking it opens the Contact Us / Feedback page.

Create a professional but still PixelResolve-styled profile page.

The profile should contain:

A. BASIC INFORMATION

Name

Unique username

Profile/avatar area

Optional short bio/about section

B. LEARNING / EDUCATION

Where the user studied

Education/institution information

C. SKILLS

User can add skills.

Skills should be displayed cleanly as tags/chips.

User should be able to add and remove skills.

D. PIXELRESOLVE PROGRESS
Show the user's progress inside PixelResolve:

Current XP

Current level

XP required for the next level

Progress bar

Number of resolutions

Completed resolutions

Active resolutions

Relevant achievements

E. ACHIEVEMENTS
Separate achievements conceptually into:

PixelResolve achievements

Achievements earned through using the website.

Examples:

First Resolution

First Completed Resolution

Consistent Progress

Level Up

Resolution Streak

Real-life achievements

Achievements the user wants to record from their real life.

Examples:

Completed a course

Built a project

Read a book

Won a competition

Learned a skill

These should be user-editable.

Do not automatically claim achievements the user has not earned.

F. RESOLUTION SUMMARY
The profile should show a compact summary of the user's resolution activity.

G. EDIT PROFILE
Users should be able to edit their:

Name

Username (subject to uniqueness check)

Bio

Education

Skills

Real-life achievements

Profile information

Do not expose sensitive account/security information unnecessarily.

Username must be unique.

For this development phase:

Use the existing/mock/local data architecture.

Make the uniqueness check behave like a real backend/database check.

Do not allow two users to have the same username.

Check uniqueness during signup.

Check uniqueness when changing a username.

Show clear error messages.

Normalize usernames consistently for comparison.
Example:
"Neal123" and "neal123" should be treated according to one clearly defined case-sensitivity rule.

Define and document the username rules.

IMPORTANT:
Keep the username service/database interface modular so it can later be connected to the production database without changing the UI.

The product should not silently accept obviously fake email addresses.

For this phase:

Validate email format.

If Gmail is required, only accept valid Gmail-style addresses.

Reject obvious placeholder domains such as example.com.

Show a clear validation error.

IMPORTANT TECHNICAL LIMITATION:
Do not claim that the app can reliably determine whether a Gmail mailbox actually exists without verification.

Instead:

Build the UI and data model around an emailVerificationStatus.

Use mock verification for now.

Keep the implementation ready for real email verification later.

Later production phase can add:

Verification email

Verification token

Expiration

Verified/unverified account state

Do not implement that production infrastructure now.

Add a proper Light / Dark mode toggle.

Requirements:

Visible and easy to find.

Persist the user's choice.

Apply the theme consistently across the entire application.

No unreadable text or broken contrast.

Buttons, cards, forms, inputs, navigation, progress bars and modal elements must all support both themes.

Respect the existing PixelResolve visual identity.

Do not introduce an unrelated visual design.

Use a clean theme architecture so additional themes could be added later.

The current resolution creation experience is confusing.

Redesign the resolution flow to be extremely understandable for a first-time user.

The user should immediately understand:

What a resolution is.

What they need to enter.

What their target means.

How progress is calculated.

How XP works.

What happens when they update progress.

Use simple language.

Suggested creation flow:

STEP 1 — WHAT DO YOU WANT TO ACHIEVE?
Example:
"Read 12 books"

STEP 2 — WHY?
Optional:
"Expand my knowledge"

STEP 3 — TARGET
Example:
12 books

STEP 4 — CURRENT PROGRESS
Example:
0 / 12

STEP 5 — CATEGORY
Examples:

Learning

Health

Fitness

Career

Personal

Other

STEP 6 — DEADLINE
Optional.

Then show a clear preview before saving.

After creation:

Show progress as X / target.

Show percentage.

Show XP earned.

Show status.

Make the update-progress action obvious.

Explain what happens when progress is updated.

IMPORTANT:
Do not overload the user with fields.

The goal is:
"Anyone should be able to create their first resolution without needing instructions."

Include:

Empty states

Helpful examples

Validation

Success feedback

Clear edit/delete actions

Mobile-friendly UI

Keep the existing resolution functionality intact where possible.

Create a dedicated Contact Us page.

It should allow users to submit real product feedback later.

Include:

Feedback type

Bug

Feature request

Improvement

General feedback

Other

Subject

Message

Optional rating

Submit button

After submission:

Show a clear success message.

Store the feedback in mock/local data for now.

Give every feedback item:

ID

User ID

Username

Date/time

Type

Subject

Message

Status

Priority (optional)

Possible statuses:

New

Reviewing

In Progress

Resolved

Do not send real emails yet.

Create the UI architecture for a private VIP/Admin area.

IMPORTANT:
This is NOT production admin security yet.

For this phase:

Use a mock admin/VIP role.

Do not expose admin functionality to normal users.

Keep the authorization logic modular so it can later be replaced with real server-side role-based authentication.

VIP/Admin dashboard should allow the owner/team to view:

Total feedback

New feedback

Feedback by category

Recent feedback

Individual feedback details

Status

Priority

User who submitted it

Date submitted

Admin actions:

Mark as Reviewing

Mark as In Progress

Mark as Resolved

Change priority

Add an internal note if useful

Do NOT build dangerous production admin capabilities at this stage.

Do NOT rely on frontend-only permissions in the final architecture.
Clearly mark the current role system as MOCK and replaceable.

Do NOT create:

Global leaderboard

User ranking

Competitive ranking

Public XP comparison

PixelResolve should focus on personal progress and personal growth.

XP and levels are for the individual user's journey.

This is extremely important.

For this phase, use mock/local persistence where appropriate.

However, structure the code as if the application will eventually use a production database.

Create clean service/repository interfaces for:

users

profiles

usernames

resolutions

achievements

XP/levels

feedback

admin/VIP roles

The UI should communicate through these services rather than directly depending on hardcoded mock data.

The goal is that later we can replace:

MockUserService
→ ProductionUserService

MockResolutionService
→ ProductionResolutionService

MockFeedbackService
→ ProductionFeedbackService

without rebuilding the entire frontend.

Do not introduce a production database now.

Prepare the architecture for these future systems, but DO NOT fully implement them now:

A. Production database

Users

Profiles

Usernames

Resolutions

Progress

Achievements

XP

Feedback

Roles

B. Real email verification

Verification email

Verification token

Expiration

Verified account status

C. Production authentication/security

Secure sessions/JWT handling

Password security

Rate limiting

Server-side authorization

D. Production admin/VIP system

Real roles

Server-side authorization

Admin-only APIs

Audit logging

E. Production feedback notifications
Potential future options:

Admin dashboard

Email notification

Slack/Discord notification

Other team notification system

Do not add unnecessary infrastructure now.

Use a simple navigation structure.

Recommended authenticated navigation:

Dashboard
Profile
Resolutions
Contact Us

Optional:
Settings / Theme toggle

Unauthenticated:
Landing
Log In
Sign Up

Do not make navigation complicated.

Keep the existing PixelResolve identity:

Pixel-art inspired

Clean

Minimal

Fun

Gamified

Modern

Easy to understand

But make Profile and Feedback feel professional.

Avoid:

Excessive animations

Excessive colors

Clutter

Giant forms

Confusing terminology

Unnecessary dashboards

Leaderboards

Make the experience feel like:
"Duolingo-style motivation + personal goal tracking + pixel RPG identity"

but do not copy another product's design.

The entire experience must work on:

Desktop

Tablet

Mobile

Pay special attention to:

Profile cards

Resolution creation

Progress controls

Contact forms

Dashboard cards

Navigation

Dark/light mode

Every important form should have:

Required field validation

Clear error messages

Loading state

Success state

Disabled submit state when appropriate

Do not show generic:
"Something went wrong"

when a useful specific message can be shown.

Examples:

"That username is already taken."

"Please enter a valid email address."

"This email domain is not supported."

"Please enter a resolution target."

"Progress cannot be greater than the target."

Before considering the work complete, test:

ACCOUNT:

Signup

Duplicate email handling

Invalid email handling

Placeholder email rejection

Username uniqueness

Duplicate username handling

Login

Logout

Session persistence

PROFILE:

Initial profile setup after signup

Edit profile

Change username

Duplicate username rejection

Add/remove skills

Add/edit/remove real-life achievements

XP and level display

DASHBOARD:

Profile card navigation

Resolution card navigation

Contact Us card navigation

RESOLUTIONS:

Create

Edit

Delete

Update progress

Progress percentage

XP calculation

Completed state

Invalid progress handling

CONTACT:

Submit feedback

Feedback validation

Feedback stored in mock/local persistence

Feedback visible in mock VIP/Admin dashboard

THEME:

Light mode

Dark mode

Theme persistence

No broken UI in either theme

RESPONSIVE:

Desktop

Mobile

Do not make large architectural changes unless necessary.

First inspect the existing project and understand:

Current React structure

Current Express structure

Current authentication

Current resolution logic

Current database/mock persistence

Current styling system

Existing routes

Existing components

Then implement the new features incrementally.

Preserve working functionality.

If an existing feature already solves part of this requirement, improve it instead of replacing it.

At the end, the application should provide this complete user journey:

VISITOR
↓
Landing Page
↓
Sign Up / Log In
↓
SIGN UP
↓
Profile Setup
↓
Main Dashboard
↓
┌─────────────────────┐
│ PROFILE             │
│ RESOLUTIONS         │
│ CONTACT US          │
└─────────────────────┘

PROFILE

Professional profile

Name

Unique username

Bio

Education

Skills

Real-life achievements

PixelResolve achievements

XP

Level

Resolution summary

RESOLUTIONS

Clear creation flow

Easy progress tracking

XP

Levels

Completion

CONTACT US

Real feedback form

Mock storage

Mock VIP/Admin feedback dashboard

GLOBAL

Light/Dark mode

Unique usernames

Strong validation

Responsive design

No leaderboard

Do NOT implement these as production systems in this task:

Production database migration

Real email verification

Production admin authentication

Production infrastructure

Payment system

Notifications infrastructure

Advanced analytics

Leaderboard

Social features

Only create clean interfaces/placeholders where necessary so these can be added later.

A new person should be able to:

Open PixelResolve.

Understand what the product does.

Sign up.

Create a unique username.

Complete their profile.

Reach their dashboard.

Immediately understand the three main areas:
Profile / Resolutions / Contact Us.

Create a resolution without confusion.

Track progress and XP.

Edit their professional profile.

Submit useful feedback.

Switch between Light and Dark mode.

Refresh/reopen the app without losing mock/local data during development.

Use the entire application comfortably on mobile and desktop.

Most importantly:

BUILD THIS AS A STRONG, POLISHED FRONTEND + APPLICATION EXPERIENCE NOW.

KEEP THE DATA/INFRASTRUCTURE LAYER REPLACEABLE.

WE WILL CONNECT THE REAL PRODUCTION DATABASE, EMAIL VERIFICATION, ADMIN SECURITY, AND PRODUCTION INFRASTRUCTURE AT THE FINAL STAGE.