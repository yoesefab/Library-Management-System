**Source visual truth**

- Existing authenticated shell: `artifacts/system-state-source.png`.
- The source establishes the sidebar and top navigation proportions, Manrope typography, neutral canvas, green action styling, compact density, borders, and responsive sidebar behavior.

**Implementation evidence**

- Unauthorized desktop state: `artifacts/unauthorized-desktop.png`.
- Not-found desktop state: `artifacts/not-found-desktop.png`.
- Unauthorized mobile state: `artifacts/unauthorized-mobile.png`.
- Not-found mobile state: `artifacts/not-found-mobile.png`.
- Full desktop comparison: `artifacts/system-states-comparison.png`.
- Mobile state comparison: `artifacts/system-states-mobile-comparison.png`.

**Viewport and normalization**

- Source and desktop implementations: browser viewport 1265 × 712 CSS px, captured content 1250 × 704 px, device scale factor 1.
- Mobile implementations: requested viewport 390 × 844 CSS px, captured content 375 × 812 px, device scale factor 1.
- States: authenticated user at `/app/unauthorized`, `/app/not-found`, and an arbitrary unknown `/app/ceci-nexiste-pas` route.

**Findings**

- No actionable P0, P1, or P2 mismatch remains.
- Fonts and typography: Manrope, heading hierarchy, compact uppercase error code, supporting copy, button weight, line height, and wrapping match the existing product language.
- Spacing and layout rhythm: the authenticated shell is preserved; centered 520 px cards, icon circles, generous whitespace, 10 px radius, and recovery-action spacing create simple states without visual noise.
- Colors and visual tokens: green remains the primary recovery action and 404 accent; the 403 uses a restrained amber semantic accent while retaining accessible text contrast.
- Image quality and asset fidelity: no raster imagery is needed. Existing Phosphor icons provide the state symbols and action arrow; no placeholder or handcrafted asset was introduced.
- Copy and content: the 403 clearly explains insufficient permission and offers an accessible catalogue route. The 404 explains the missing page and offers a dashboard return action.
- Accessibility: clear headings, labelled regions, native buttons, icon text pairing, visible focus treatment, responsive full-width mobile actions, and no page-level horizontal overflow are present.

**Focused region comparison**

- `artifacts/system-states-mobile-comparison.png` provides a readable focused comparison of both cards, their copy wrapping, action width, icon treatment, and shell behavior at the narrow breakpoint.

**Comparison history**

- The first complete desktop and mobile comparison found no P0/P1/P2 visual drift from the established shell, so no corrective visual iteration was required.

**Primary interactions tested**

- Opened `/app/unauthorized` directly and confirmed the 403 copy and recovery action.
- Used “Retourner au catalogue” and confirmed navigation to `/app/products`.
- Opened an arbitrary unknown authenticated route and confirmed the 404 state.
- Used “Retourner au tableau de bord” and confirmed navigation to `/app`.
- Opened `/app/not-found` directly.
- Verified both states at 390 × 844 with contained width and responsive full-width recovery actions.
- Checked browser console output: no error or warning entries.

**Implementation Checklist**

- Unauthorized explanation and accessible-page recovery: passed.
- Not-found explanation and dashboard recovery: passed.
- Direct routes and arbitrary missing routes: passed.
- Responsive authenticated shell: passed.
- Keyboard-visible focus and semantic structure: passed.

**Follow-up Polish**

- No P3 follow-up is required for this scope.

final result: passed
