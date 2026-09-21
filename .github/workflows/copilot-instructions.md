# AI Code Review Instructions for React Projects

Use the following instructions when reviewing changes to a React application. Apply every applicable instruction to the changed code, while considering the repository's actual architecture, configuration, dependencies, and intended behavior. Do not assume a specific build tool, styling approach, state library, router, API client, component library, or folder structure unless the repository shows that it is being used.

Only identify an issue when the changed code provides concrete evidence. For each finding, explain the relevant impact on correctness, security, accessibility, maintainability, performance, or user experience, point to the relevant code, and suggest a proportionate correction. Do not request unrelated refactoring, introduce dependencies the project does not use, or report a documented and intentional exception as a defect. Tool-specific instructions apply only when that tool is actually configured in the repository.

Treat server state or remote data as information owned by an API or another external system. Treat UI state or local state as transient client-side concerns such as open dialogs, selected tabs, and unsaved field input. Treat the exception described in each instruction as a legitimate condition in which the instruction should not produce a finding.

## Query the Complete Remote Dataset

When reviewing this area, inspect the changed code for the following behavior: Tables, search controls, and filters that operate only on the currently loaded page even though the underlying dataset can be larger. The reviewer should verify that query parameters, pagination, filter criteria, sorting, and search terms are sent to the data source when the product expects results across all records.
Treat a confirmed occurrence as significant because client-side filtering of an incomplete result set gives users incorrect results and can make valid records appear absent. It also becomes progressively less reliable and efficient as the dataset grows.
For example, treat the following pattern as evidence to investigate: A table fetches the first page once and applies rows.filter(...) for a global search without requesting matching records from the API.
Do not report a finding when the entire dataset is explicitly bounded, intentionally loaded in full, and the UI accurately represents local filtering as a client-side operation.

## Keep Pagination Semantics Consistent

When reviewing this area, inspect the changed code for the following behavior: Pagination implementations that ignore the current page, page size, cursor, total count, continuation token, or sort order expected by the data source. The reviewer should also check that moving between pages does not duplicate, skip, or unexpectedly reorder records.
Treat a confirmed occurrence as significant because incorrect pagination causes incomplete or repeated data, invalid navigation controls, and unreliable selection or bulk-action behavior.
For example, treat the following pattern as evidence to investigate: A page-number control changes local state but the request always uses the initial offset.
Do not report a finding when the endpoint intentionally returns a complete, bounded collection and the interface has no pagination controls or pagination requirement.

## Model Table States Explicitly

When reviewing this area, inspect the changed code for the following behavior: Data views that do not distinguish initial loading, refreshing, successful data, an empty collection, a filter with no matches, and request failure. The reviewer should ensure that each state presents a clear, accessible message or indicator.
Treat a confirmed occurrence as significant because a blank table or permanently visible spinner leaves users unable to determine whether data is loading, unavailable, filtered out, or broken.
For example, treat the following pattern as evidence to investigate: A component renders no rows for both an empty response and a failed request while retaining a loading indicator after the failure.
Do not report a finding when the surrounding route or shared data boundary already renders equivalent, contextually clear state handling for the component.

## Debounce and Supersede High-Frequency Searches

When reviewing this area, inspect the changed code for the following behavior: Requests issued for every keystroke, especially remote search requests, and responses that can update the UI after a newer query has been entered. The reviewer should check for appropriate debouncing, cancellation, request identity, or stale-response protection.
Treat a confirmed occurrence as significant because unbounded search traffic wastes resources and older responses can overwrite results for the user’s current query.
For example, treat the following pattern as evidence to investigate: An input onChange immediately fetches search results without debounce or cancellation, allowing a slow earlier request to replace later results.
Do not report a finding when search is intentionally submitted through an explicit action, input volume is inherently low, or request coalescing is already guaranteed by the data client.

## Avoid Unnecessary Refetching

When reviewing this area, inspect the changed code for the following behavior: Identical API calls repeatedly caused by routine navigation, remounting, rerendering, or state changes that do not change the requested resource. The reviewer should assess the configured freshness policy, invalidation behavior, and user need before suggesting caching or request deduplication.
Treat a confirmed occurrence as significant because repeated requests increase latency, network cost, and server load, and they can produce distracting loading states without making the displayed data more correct.
For example, treat the following pattern as evidence to investigate: A route fetches the same unchanged user profile every time an unrelated local panel opens because the data-fetching effect is coupled to all page state.
Do not report a finding when the product requires an explicit refresh, polling, revalidation, or data freshness level that justifies the request frequency.

## Keep Cache Keys Complete

When reviewing this area, inspect the changed code for the following behavior: Query or cache keys that omit inputs which determine a response, including page, search query, sort order, filter, tenant, locale, or authenticated scope. This is especially relevant in TanStack Query and similar server-state libraries.
Treat a confirmed occurrence as significant because incomplete cache keys can return data for the wrong request inputs, display stale filtered results, or allow one view to overwrite another view’s cached data.
For example, treat the following pattern as evidence to investigate: A users query uses queryKey: ["users"] even though its result varies by search, page, and sort.
Do not report a finding when the omitted value does not affect the request or returned data, or the data client demonstrably incorporates that value through an equivalent canonical key.

## Complete Every Asynchronous State Transition

When reviewing this area, inspect the changed code for the following behavior: Fetches and mutations whose loading state is cleared only on success, or whose success and failure paths do not reach a defined terminal state. The reviewer should inspect both resolved and rejected paths, including exceptions thrown while processing responses.
Treat a confirmed occurrence as significant because incomplete transitions leave interfaces stuck, enable duplicate submission, or display stale results after an error.
For example, treat the following pattern as evidence to investigate: setLoading(false) is called after a successful request but not in catch or finally.
Do not report a finding when a framework-managed query or mutation abstraction demonstrably owns and exposes the full pending, success, and error lifecycle.

## Present Safe, Actionable Error Feedback

When reviewing this area, inspect the changed code for the following behavior: Failed operations that provide no user feedback, expose raw backend or stack-trace text, or use vague messages that do not identify what action failed. The reviewer should expect meaningful, user-safe feedback through an appropriate inline message, alert, dialog, or toast.
Treat a confirmed occurrence as significant because users cannot recover from silent failures, while unfiltered technical details can confuse users and leak implementation information.
For example, treat the following pattern as evidence to investigate: A failed save logs error.message to the console but leaves the form unchanged without an error message.
Do not report a finding when the error is intentionally absorbed by a background, non-user-visible best-effort operation and failure cannot affect the user’s task.

## Treat Client, Network, and Server Failures Differently

When reviewing this area, inspect the changed code for the following behavior: One generic error branch that handles validation failures, authorization failures, offline conditions, timeouts, and server errors identically. The reviewer should check that expected client errors are mapped to corrective guidance and that retryable failures can be retried when doing so is safe.
Treat a confirmed occurrence as significant because different failure classes require different user actions. A user cannot correct an outage, while an invalid field should not be described as a generic system failure.
For example, treat the following pattern as evidence to investigate: A 401, a failed network request, and a 422 validation response all render “Something went wrong.”
Do not report a finding when the API contract intentionally hides classifications and the chosen message remains accurate, safe, and actionable.

## Validate Forms at the Appropriate Interaction Point

When reviewing this area, inspect the changed code for the following behavior: Validation errors displayed before a user has interacted with a field, missing validation after interaction or submission, and invalid forms that can submit without feedback. The reviewer should verify that touched, submitted, and server-validation states are represented distinctly where needed.
Treat a confirmed occurrence as significant because premature errors create a hostile form experience, while missing validation leads to preventable failed requests and unclear recovery.
For example, treat the following pattern as evidence to investigate: Required-field errors render as soon as the form mounts, before the user has attempted to submit or focus the fields.
Do not report a finding when a field must show an initial warning for safety, compliance, or required configuration and the warning clearly explains why it is already visible.

## Resolve Failed Mutations Transparently

When reviewing this area, inspect the changed code for the following behavior: Create, update, delete, and other mutations that silently fail, retain an optimistic change after rejection, or fail to refresh or reconcile affected data. The reviewer should verify that success feedback, failure feedback, rollback, and invalidation behavior match the chosen update strategy.
Treat a confirmed occurrence as significant because silent or unreconciled mutations make users believe that a change succeeded when the source of truth disagrees.
For example, treat the following pattern as evidence to investigate: A row is removed optimistically and is never restored when the delete request fails.
Do not report a finding when the data client provides a correctly configured optimistic-update rollback and cache reconciliation mechanism.

## Use Retries Deliberately and Record Actionable Failures

When reviewing this area, inspect the changed code for the following behavior: Retry controls missing from retryable user-initiated requests, automatic retries for non-idempotent mutations, or errors that are neither observable nor diagnosable. The reviewer should assess whether a safe retry action and privacy-conscious error logging are appropriate.
Treat a confirmed occurrence as significant because users need a recovery path for transient failures, but automatic replay of unsafe mutations can create duplicate side effects. Missing diagnostics also make recurring failures difficult to investigate.
For example, treat the following pattern as evidence to investigate: A payment-like mutation automatically retries after an uncertain network timeout without an idempotency guarantee.
Do not report a finding when retrying is unsafe, the operation is automatically retried by an established client with correct safeguards, or the user can safely repeat the action through normal UI flow.

## Prevent Duplicate Form Submission

When reviewing this area, inspect the changed code for the following behavior: Forms and submit controls that can invoke the same mutation repeatedly while a submission is pending. The reviewer should expect the pending state to prevent accidental duplicate work through disabled controls, request deduplication, or another clearly safe interaction model.
Treat a confirmed occurrence as significant because duplicate requests can create multiple records, overwrite changes, charge users twice, or leave users uncertain which result is authoritative.
For example, treat the following pattern as evidence to investigate: A submit button remains active while a save request is in flight and starts a second identical mutation on another click.
Do not report a finding when repeated submission is safe by design, such as an idempotent refresh operation with a clearly communicated result.

## Preserve User Input During Asynchronous Failures

When reviewing this area, inspect the changed code for the following behavior: Error paths that reset form fields, discard a draft, close an editor, or replace entered values without an intentional recovery strategy. The reviewer should distinguish a successful save reset from a failed save, where retaining correctable input is normally expected.
Treat a confirmed occurrence as significant because losing input after a network or server failure makes recovery costly and can cause users to abandon an important task.
For example, treat the following pattern as evidence to investigate: A failed profile update clears every field before the user can correct the rejected value.
Do not report a finding when the retained value is unsafe or invalid to preserve, or the interface offers an equally reliable draft-recovery mechanism.

## Distinguish Client and Server Validation

When reviewing this area, inspect the changed code for the following behavior: Validation feedback that conflates locally checkable format and required-field rules with server-authoritative business, uniqueness, permission, or conflict validation. The reviewer should ensure that each type of feedback explains an action the user can realistically take.
Treat a confirmed occurrence as significant because treating all failures as local validation can mislead users, while treating obvious format errors as generic server errors creates unnecessary requests and poor recovery.
For example, treat the following pattern as evidence to investigate: An “email already registered” response is shown as though the email format is invalid, or a malformed email is sent to the server without local feedback where local validation already exists.
Do not report a finding when the server intentionally owns a rule that cannot be accurately duplicated in the client and the returned feedback remains safe and actionable.

## Prevent Accidental Data Loss

When reviewing this area, inspect the changed code for the following behavior: Dirty forms, editors, and modal workflows that can be dismissed, navigated away from, or refreshed without an appropriate warning, draft strategy, or clearly intentional discard action. The reviewer should assess the amount and recoverability of user-entered data rather than require prompts for trivial changes.
Treat a confirmed occurrence as significant because users can lose substantial unsaved work through routine navigation or a mistaken close action.
For example, treat the following pattern as evidence to investigate: A multi-field editor closes immediately when a user clicks Cancel despite unsaved changes and without a confirmation or recoverable draft.
Do not report a finding when the changes are automatically persisted, reliably retained as a draft, trivial to recreate, or the discard action is explicit and proportionate to the risk.

## Honor the API Contract and Operation Scope

When reviewing this area, inspect the changed code for the following behavior: Incorrect endpoint paths, HTTP methods, request bodies, response assumptions, and bulk operations implemented as accidental loops of single-item requests. The reviewer should verify that the client implementation matches the documented or typed contract and intended operation granularity.
Treat a confirmed occurrence as significant because contract mismatches cause functional failures, excessive traffic, partial completion, and inconsistent error handling.
For example, treat the following pattern as evidence to investigate: A bulk archive action calls a single-record endpoint once per selected item despite an available atomic bulk endpoint.
Do not report a finding when the service intentionally provides only a single-item operation and the interface handles partial failure and concurrency responsibly.

## Guard Untrusted and Nullable Responses at Boundaries

When reviewing this area, inspect the changed code for the following behavior: Direct nested property access on remote data, unchecked optional fields, and assumptions that response shape always matches a happy-path example. The reviewer should expect validation, normalization, defaults, or guarded rendering at the boundary where external data enters the UI.
Treat a confirmed occurrence as significant because aPIs evolve, permissions vary, and incomplete records are normal in distributed systems. Unsafe access can crash the page or display misleading data.
For example, treat the following pattern as evidence to investigate: Rendering profile.organization.name without checking whether profile or organization is present.
Do not report a finding when strong runtime validation or a proven invariant guarantees the data shape before the component receives it.

## Prevent Duplicate, Unnecessary, and Stale Requests

When reviewing this area, inspect the changed code for the following behavior: Requests triggered during every render, duplicated between components, made for unchanged inputs, or allowed to race without cancellation or stale-result protection. The reviewer should check whether query keys, dependencies, and request lifetimes correctly represent the required data.
Treat a confirmed occurrence as significant because redundant traffic increases latency and cost, while races can overwrite current UI state with obsolete data.
For example, treat the following pattern as evidence to investigate: A component starts a fetch in its render body rather than in an event handler, effect, or data-fetching abstraction.
Do not report a finding when the request is intentionally repeated for polling or revalidation and the frequency, cleanup, and stale-data behavior are explicit.

## Keep Secrets and Private Configuration Out of the Client

When reviewing this area, inspect the changed code for the following behavior: API keys, credentials, database URLs, private tokens, or server-only environment values committed to browser code, client-readable environment files, logs, or build output. The reviewer should recognize that every value embedded in a client bundle is public to its users, regardless of how the project exposes environment configuration.
Treat a confirmed occurrence as significant because a browser client cannot keep a secret. Exposed credentials can enable data loss, unauthorized access, or service abuse.
For example, treat the following pattern as evidence to investigate: A client-exposed environment value containing a privileged service token is used in a browser API client.
Do not report a finding when the value is intentionally public, such as a documented publishable identifier, and the associated service is configured for safe public use.

## Treat Rendered HTML as Untrusted by Default

When reviewing this area, inspect the changed code for the following behavior: dangerouslySetInnerHTML, HTML returned by APIs, user-generated HTML, unsafe markdown rendering, and unsanitized rich-text paths. The reviewer should require a trusted source and robust sanitization at the relevant boundary before untrusted content can reach an HTML-capable renderer.
Treat a confirmed occurrence as significant because rendering untrusted HTML can enable cross-site scripting, data exposure, session compromise, and unauthorized actions performed in a user’s browser.
For example, treat the following pattern as evidence to investigate: A markdown preview inserts API-provided HTML directly with dangerouslySetInnerHTML.
Do not report a finding when content is generated solely from trusted static application source, or a maintained sanitizer is correctly configured for the accepted content and threat model.

## Enforce Authorization at the Correct Boundary

When reviewing this area, inspect the changed code for the following behavior: Frontend code that treats a hidden button, disabled control, omitted navigation item, or client-side role check as proof that an operation is secure. The reviewer should flag the dangerous assumption that a user cannot directly invoke a restricted operation merely because the interface does not expose it.
Treat a confirmed occurrence as significant because browser code and requests can be inspected or modified by users. Authorization for sensitive operations must ultimately be enforced by the system boundary that owns the protected resource.
For example, treat the following pattern as evidence to investigate: An administrator-only delete action is rendered only when isAdmin is true, while the surrounding change assumes this UI condition alone prevents unauthorized deletion.
Do not report a finding when the review is limited to a frontend-only repository and the code makes no claim that UI gating provides backend authorization. In that circumstance, identify the assumption and associated risk, but do not demand backend implementation that is outside the repository.

## Avoid Sensitive Data in Logs

When reviewing this area, inspect the changed code for the following behavior: Console logging, error reporting, analytics, or diagnostics that emit user objects, authentication tokens, authorization headers, complete responses, or other values likely to contain personal information or sensitive API data.
Treat a confirmed occurrence as significant because client logs and third-party telemetry can be visible to end users, browser extensions, support tooling, or external services. Broad object logging can unintentionally expose secrets or personal data.
For example, treat the following pattern as evidence to investigate: console.log(response) is added to a login or profile request where the response can contain a token, account details, or authorization metadata.
Do not report a finding when the data is deliberately redacted and the retained diagnostic fields are demonstrably non-sensitive under the project’s observability policy.

## Preserve Responsive, Task-Complete Layouts

When reviewing this area, inspect the changed code for the following behavior: Fixed widths, overflow, clipped controls, inaccessible off-screen actions, and layouts that lose essential context or interaction on narrow screens. The reviewer should assess the changed interface across relevant breakpoints rather than only its desktop appearance.
Treat a confirmed occurrence as significant because a feature that visually fits one viewport but cannot be operated on another is functionally incomplete for affected users.
For example, treat the following pattern as evidence to investigate: A table action group is positioned outside a non-scrollable mobile container and cannot be reached.
Do not report a finding when the route is explicitly limited to a managed viewport, such as a documented internal desktop-only administration surface.

## Represent Pending and Disabled Actions Clearly

When reviewing this area, inspect the changed code for the following behavior: Submit, navigation, or mutation controls that stay active while the same operation is pending, or disabled controls without an understandable reason. The reviewer should expect visual and semantic pending state where repeated actions could cause duplicate or conflicting work.
Treat a confirmed occurrence as significant because users may submit the same request repeatedly or mistake an inactive interface for a broken one.
For example, treat the following pattern as evidence to investigate: A “Save” button remains enabled during an in-flight save and starts another mutation on every click.
Do not report a finding when repeated activation is safe and intentionally supported, such as a refresh action with request deduplication.

## Confirm Meaningfully Destructive Actions

When reviewing this area, inspect the changed code for the following behavior: Irreversible or materially disruptive actions that execute immediately without an informed confirmation or an equally reliable undo mechanism. The reviewer should evaluate the consequence of the action rather than mechanically requiring confirmations everywhere.
Treat a confirmed occurrence as significant because a mistaken destructive action can permanently remove data, revoke access, or interrupt important work.
For example, treat the following pattern as evidence to investigate: A permanent delete button immediately removes a record with no undo, confirmation, or clear destructive affordance.
Do not report a finding when the action is trivially reversible, an accessible undo is provided, or additional confirmation would create needless friction without reducing risk.

## Acknowledge Completed User Actions

When reviewing this area, inspect the changed code for the following behavior: Create, update, delete, navigation, and asynchronous actions that leave users without visible confirmation or an observable resulting state. The reviewer should check that successful actions either update the relevant view immediately or communicate completion clearly.
Treat a confirmed occurrence as significant because without feedback, users repeat actions, abandon tasks, or distrust whether the system accepted their change.
For example, treat the following pattern as evidence to investigate: A modal closes after an update but the underlying list remains unchanged and no confirmation appears.
Do not report a finding when the resulting state is immediate, prominent, and unambiguous, such as an updated value visibly replacing the previous one.

## Support Accessible Keyboard Interaction

When reviewing this area, inspect the changed code for the following behavior: Custom controls, dialogs, flows, and conditional steps that require pointer interaction or leave keyboard focus lost, trapped incorrectly, or unable to reach the next action. The reviewer should verify native semantics before accepting custom keyboard handling.
Treat a confirmed occurrence as significant because keyboard-only users and users of assistive technology cannot complete workflows when focus order and interaction semantics are incomplete.
For example, treat the following pattern as evidence to investigate: A custom “Next” control is a clickable div that cannot receive focus or respond to Enter and Space.
Do not report a finding when the element is purely presentational and does not initiate an action or expose information needed to finish the task.

## Use Semantic HTML for Native Interactions

When reviewing this area, inspect the changed code for the following behavior: Custom interactive behavior implemented with non-semantic elements when a native element conveys the intent, such as a clickable div used as a button or a styled text element used as a link.
Treat a confirmed occurrence as significant because native controls provide keyboard behavior, focus management, semantics, and assistive-technology support by default. Recreating these behaviors correctly is error-prone.
For example, treat the following pattern as evidence to investigate: A div with onClick opens a dialog but has no button semantics, keyboard activation, or accessible state.
Do not report a finding when a custom widget is necessary and implements the complete applicable accessibility pattern, including semantic role, keyboard behavior, focus handling, and state announcements.

## Provide Accessible Names

When reviewing this area, inspect the changed code for the following behavior: Buttons, inputs, icon-only controls, links, dialogs, and other interactive elements that lack a programmatically determinable name. The reviewer should check visible text, associated labels, aria-label, and aria-labelledby in the context of the rendered element.
Treat a confirmed occurrence as significant because screen-reader users cannot determine the purpose of unnamed controls or regions, even when their visual icon or placement appears obvious.
For example, treat the following pattern as evidence to investigate: A delete button contains only a trash icon and has no visible label, aria-label, or other accessible naming relationship.
Do not report a finding when the accessible name is supplied by a verified reusable component or an equivalent semantic relationship outside the immediate JSX expression.

## Associate Form Labels Correctly

When reviewing this area, inspect the changed code for the following behavior: Form inputs with visual labels that are not associated through a native <label>, htmlFor and id, wrapping relationship, or a valid accessible naming alternative. The reviewer should also consider errors and instructions that need an accessible association.
Treat a confirmed occurrence as significant because a visually adjacent label may not be announced with its field, making form completion difficult or impossible with assistive technology.
For example, treat the following pattern as evidence to investigate: “Email” is rendered in a separate text element next to an input without a corresponding label association.
Do not report a finding when the form control receives an equivalent accessible name through a correctly configured shared component or an appropriate ARIA relationship.

## Manage Dialog Focus Deliberately

When reviewing this area, inspect the changed code for the following behavior: Custom modal dialogs that do not move focus into the dialog, allow focus to disappear behind it, omit appropriate Escape behavior, or fail to restore focus after closing. The reviewer should verify the complete dialog behavior rather than merely checking for a modal visual overlay.
Treat a confirmed occurrence as significant because keyboard and assistive-technology users can become disoriented or unable to continue their task when focus is unmanaged.
For example, treat the following pattern as evidence to investigate: A custom confirmation modal opens visually but leaves focus on the now-obscured delete button and returns focus nowhere predictable when it closes.
Do not report a finding when a maintained dialog primitive already provides the required focus lifecycle and is used according to its documented contract.

## Keep Components Focused on One Cohesive Responsibility

When reviewing this area, inspect the changed code for the following behavior: Very large components that combine unrelated data access, transformations, form logic, modal control, and visual rendering without a clear boundary. The reviewer should recommend extraction when it improves testability, reuse, readability, or independent reasoning.
Treat a confirmed occurrence as significant because mixed responsibilities make changes risky, hide state ownership, and encourage copied logic.
For example, treat the following pattern as evidence to investigate: A single page component fetches multiple resources, implements validation, contains several dialogs, and renders unrelated table and editor views in one large render function.
Do not report a finding when the component remains small, cohesive, and easier to understand than a fragmented set of one-use abstractions.

## Extract Repeated UI and Domain Logic at the Right Boundary

When reviewing this area, inspect the changed code for the following behavior: Copied JSX, repeated form fields, table setup, request code, validation, loading states, modal behavior, or business calculations that must remain consistent. The reviewer should favor reuse only after confirming that the repeated behavior is genuinely the same.
Treat a confirmed occurrence as significant because duplicated logic drifts over time and forces every bug fix or design update to be repeated manually.
For example, treat the following pattern as evidence to investigate: Several routes each implement a slightly different request-error banner for the same data client behavior.
Do not report a finding when similar code differs materially in behavior, lifecycle, or domain meaning, making a shared abstraction less clear than local code.

## Use Effects Only for External Synchronization

When reviewing this area, inspect the changed code for the following behavior: Effects used to calculate values that can be derived during render, reset state unnecessarily, mirror props into state, or trigger work without an external synchronization purpose. The reviewer should inspect whether an event handler, render calculation, or data-fetching mechanism would express the intent more directly.
Treat a confirmed occurrence as significant because unnecessary effects create extra renders, timing issues, and hard-to-reason-about state synchronization.
For example, treat the following pattern as evidence to investigate: An effect recomputes a filtered array into state whenever items or query changes, even though the array can be derived during render.
Do not report a finding when the effect synchronizes with an external system such as a subscription, imperative browser API, timer, or third-party widget.

## Make Effect Dependencies, Cleanup, and Fresh Values Correct

When reviewing this area, inspect the changed code for the following behavior: Missing dependencies, misleading dependency suppression, missing cleanup for listeners or subscriptions, and callbacks that capture outdated props or state. The reviewer should verify that the effect re-runs when required and cleans up on replacement or unmount.
Treat a confirmed occurrence as significant because incorrect dependencies and stale closures lead to obsolete requests, memory leaks, duplicate listeners, and updates against the wrong state.
For example, treat the following pattern as evidence to investigate: A subscription effect depends on an identifier but uses an empty dependency array, so it continues listening to the first identifier after it changes.
Do not report a finding when a value is intentionally stable by documented invariant or the code uses a safe ref-based pattern to access the latest value.

## Apply Memoization Only When It Has a Demonstrable Benefit

When reviewing this area, inspect the changed code for the following behavior: useMemo and useCallback added by default, dependencies omitted to preserve identity, or expensive work still performed before memoization. The reviewer should ask whether memoization prevents a measured cost or is required by a downstream identity-sensitive contract.
Treat a confirmed occurrence as significant because premature memoization increases complexity and can introduce stale values without improving performance.
For example, treat the following pattern as evidence to investigate: A callback used only by a native button is wrapped in useCallback despite no memoized child or dependency-sensitive consumer.
Do not report a finding when a profiler, expensive computation, stable callback requirement, or memoized consumer demonstrates a real benefit.

## Never Cause Side Effects During Render

When reviewing this area, inspect the changed code for the following behavior: Fetches, subscriptions, mutations, state updates, imperative browser changes, or other externally observable work executed directly in a component render path. Render logic should remain a predictable calculation of the UI from current inputs and state.
Treat a confirmed occurrence as significant because react can render components more than once or abandon a render. Side effects during render can duplicate requests, create inconsistent state, and behave incorrectly under concurrent rendering.
For example, treat the following pattern as evidence to investigate: A component calls fetchData() or setSomething(true) directly in its function body before returning JSX.
Do not report a finding when the code only derives local values during render, or the invoked function is demonstrably pure and does not schedule work, mutate state, or interact with an external system.

## Avoid State Updates That Can Be Derived

When reviewing this area, inspect the changed code for the following behavior: Local state and effects used solely to mirror props, concatenate names, filter collections, calculate totals, or derive another value that can be safely computed during render. This rule reinforces RHOOK-01 with an explicit focus on redundant state ownership.
Treat a confirmed occurrence as significant because derived state introduces an additional source of truth, can temporarily become stale, and often causes an unnecessary render cycle.
For example, treat the following pattern as evidence to investigate: An effect updates fullName state whenever firstName or lastName changes, even though fullName can be calculated directly from those values.
Do not report a finding when the value represents an intentional editable draft, a cached expensive calculation with measured benefit, or independently changing state with documented synchronization rules.

## Handle Component Unmount During Asynchronous Work

When reviewing this area, inspect the changed code for the following behavior: Fetches, timers, subscriptions, event listeners, async callbacks, observers, or other work that can complete after a component has unmounted or after its inputs have changed. The reviewer should expect cancellation, cleanup, request identity checks, or safe lifecycle ownership where appropriate.
Treat a confirmed occurrence as significant because stale asynchronous work can update irrelevant UI, leak resources, overwrite newer state, or retain subscriptions longer than intended.
For example, treat the following pattern as evidence to investigate: A component starts a request for one record, navigates to another record, and allows the first response to overwrite the later record’s state.
Do not report a finding when a framework-managed abstraction already owns cancellation and stale-result handling, or completion cannot affect component state or long-lived resources.

## Use Correct Event Handler Semantics

When reviewing this area, inspect the changed code for the following behavior: Event props that invoke work during render, such as onClick={handleClick()}, handlers with an unintended argument shape, or expensive work created synchronously when a user interaction was intended to trigger it.
Treat a confirmed occurrence as significant because invoking a handler during render can cause immediate mutations, render loops, or lost user interaction. Incorrect handler wiring also makes UI behavior difficult to predict.
For example, treat the following pattern as evidence to investigate: A button uses onClick={handleClick()} when the intended handler is onClick={handleClick}.
Do not report a finding when the invoked expression deliberately returns a handler function and that contract is clear from the surrounding implementation.

## Protect Restricted Routes

When reviewing this area, inspect the changed code for the following behavior: Authenticated, administrator, and role-based pages that are hidden from navigation but remain directly accessible through a route or deep link. The reviewer should check route guards, unauthorized outcomes, fallback routes, and the distinction between client navigation behavior and backend authorization.
Treat a confirmed occurrence as significant because hiding a navigation item does not prevent direct navigation. Users can reach restricted pages through saved URLs, manually entered paths, or browser history.
For example, treat the following pattern as evidence to investigate: An admin route is omitted from the menu for non-administrators but renders the protected page when its URL is entered directly.
Do not report a finding when the route is intentionally public, or a shared route guard already enforces the required access behavior. This rule does not replace the backend authorization requirement described in RSEC-03.

## Validate URL-Derived State and Invalid Parameters

When reviewing this area, inspect the changed code for the following behavior: Route parameters, query strings, redirect targets, and browser state used without validation, decoding, authorization checks, or safe fallbacks. The reviewer should consider malformed identifiers such as /users/abc, missing values such as /users/undefined, unknown records, unsupported query parameters, and unsafe return destinations.
Treat a confirmed occurrence as significant because uRLs are externally controlled input. Invalid route state can create broken screens or invalid requests, while unbounded redirect targets can create open-redirect vulnerabilities.
For example, treat the following pattern as evidence to investigate: A login callback redirects to any returnTo query value without limiting it to an allowed same-origin path, or a detail page requests /users/undefined without a safe fallback.
Do not report a finding when a routing framework or shared guard already validates the parameter and enforces safe destination rules.

## Avoid Unnecessary Navigation-State Duplication

When reviewing this area, inspect the changed code for the following behavior: Local or global state that duplicates a value already represented canonically in the URL, such as a selected record identifier, active filter, page, or tab. The reviewer should assess whether the URL should remain the source of truth for deep-linkable navigation state.
Treat a confirmed occurrence as significant because competing route and component state can drift, break back and forward navigation, and make shared links restore an unexpected view.
For example, treat the following pattern as evidence to investigate: A page stores selectedUserId in component state even though the selected user is determined by /users/:userId, then the state and route update independently.
Do not report a finding when the state is intentionally transient, not meant to be shareable or restorable, or the URL representation would make the interaction less clear without providing a navigation benefit.

## Maintain One Authoritative Owner for Each State Value

When reviewing this area, inspect the changed code for the following behavior: The same logical state independently stored in multiple components, props copied into local state without synchronization rules, or several sources that can update the same value. The reviewer should determine which layer owns the value and whether derived values can be calculated instead of stored.
Treat a confirmed occurrence as significant because multiple sources of truth drift and create unpredictable UI updates.
For example, treat the following pattern as evidence to investigate: A selected record is stored in both a parent list and a child dialog, with each changing its own copy.
Do not report a finding when separate values intentionally represent a draft and a persisted version, and the synchronization and save/discard semantics are clear.

## Separate Server State from Client UI State

When reviewing this area, inspect the changed code for the following behavior: Remote records stored in ad hoc UI state while caching, invalidation, refetching, and request status are manually duplicated; or transient UI state placed in a remote-data cache. The reviewer should ensure the data model matches ownership and lifetime.
Treat a confirmed occurrence as significant because mixing these concerns causes stale data, unnecessary refetching, and difficult cache invalidation.
For example, treat the following pattern as evidence to investigate: A shared context manually stores API results, loading flags, errors, and refresh logic for every route while a server-state mechanism already owns the same query.
Do not report a finding when the project deliberately uses a small custom data layer that correctly handles freshness, errors, invalidation, and concurrent consumers.

## Scope Shared State Proportionately

When reviewing this area, inspect the changed code for the following behavior: Global state used for isolated component concerns, context providers with rapidly changing values that rerender broad subtrees, or long prop chains that obscure ownership. The reviewer should recommend local state, composition, context splitting, or a dedicated shared store based on actual sharing requirements.
Treat a confirmed occurrence as significant because overly global state couples unrelated views, while excessive prop drilling makes interfaces brittle and difficult to evolve.
For example, treat the following pattern as evidence to investigate: A global provider stores whether one local dropdown is open and causes the application shell to rerender whenever it changes.
Do not report a finding when the value is legitimately cross-cutting, such as authenticated identity, locale, or a stable application-level preference.

## Keep Query Caches Coherent After Changes

When reviewing this area, inspect the changed code for the following behavior: Mutations that leave cached lists or detail views stale, invalidations that are too broad or too narrow, and manual cache writes that do not match the server result. The reviewer should ensure that the changed data is reconciled consistently for every affected view.
Treat a confirmed occurrence as significant because users can see contradictory data in different parts of the application or make decisions using stale state.
For example, treat the following pattern as evidence to investigate: Updating a record invalidates its detail query but leaves the cached search result showing the old name.
Do not report a finding when the application deliberately accepts bounded eventual consistency and communicates or refreshes the affected view appropriately.

## Avoid Render and List Work That Does Not Scale

When reviewing this area, inspect the changed code for the following behavior: Expensive calculations on every render, unstable props that force expensive children to rerender, and large lists rendered without pagination, windowing, or another bounded strategy. The reviewer should assess scale using the plausible data volume and interaction frequency.
Treat a confirmed occurrence as significant because rendering cost grows with data size and can make input, scrolling, and navigation visibly slow.
For example, treat the following pattern as evidence to investigate: Thousands of rows are rendered at once with complex cells when the interface has no virtualization or paging.
Do not report a finding when the collection is demonstrably small and bounded, or profiling shows that the simpler implementation meets performance requirements.

## Keep Client Bundles and Imports Intentional

When reviewing this area, inspect the changed code for the following behavior: Large libraries imported for small tasks, whole-module imports when a targeted import is available, and infrequently used routes or tools shipped eagerly without reason. The reviewer should assess the production bundle produced by the project’s configured build process rather than assuming development speed reflects shipped cost.
Treat a confirmed occurrence as significant because oversized bundles delay first render, consume bandwidth, and can reduce responsiveness on lower-powered devices.
For example, treat the following pattern as evidence to investigate: A large editor or visualization package is imported into the application entry path even though only one rarely visited route uses it.
Do not report a finding when the dependency is required for the initial experience or bundle analysis confirms that its cost is acceptable.

## Lazy Load Heavy or Rarely Used Features When Justified

When reviewing this area, inspect the changed code for the following behavior: Heavy editors, charts, visualizations, administration surfaces, or rarely visited routes that are imported eagerly into an initial application path. The reviewer should consider route or component lazy loading when it would materially reduce initial bundle cost without harming the required user experience.
Treat a confirmed occurrence as significant because eagerly shipping code that most users never need delays the first useful render and consumes unnecessary bandwidth.
For example, treat the following pattern as evidence to investigate: A large chart package is imported by the application shell even though it is used only on a rarely visited analytics route.
Do not report a finding when the feature is needed for the initial experience, the dependency is small, or production bundle evidence shows that splitting would not provide a meaningful benefit.

## Avoid Unnecessary Parent-to-Child Rerenders

When reviewing this area, inspect the changed code for the following behavior: Rapidly changing state placed high in the tree, unnecessarily broad context values, or unstable objects and functions passed to demonstrably expensive child components. Recommendations should be based on evidence of rendering cost, interaction frequency, or an identity-sensitive downstream consumer.
Treat a confirmed occurrence as significant because broad invalidation can make typing, scrolling, and navigation slow when expensive portions of the interface rerender without needing new data.
For example, treat the following pattern as evidence to investigate: A global context value includes a frequently changing input field, causing a large application subtree with costly children to rerender on every keystroke.
Do not report a finding when the child render is inexpensive, the data genuinely must update the subtree, or a profiling result does not demonstrate a material performance concern. Do not recommend React.memo or callback memoization by default.

## Clean Up Long-Lived Resources

When reviewing this area, inspect the changed code for the following behavior: setInterval, event listeners, subscriptions, observers, WebSockets, media streams, object URLs, and similar resources created by a component or feature without an appropriate cleanup path.
Treat a confirmed occurrence as significant because unreleased resources can leak memory, continue unnecessary network or CPU work, trigger callbacks against stale views, and create duplicated behavior after navigation.
For example, treat the following pattern as evidence to investigate: An effect creates an interval but does not return a cleanup function that calls clearInterval.
Do not report a finding when the resource is intentionally owned by a longer-lived application service with documented cleanup, or the platform automatically scopes and disposes it in the demonstrated lifecycle.

## Do Not Ship Server-Only Code to the Browser

When reviewing this area, inspect the changed code for the following behavior: Browser-reachable modules importing Node-only APIs, server SDKs, filesystem access, private service clients, or dependencies that assume a server runtime. The reviewer should trace imports through client entry points rather than infer the execution environment only from a filename.
Treat a confirmed occurrence as significant because server-only code can expose credentials, fail browser builds, substantially enlarge bundles, or create runtime errors for users.
For example, treat the following pattern as evidence to investigate: A React component imports a database client initialized with privileged credentials or a Node fs dependency.
Do not report a finding when the module is verified to execute only in a server or build-time boundary and cannot be included in a browser bundle.

## Use Browser Environment Variables Correctly

When reviewing this area, inspect the changed code for the following behavior: Client code that assumes private runtime configuration, uses the wrong environment-variable API for the configured build tool, or does not validate required public configuration before use. For Vite, review import.meta.env and public VITE_ variables; for Create React App, review its process.env.REACT_APP_ convention or the project’s configured equivalent.
Treat a confirmed occurrence as significant because incorrect assumptions can fail only in production, while values exposed to a browser bundle are public regardless of their variable name.
For example, treat the following pattern as evidence to investigate: A Vite client component reads process.env.API_URL, or a browser-exposed variable contains a privileged API token.
Do not report a finding when the code executes in a verified server-side or build-time context, or the repository explicitly configures an alternative client environment convention.

## Verify Production Build Compatibility

When reviewing this area, inspect the changed code for the following behavior: Changes that work only in development but can fail after the configured production build due to asset paths, dynamic imports, environment assumptions, case-sensitive file paths, generated styling, or other build-time behavior.
Treat a confirmed occurrence as significant because development servers often mask production-only resolution, optimization, and deployment errors that users encounter after release.
For example, treat the following pattern as evidence to investigate: A dynamic import uses an unsupported variable path, or an import’s letter casing differs from the filename and fails in a case-sensitive production environment.
Do not report a finding when the changed path is covered by an equivalent production build check, or the active toolchain does not impose the suspected constraint.

## Keep Names, Files, and Render Logic Readable

When reviewing this area, inspect the changed code for the following behavior: Inconsistent component or file names, deeply nested JSX that hides branches, large inline transformations in markup, unexplained hard-coded values, and import ordering that conflicts with the project’s established tooling. The reviewer should favor names and local constants that reveal intent.
Treat a confirmed occurrence as significant because ambiguous structure increases review time, hides defects, and makes safe modification harder.
For example, treat the following pattern as evidence to investigate: A JSX expression contains several nested ternaries, filtering, sorting, and formatting operations that obscure the states being rendered.
Do not report a finding when a short local expression is more readable than an extracted helper or constant.

## Remove Dead, Debug, and Placeholder Artifacts

When reviewing this area, inspect the changed code for the following behavior: Unused imports, variables, functions, styles, duplicate components, commented-out implementation, console debugging, stale TODO or FIXME markers, mock data, and generic abstractions with no meaningful consumer. The reviewer should distinguish temporary development diagnostics from code that will ship.
Treat a confirmed occurrence as significant because dead artifacts mislead maintainers, conceal actual dependencies, increase bundle or lint noise, and are common sources of accidental behavior.
For example, treat the following pattern as evidence to investigate: A production component contains a commented-out alternate implementation and console.log statements exposing response data.
Do not report a finding when the diagnostic is intentionally retained through an approved observability mechanism, or the TODO references a tracked requirement with a clear reason and owner.

## Preserve Type Safety Where TypeScript Is Used

When reviewing this area, inspect the changed code for the following behavior: any used to silence errors, broad or duplicated types, unsafe assertions, untyped component props, events, form data, requests, or responses, and type definitions that differ from actual contracts. The reviewer should also inspect optional and nullable fields before access.
Treat a confirmed occurrence as significant because weak typing moves contract failures to runtime and makes refactors unreliable.
For example, treat the following pattern as evidence to investigate: A request response is cast to any, then deeply accessed without validation or null handling.
Do not report a finding when the file is JavaScript, a narrow and justified boundary assertion follows runtime validation, or a third-party type limitation is isolated and documented.

## Use a Consistent Styling System

When reviewing this area, inspect the changed code for the following behavior: Repeated arbitrary colors, spacing, shadows, widths, or typography values where project tokens, CSS custom properties, theme values, or shared component patterns should be used. The reviewer should favor the styling system already established by the project and reusable primitives for repeated visual decisions.
Treat a confirmed occurrence as significant because uncoordinated utility values cause visual drift and make a design change expensive and error-prone.
For example, treat the following pattern as evidence to investigate: Similar buttons use unrelated arbitrary blue values and spacing combinations throughout several files.
Do not report a finding when a one-off value is genuinely required by a specific design, asset, or layout and does not represent a reusable visual decision.

## Keep Styling Maintainable and Conflict-Free

When reviewing this area, inspect the changed code for the following behavior: Large inline style objects, duplicated style rules, unnecessary !important, dead styles, and conflicting declarations whose final precedence is unclear. The reviewer should check whether the project’s chosen styling approach remains readable, responsive, and consistent.
Treat a confirmed occurrence as significant because mixed and conflicting styling approaches obscure the rendered result and make changes fragile.
For example, treat the following pattern as evidence to investigate: A component uses inline pixel styles, duplicated stylesheet rules, and component-level styles to control the same layout property.
Do not report a finding when an inline style is necessary for a genuinely dynamic runtime value that cannot be represented safely by the project’s styling system or CSS custom properties.

## Use Tailwind Tokens Instead of Inconsistent Arbitrary Values

When reviewing this area, inspect the changed code for the following behavior: Tailwind arbitrary values such as mt-[13px], text-[#273847], or w-[437px] that duplicate or bypass established spacing, color, sizing, or design tokens. Apply this rule only where Tailwind is configured.
Treat a confirmed occurrence as significant because repeated arbitrary values can create visual drift and make design-system changes difficult to apply consistently.
For example, treat the following pattern as evidence to investigate: Multiple components introduce slightly different arbitrary blue colors even though the configured Tailwind theme defines the intended color token.
Do not report a finding when the arbitrary value is required for a specific design, asset, or layout and does not bypass an available established token. Arbitrary values are not automatically violations.

## Verify Dynamically Generated Tailwind Classes

When reviewing this area, inspect the changed code for the following behavior: Class names generated from runtime data, such as `bg-${color}-500`, which may not be detected by Tailwind’s content scanning and production generation. The reviewer should expect static mappings, safelisting, or another configured supported mechanism.
Treat a confirmed occurrence as significant because a dynamic class can appear plausible in source while its corresponding CSS is absent from the production output.
For example, treat the following pattern as evidence to investigate: API-provided colors are interpolated directly into Tailwind class names without a static mapping of allowed classes.
Do not report a finding when tailwind is not in use, or every supported dynamic value is explicitly represented through the project’s configured scanning or safelist mechanism.

## Avoid Excessive ClassName Complexity

When reviewing this area, inspect the changed code for the following behavior: Conditional utility expressions that become difficult to read, modify, or verify because many independent branches are assembled into one className. The reviewer should suggest a clearer local pattern only when it materially improves comprehension.
Treat a confirmed occurrence as significant because dense conditional class composition can conceal mutually conflicting styles and make visual states hard to reason about during review.
For example, treat the following pattern as evidence to investigate: A className contains several nested ternaries for unrelated visual states, producing a long expression that cannot be understood without manually evaluating many branches.
Do not report a finding when a long but straightforward class list or a small conditional is clearer than introducing a helper abstraction.

## Maintain Responsive Behavior in Utility Classes

When reviewing this area, inspect the changed code for the following behavior: Utility-class changes that apply a desktop-oriented layout at every breakpoint, use inconsistent responsive modifiers, or leave required controls inaccessible on mobile, tablet, or desktop widths.
Treat a confirmed occurrence as significant because utility classes can make a component look correct at one viewport while clipping, crowding, or hiding essential interactions at another.
For example, treat the following pattern as evidence to investigate: A fixed multi-column grid is added without responsive modifiers, making controls unreadable or unreachable on narrow screens.
Do not report a finding when the route is explicitly restricted to a documented managed viewport or the unchanged layout already supplies an equivalent responsive behavior.

## Require Intentional, Consistent Abstractions

When reviewing this area, inspect the changed code for the following behavior: Generic helper layers, hooks, wrappers, or utility functions added without consumers, clear responsibility, or consistency with nearby patterns. The reviewer should be especially alert to code that appears sophisticated but adds indirection without reducing duplication or clarifying behavior.
Treat a confirmed occurrence as significant because over-engineered abstractions increase cognitive load, obscure defects, and make future work slower.
For example, treat the following pattern as evidence to investigate: A one-use hook wraps a single state value and forwards it unchanged through several generic helper functions.
Do not report a finding when the abstraction establishes a documented boundary, simplifies a complex contract, or has clear reuse expected by the product architecture.

## Test Important User Flows

When reviewing this area, inspect the changed code for the following behavior: Changed workflows with meaningful user outcomes that have no appropriate automated coverage despite compatible test infrastructure. The reviewer should prioritize task completion, interaction, and observable outcomes over a blanket component-count target.
Treat a confirmed occurrence as significant because critical regressions in navigation, submission, destructive actions, and conditional user flows can reach production even when isolated implementation units appear correct.
For example, treat the following pattern as evidence to investigate: A new account-deletion confirmation flow has no test confirming that cancellation prevents deletion and confirmation reaches the expected success state.
Do not report a finding when equivalent user-visible behavior is already covered at the appropriate level, the change is low-risk presentation only, or the repository has no compatible test setup.

## Test Error and Loading States

When reviewing this area, inspect the changed code for the following behavior: Asynchronous behavior that adds or changes loading, empty, retry, and error paths without tests for the user-visible state transitions that carry material risk.
Treat a confirmed occurrence as significant because happy-path-only tests often miss stuck pending states, invisible failures, and inaccessible recovery behavior.
For example, treat the following pattern as evidence to investigate: A data screen tests a successful response but not the error message or retry action shown when the request fails.
Do not report a finding when the state is already covered through an equivalent integration or end-to-end test, or the change cannot alter the relevant asynchronous behavior.

## Test Permission and Authorization States

When reviewing this area, inspect the changed code for the following behavior: UI behavior that varies by authentication, role, ownership, or access state and lacks tests for the relevant allowed and denied outcomes.
Treat a confirmed occurrence as significant because permission regressions can expose confusing navigation, broken recovery paths, or dangerous assumptions that a hidden UI control enforces access.
For example, treat the following pattern as evidence to investigate: A route guard is changed but tests cover only the authenticated administrator path and not the unauthorized fallback.
Do not report a finding when the changed behavior is already exercised by equivalent tests, or permissions are not relevant to the edited code.

## Avoid Testing Implementation Details

When reviewing this area, inspect the changed code for the following behavior: Tests that depend on private helpers, internal state, hook invocation counts, CSS implementation details, or component structure when a user-visible assertion would verify the intended behavior more reliably.
Treat a confirmed occurrence as significant because implementation-coupled tests become brittle during safe refactors and can pass while the user-facing workflow is broken.
For example, treat the following pattern as evidence to investigate: A test directly calls a local helper for a destructive dialog instead of checking that cancelling the dialog prevents the mutation.
Do not report a finding when a narrow implementation-level test is needed for a pure complex algorithm or a boundary that cannot be adequately exercised through the user interface.

## Do Not Duplicate Existing Coverage Without New Risk

When reviewing this area, inspect the changed code for the following behavior: New tests that repeat an existing assertion at the same level without covering changed behavior, a new failure mode, or a distinct regression risk.
Treat a confirmed occurrence as significant because redundant tests increase maintenance burden and slow feedback without materially improving confidence.
For example, treat the following pattern as evidence to investigate: A new test repeats an existing render assertion after an unrelated component refactor but does not exercise the changed interaction.
Do not report a finding when the additional test covers a meaningful regression boundary, documents a distinct contract, or provides independent end-to-end assurance for a critical workflow.

## Respect Existing Architectural Boundaries

When reviewing this area, inspect the changed code for the following behavior: New code that bypasses established boundaries between presentation components, API services, data hooks, domain logic, and shared infrastructure. The reviewer should infer local patterns from the repository instead of prescribing an architecture it does not use.
Treat a confirmed occurrence as significant because boundary bypassing scatters integration logic, creates inconsistent error and caching behavior, and makes system-wide changes harder to apply.
For example, treat the following pattern as evidence to investigate: A reusable UI component directly calls the backend even though the surrounding application consistently performs requests through a service or data hook layer.
Do not report a finding when the repository has no established boundary for the concern, or a local implementation is intentionally simpler and remains cohesive.

## Avoid Circular Dependencies

When reviewing this area, inspect the changed code for the following behavior: Imports that form direct or indirect cycles between components, hooks, services, shared utilities, or barrel exports. The reviewer should distinguish a demonstrated cycle from a speculative concern.
Treat a confirmed occurrence as significant because circular dependencies can create partially initialized modules, confusing build behavior, brittle tests, and runtime failures that vary by bundler.
For example, treat the following pattern as evidence to investigate: Module A imports B, B imports C, and C imports A through an index module.
Do not report a finding when dependency analysis shows no cycle, or the build system has a documented and safe arrangement for the specific module relationship.

## Keep Business Logic Out of Pure Presentation Components

When reviewing this area, inspect the changed code for the following behavior: Reusable visual components accumulating API requests, large data transformations, business calculations, or permission decisions when the existing architecture separates those responsibilities into containers, hooks, services, or domain modules.
Treat a confirmed occurrence as significant because mixing domain behavior into a presentation primitive reduces reuse, complicates testing, and makes visual changes unexpectedly risky.
For example, treat the following pattern as evidence to investigate: A generic table-row component fetches records, calculates pricing rules, and decides access policy while rendering its cells.
Do not report a finding when the component is intentionally a cohesive feature boundary rather than a pure presentational primitive, or the repository deliberately co-locates the logic and it remains small and clear.

## Use Stable Keys for Reconciled Collections

When reviewing this area, inspect the changed code for the following behavior: Array rendering that uses array indexes as keys when list order can change, duplicate keys, or keys generated during render. The reviewer should expect a stable identity that represents the item across inserts, removals, filtering, and sorting.
Treat a confirmed occurrence as significant because unstable keys make React preserve the wrong component instance, causing incorrect field values, focus, animation, and local state.
For example, treat the following pattern as evidence to investigate: items.map((item, index) => <Row key={index} ... />) is used for a sortable editable list.
Do not report a finding when the list is static, never reordered or filtered, has no stateful children, and no stable identity exists.

## Provide Error Boundaries for Isolated UI Failures

When reviewing this area, inspect the changed code for the following behavior: Routes or complex independently failing regions that can throw during rendering with no suitable error boundary or recovery view. The reviewer should favor boundaries around meaningful recovery units rather than one boundary around every component.
Treat a confirmed occurrence as significant because an unhandled render error can blank the entire application and prevent users from navigating to a safe area.
For example, treat the following pattern as evidence to investigate: A route rendering third-party visualization code has no boundary, so one malformed rendering path crashes the whole application shell.
Do not report a finding when a higher-level boundary already provides an appropriate fallback and recovery behavior for the region.

## Validate Client-Exposed Configuration

When reviewing this area, inspect the changed code for the following behavior: Browser modules that assume server runtime environment access, configuration values that are not validated before use, or private values included in the client bundle. The reviewer should check that the project’s configured build and runtime conventions expose only intentionally public values to browser code.
Treat a confirmed occurrence as significant because misunderstanding client configuration behavior causes missing configuration in production and can accidentally expose sensitive values.
For example, treat the following pattern as evidence to investigate: A browser component reads a privileged API token from client-side configuration and assumes the bundled value is private.
Do not report a finding when the code runs in a verified server-side or build-time context rather than the browser bundle.

## Honor the Active Styling Toolchain's Build Constraints

When reviewing this area, inspect the changed code for the following behavior: Styling expressions, generated class names, asset references, or theme values that rely on behavior the configured styling toolchain cannot resolve in a production build. The reviewer should verify the project-specific mechanism for making dynamic visual states available, such as static mappings, explicitly generated assets, documented configuration, or supported runtime variables.
Treat a confirmed occurrence as significant because styling or assets that cannot be resolved by the production pipeline can make a feature appear correct in development but incomplete or unstyled after build or deployment.
For example, treat the following pattern as evidence to investigate: A component derives visual class names directly from arbitrary API data even though the active styling pipeline only emits known, configured styles.
Do not report a finding when the project does not use a style-generation process with such constraints, or all supported dynamic values are explicitly represented through the configured tooling.

## Test User-Visible Behavior and Important Failure Paths

When reviewing this area, inspect the changed code for the following behavior: New behavior with no meaningful automated test where the project has test infrastructure, tests that only assert implementation internals, and missing coverage of changed loading, error, permission, or recovery paths. The reviewer should prefer tests that exercise the interface as a user would.
Treat a confirmed occurrence as significant because internal implementation tests become brittle while important regressions in asynchronous or conditional behavior go undetected.
For example, treat the following pattern as evidence to investigate: A new destructive dialog has a test that calls a private helper but no test confirming cancellation prevents the mutation.
Do not report a finding when the repository intentionally has no compatible automated-test setup, the change is purely presentational and low risk, or equivalent behavior is already covered at the appropriate level.

## Keep Dependency Changes Minimal, Maintained, and Reproducible

When reviewing this area, inspect the changed code for the following behavior: New packages that duplicate existing capabilities, unpinned or inconsistent lockfile updates, abandoned packages, and dependencies added for trivial utilities. The reviewer should assess maintenance, bundle, license, and security implications in proportion to the dependency’s role.
Treat a confirmed occurrence as significant because every dependency expands the supply-chain surface, upgrade burden, and potential client bundle size.
For example, treat the following pattern as evidence to investigate: A package is added solely to format a value that can be handled by a standard browser API or an existing dependency.
Do not report a finding when the package provides substantial, maintained functionality that the project genuinely needs and cannot reasonably provide with its existing tools.

## Reserve Layout Space and Accessible Text for Meaningful Media

When reviewing this area, inspect the changed code for the following behavior: Images without meaningful alt text, decorative images announced to assistive technology, missing intrinsic dimensions or aspect ratio that causes layout shift, and large assets loaded when not needed. The reviewer should distinguish meaningful content images from decoration.
Treat a confirmed occurrence as significant because poor media handling harms accessibility, causes visual instability, and delays rendering.
For example, treat the following pattern as evidence to investigate: A product image is rendered without alt, width, height, or an aspect-ratio container, causing content to shift after load.
Do not report a finding when the image is intentionally decorative and uses an empty alt value or another correct presentation-only treatment.

## Version and Validate Persisted Browser State

When reviewing this area, inspect the changed code for the following behavior: Local storage, session storage, or IndexedDB values read as if they always match the current application shape; unguarded JSON parsing; and persisted state containing data that should not survive a session. The reviewer should expect safe parsing, migration or invalidation rules, and appropriate storage lifetime.
Treat a confirmed occurrence as significant because old or corrupted client state can crash startup, restore invalid UI, or retain information longer than intended.
For example, treat the following pattern as evidence to investigate: An application parses a saved filter object without try/catch and assumes all current fields exist.
Do not report a finding when the stored value is trivially recoverable and malformed input is already safely ignored with a documented default.

## Review Completion

After applying all applicable instructions, report only concrete, supported findings. Do not manufacture findings merely to produce output. If the changed code does not violate any applicable instruction, state that no applicable issues were identified. Keep findings focused on the pull request and use surrounding code only when necessary to understand the changed behavior.
