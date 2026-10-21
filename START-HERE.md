# Social Chef v3.3 — your integrations, polished interface

This revision uses your original Firebase project, Facebook App ID, Render generation endpoint, Page-login flow, and Firestore `posts` collection. The interface is simplified to two panels: Create your post, then Review & publish. Sidebar, slogans, decorative placeholders, fake social actions and unnecessary required fields were removed. Restaurant name, call to action and link remain available under Extra details. Drafts, example loading and sign-in are available under More. Save/copy/download are grouped below the main Publish button.

## Run on your Windows computer

1. Extract this ZIP into a new folder.
2. Open the `social-chef-restored` folder containing `server.mjs` and `package.json`.
3. Open a terminal there. Stop any old server with Ctrl+C.
4. Run `npm start` (or `npm run dev`) and visit http://localhost:3000.

Node.js 22 or later is required. No dependency install or Next.js build is needed.

## The actual workflow

1. Connect Facebook, then choose the Page you want to use. A single Page is selected automatically; multiple Pages require an explicit selection.
2. Add your food photo. It uploads to your original Firebase Storage project. Publishing waits for upload completion.
3. Enter the special and generate the caption through your original AI backend.
4. Edit the caption if desired.
5. Click **Publish caption + photo**. A photo post sends both your image URL and final edited caption to Facebook. Text-only posts are also supported.
6. A successful Facebook response shows a link to the published post. The button remains disabled afterward to prevent an accidental second click. Editing the caption, changing the photo or selecting a different Page begins a new post.

Nothing is posted until you click Publish. The developer did not post to your Page while preparing this revision.

## Your existing integrations

Public Firebase configuration and your Facebook App ID are retained in `public/config.js`. Facebook API version is configurable there (v24.0 in this revision; the original requested v18.0). Confirm the supported version in your existing Meta app dashboard before live testing if Meta returns a version error. Meta's documentation could not be retrieved during this work (HTTP 429), so account-specific configuration has not been verified.

Facebook SDK login must run from an origin your existing Meta app permits. Your original Netlify domain was `https://benevolent-moonbeam-c491d0.netlify.app`. If Facebook rejects localhost, test on your app's approved HTTPS origin or configure an approved development origin in Meta. Do not expect an unregistered localhost origin to inherit your live site's approval.

The original live HTML did not present an authentication screen; separate Firebase-auth modules were present in the upload. This revision makes email/password sign-in, account creation and sign-out accessible from the header using your existing Firebase project. Its available providers and security rules were not changed. Signed-in photos use `images/{uid}/...`; unsigned photos retain the original `images/...` structure. Existing Firebase rules decide what is allowed. Do not weaken those rules to bypass an upload error.

Generated posts and successful publications save into the original Firestore `posts` collection when permitted. Local drafts provide a separate recoverable editing workflow; cloud write failures do not stop publishing. Local drafts stay on the current browser, and images remain Firebase URLs. Sign-in does not make the local draft list private from other people using the same browser profile. Tokens are kept in memory, not stored in drafts or logged.

## AI writing and backend options

Without a local key, the local server forwards generation requests to your existing Render backend, preserving its existing model and writing behavior. This requires that service and its billing/key to remain operational. No request was made to that paid generation endpoint during testing.

For the improved writing prompt, copy `.env.example` to `.env`, add a fresh `OPENAI_API_KEY`, and restart `npm start`. This uses the local backend's more specific restaurant-writing brief, avoiding generic hype, invented offers and repetitive filler. `OPENAI_MODEL` remains `gpt-3.5-turbo` to match your original backend; choose another Chat Completions-compatible model if needed for your account. The expanded template library includes your original five-tone high-energy captions as an option. AI gets up to five seconds in the browser (4.5 seconds upstream on the local server), then a fresh template is used automatically. If AI fails, subsequent requests use templates immediately for one minute before retrying. The original three-successful-AI-requests-per-minute behavior is retained. The post remains editable and publishes with its photo through the same Facebook controls. A small source label distinguishes AI drafts from templates.

Your uploaded archive contained environment files and a hardcoded private API key in an old source file. Those secrets and git history are excluded from this deliverable. Revoke exposed private keys and supply a replacement in your local environment. Public Firebase configuration and Facebook App ID are application identifiers, not private API credentials.

## Hosting on your original frontend domain

The `public` folder is the static frontend. Before deploying only that folder to your original Netlify site, set `generationUrl` in `public/config.js` to your original full backend URL:

```
https://social-chef-backend.onrender.com/api/generate-post
```

This retains the original Netlify → Render arrangement and avoids a nonexistent Netlify `/api/generate-post` route. The original backend allowed your original Netlify origin in CORS. A different frontend domain needs corresponding backend CORS changes. The improved local prompt does not change the already-deployed Render backend; applying that prompt there is a separate backend update.

The bundled local server binds only to localhost. It is a personal development server, not a public hosting or multi-user authentication solution. No live deployment has been changed.

## Verified and still to verify

Automated checks cover:
- Caption plus Firebase photo URL sent to `/{page-id}/photos`.
- Text-only posts sent to `/{page-id}/feed`.
- Publishing waits for the Facebook callback and surfaces permission errors.
- Page-list pagination retains all returned Pages.
- Compatibility with the original AI response shape and backend URL.
- Own-key AI prompt and provider-error handling. Original-template fallback tests cover failures, stalled responses, slow JSON and rate limits.
- Actual composer button state while publishing and after a successful response.

All API tests use mocks, not your live credentials. Live Facebook login, Page permissions, Firebase rules, AI output quality and real publication still require testing in your connected account. Browser visual/mobile review has not been completed in this environment. Run `npm test` to repeat the automated checks.


## Expanded templates and simple visual refresh (v3.3)

- Twenty-eight categories grouped under menu/specials, weekly favorites, orders/occasions, and people/places. Category suggestions explain what details to enter.
- Six styles: Friendly, Fun, Bold, Elegant, Trendy, and Short & direct.
- Forty distinct food opening lines for each style (240 total), forty story openings for non-menu updates, and the fifteen original caption templates, available through the original high-energy option. Context lines and different paragraph arrangements adapt those openings to categories. These are authored template variants, not 295 wholly unrelated long-form articles.
- Instant templates are selected by default for immediate results without any network call. Choose AI + template backup under Post options to keep AI-first generation with a five-second limit.
- Standard/short captions, emoji/hashtag switches, optional restaurant name/link/call to action, and an option to include the original high-energy captions. For updates about people and events, story templates avoid the generic meal-planning openings.
- Subtle decorative header art and four category shortcut chips; the two-panel Create / Publish layout is retained.

### No-repeat behavior

The engine excludes template opening IDs and normalized full captions used in the preceding 30 generated posts. With forty base variants in each relevant pool, it can always select a fresh eligible template. Category/style changes share the same history. The selection history is saved in localStorage on this browser and survives page reloads. It is separate from saved drafts. AI captions that exactly repeat one in the same recent history are replaced with a fresh template. Similar meaning from an AI model cannot be reliably excluded by this exact-text check.

Your entered description, restaurant name and links naturally recur; the selected template wording does not reuse a recent template ID. The same template can become eligible after it leaves the 30-post window. Clearing site data resets that history, and history does not sync across devices. If browser storage is blocked/full, the in-memory history still prevents repeats in the current session but cannot survive a reload. Simultaneous generation from multiple tabs is not synchronized.

### Validation for this revision

Twenty-two automated tests cover the library, rotation, generation, Facebook requests and UI publishing state. The rotation stress test generates 100 posts for every one of 28 categories and six styles (16,800 generations) and checks every sliding 30-post window. Separate tests cover persisted history across recreated engines, blocked storage, repeated AI captions, instant mode and optional formatting. Live Facebook publishing and visual browser review still need verification in your connected account. Your live sites were not changed.
