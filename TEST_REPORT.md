# FBTA reconstruction and test report

Test date: 3 November 2026 (America/New_York). Scope: reconstructed static files, the deployed Google receiver, two approved synthetic emails, and one browser acknowledgement from a local preview. No domain change or GitHub publication was performed.

## Result

**The static reconstruction passed the checks below, and the live form receiver is now connected.** The three original font families are restored. Google authorization, public deployment access and receipt of both approved test emails are verified. A real browser read the redirected acknowledgement from a local preview. GitHub Pages deployment testing, outgoing business-mail verification and email-hosting continuity remain outstanding. This report does not certify the website as fully secure or visually identical to the original.

| Check | Observed result |
|---|---|
| Published public content recovered | 53 pages: 24 WordPress pages, 3 posts, 6 services, 8 testimonials, 6 team profiles, 6 FAQ entries |
| Compatibility routes | 7 static aliases plus a 404 page; 61 HTML files in total |
| Responsive rendering | All 53 content pages rendered at 390, 768 and 1440 CSS pixels: 159/159 passed |
| Restored original font families | Kumbh Sans, Catamaran and Caveat load successfully; no font-load errors in the final responsive run |
| Rendered image checks | No broken images or image aspect-ratio distortion detected in those runs |
| Layout checks | No visible right-edge overflow detected in the checked content/header/footer regions; intentional carousel scrolling and hidden elements excluded |
| JavaScript | No site errors captured during the rendered checks; authored scripts passed Node syntax checks; browser-extension errors excluded |
| Interactions | 15/15 checks passed; details below |
| Google form adapter and restored-font checks | 54/54 passed with simulated responses, covering all six contact and all three comment instances; no external delivery attempted during those simulated checks |
| Google receiver logic | 56/56 passed in a Node VM with mocked Apps Script services; those checks remain distinct from the live results below |
| Live Google receiver | Version 1 deployed; anonymous health GET succeeded; incomplete POST correctly rejected |
| Real email delivery | Two approved synthetic messages accepted by the receiver and confirmed in the business inbox by matching reference numbers |
| Live browser acknowledgement | HTTP 200, readable CORS JSON and matching acknowledgement after Google's redirect; tested from a local HTTP preview by replaying the accepted contact request |
| Configured forms after connection | 9/9 forms across eight pages loaded the exact deployed endpoint in a real browser; initialized successfully with no form submissions |
| Local links/assets | Final counts and zero unresolved references recorded in `VERIFICATION_SUMMARY.json` |
| Original media/font provenance | All 100 selected original assets match the backup byte-for-byte by SHA-256 |
| Authorized font restoration | 11 official Google Fonts binaries, 397,192 bytes, with local CSS and three OFL license files; provenance recorded separately |
| Public email DNS | MX independently agrees across Google and Cloudflare DNS; SPF, DMARC and nameservers recorded in `EMAIL_CHECK_REPORT.md` |
| Secret-value scan | No matches for 16 recovered secrets/password hashes in the reconstructed files |
| Code/injection scan | No checked PHP, eval/Function/base64 loader, document.write, private-email, old-admin-email, private-key or identified-loader signatures found in production files |
| Backup preservation | Original archive SHA-256 unchanged |

## What works and what remains unavailable

Working locally: original primary/footer navigation and recovered page links; responsive mobile menu; sticky header; hero/testimonial slide controls and automatic rotation; service/partner carousels; native FAQ expansion; client-side public-content search; public email/telephone links; original Google Maps embed; original animated logo/preloader with a bounded dismissal; back-to-top control; form validation and truthful failure notices.

The 15 interaction checks exercised mobile-menu open/close and its eight links; hero next/previous; empty-required-field rejection; a filled form reporting “not sent”; retention of entered data; an empty backend configuration; FAQ close/reopen; search match/no-match behavior; retention of the comment form; and disabled comment delivery.

The 54 browser checks covered duplicate clicks, button/busy state, Google HTTPS POST construction, URL-encoded fields, readable CORS responses, omitted credentials, following the ContentService redirect, protocol/request-ID acknowledgement matching, retention after failed or ambiguous sends, reused IDs for unchanged retries, new IDs for changed text, HTTP/JSON/network/timeout/authentication failures, rejected endpoints, honeypot handling, validation, original fonts, and all six contact plus all three comment instances. Browser requests were replaced with synthetic local responses. Those simulated checks alone do not prove Google's actual cross-origin headers, authorization or delivery behavior; the separate live checks below provide the observed evidence.

The 56 receiver checks exercised fixed-recipient plain-text delivery, original optional fields, contact/comment labels, strict field and size validation, duplicate and unknown parameters, header injection, server honeypot, quotas, burst/cooldown limits, lock contention, deduplication, changed-payload conflicts, ambiguous mail/storage failures, metadata privacy and cleanup, and fail-closed handling of corrupt state. Apps Script services were mocked in a Node VM; no untrusted backup code was executed and no real message was sent.

Live Apps Script execution, owner authorization, anonymous deployment access and receipt of both approved emails are now verified. The public `/exec` URL is configured in `assets/config.js`; the empty `commentEndpoint` intentionally reuses `formEndpoint`. The local-preview browser test used the existing accepted contact request and received HTTP 200 with a readable CORS acknowledgement from `script.googleusercontent.com`. This was not an end-to-end submission from the intended GitHub Pages HTTPS origin. That hosted-origin test and outgoing business-mail delivery remain outstanding. Comments are delivered for manual review and are never automatically published. The receiver has a server-side honeypot and basic global/per-address rate controls, but no CAPTCHA or IP-based protection. An attacker can consume the shared quota; there is no guaranteed uptime or durable retry queue. Setup, current free quotas, exact limits, metadata retention and failure handling are described in `google-apps-script/SETUP.md`.

The form definitions were recovered from Contact Form 7 data. Form 452 uses `text-463` (name), `email-762` (email), `text-464` (phone), `text-465` (subject), `textarea-290` (message). Form 668 uses `text-938` (name), `email-901` (email), `text-937` (phone), `textarea-915` (message). These produce six contact-form instances on five pages. The new adapter translates these fields to `name`, `email`, `phone`, `subject` and `message` for the Google receiver; a hidden `_gotcha` field is checked by both the browser and server. Three post pages retain comment forms, and three post sidebars contain local search forms. Comments may reuse the contact endpoint and are explicitly labelled for review. The unused third legacy form definition was not added to any page.

Applications link to the public business email specified by the owner. The private recovery address is absent from all delivered files. Calls and email links have correct public targets. The two approved synthetic backend messages were received; actual call placement, direct application-link delivery and outgoing business-mail replies were not tested.

## Live form verification

The owner deployed **FBTA Website Forms v1** as a web app executing as the owner with access set to Anyone. The separate runtime authorization requested only permission to send email. The exact public deployment URL is in `assets/config.js`.

- Anonymous health response: `{"protocol":"fbta-contact-v1","ready":true}`.
- Incomplete POST: rejected with `ok: false` and `code: invalid`; no email sent by that check.
- Contact request `76e4f2b1-7560-4cdc-bd47-1ae42503b4e6`: accepted by the app at approximately 10:20 PM and matched in the owner's received-message screenshot.
- Comment request `4f50af34-e092-4bde-9d99-a87404573eee`: accepted by the app at approximately 10:20 PM and matched in the owner's received-message screenshot.
- Browser check: reused the accepted contact ID and unchanged payload within the receiver's duplicate-protection period. An actual browser from the local preview received HTTP 200, response type `cors`, the expected protocol/request ID and `code: accepted`. The final response origin was `https://script.googleusercontent.com`.

Only the two approved synthetic messages were newly submitted for delivery. Their reply addresses use `example.com` placeholders; they must not be used to test replies. Inbox screenshots are evidence retained privately and are not included in this public package. The receiver code and manifest were not changed during these live checks.

## Recovery and security findings

The authoritative source was `backup-11.2.2026_01-36-55_fiveboroughstran.tar.gz`. The secondary `FBTA_wp-content_CLEANED.zip` was inspected as reference only, not trusted as a safe deployment source. No original PHP was executed, and no database was started or imported into a server.

Confirmed in the original source:

- Injection stubs in `wp-content/mu-plugins/post.php` and `config.php`, and in several other upload/theme/root files. Seventeen files matched the specific injection-stub pattern used in this inspection; this is not an exhaustive malware count. Nineteen extracted regular PHP files were present inside uploads.
- The `wp-core-kit-0wej` plugin presented itself as “WordPress Security” but included hidden administration controls, token-protected remote configuration endpoints, and an external full-screen overlay capability. The complete plugin and all other original executable scripts were excluded.
- `smooth-wrapper-live` and related loader directories existed, but were empty in the available backup. Their presence is confirmed; no missing payload is claimed to have been inspected.
- An unexpected administrator email was present, and four accounts had administrator capabilities. These settings/accounts were not transferred. The inspection cannot determine which individual accounts were authorized.
- A custom CSS rule concealed an administrator row. It was removed.
- Two unrelated published posts about a third-party WordPress promotion were excluded as suspicious content. All 361 database comments were unapproved; none were published in the replacement.

The replacement contains no PHP, database dump, WordPress administrator configuration, old plugin/theme JavaScript, credentials, original backup, quarantine material or old hosting configuration. Original media/font files were selectively copied; rich content was sanitized; interactions use newly authored JavaScript. Only selected theme styles and Elementor layout data were translated/reused after inspection. No new stock photos, illustrations or branding were sourced.

Production pages have a restrictive meta Content Security Policy: local scripts and fonts, local/data images, Google Maps frames only, no object embeds and no native form actions. Network submission is allowed only to `https://script.google.com` and `https://script.googleusercontent.com`; the adapter requires an HTTPS `script.google.com/macros/s/DEPLOYMENT_ID/exec` endpoint without credentials, query parameters or a fragment. The second host is required for Google's ContentService response redirect. Readable JSON acknowledgement is required; opaque responses are never treated as success. No request is sent while the endpoint configuration is empty. Inline style support remains necessary for the recovered layout. The policy does not isolate code already served from the same origin and is not a substitute for controlling repository access.

The only currently active external embedded dependency is the recovered Google Maps iframe, which loaded during the contact-page check. Google controls resources inside its iframe. Google Apps Script, its ContentService redirect and MailApp are external processing dependencies for the configured forms. The original footer credit links to TK WebHosts; it does not load a remote script. No external JavaScript or remote font stylesheet is used. Outbound destination ownership and future availability are outside this audit.

Security results are scoped to selective source review, sanitization, file-type restrictions, hashes and pattern/known-secret scans. There was no exhaustive forensic attribution, third-party penetration test, antivirus certification, live-account review or guarantee against all unknown payloads. The compromised hosting environment itself has not been remediated by creating this ZIP.

## Appearance, content and testing limits

The reconstruction used the original theme's CSS, Elementor section/widget data, menu data, original images, local font/icon files and page text. The recovered source defined 27 widget types; the reconstruction supplies static renderers for those types. Responsive rules and image proportions were retained or translated to the static markup.

No original browser screenshots were available for a side-by-side comparison. Visual spot-checks of the reconstructed homepage, About page, job listings, contact layout and service details supplemented the automated checks. After font restoration, the homepage and contact page were visually checked again. All 159 page sizes were rerun after the Google form adapter and connection-policy change, with zero reported findings. Layout success is not proof of pixel-identical rendering.

Kumbh Sans, Catamaran and Caveat font binaries were absent from both supplied archives. Following the owner's authorization, the original theme's exact font families and weight ranges were obtained from official Google Fonts and installed locally with their licenses. They no longer fall back merely because the font files are missing. The historical binary versions used by the original live site cannot be established. Roboto/Roboto Slab and icon fonts present in the backup were preserved where used. `ASSET_PROVENANCE.json` distinguishes unchanged backup assets from the newly retrieved original font families.

The original backup itself contained published demonstration/template pages, old alternate layouts, “Coming soon” content, placeholder text, and inconsistent availability/marketing statements. They were retained at their recovered paths rather than silently rewritten. Their accuracy, service availability, named profiles and testimonials were not independently verified. The page inventory below makes this content reviewable.

The original unused Owl video control image was absent. Its unused CSS resource reference was removed; no recovered active video player required it. Old WordPress administration, feeds, REST endpoints, arbitrary query-string routes, database search and unpublished/private revisions are not reproduced. Internal recovered query links were translated to static page paths. The site is a static public-content replacement, not a WordPress runtime.

Tests ran in one Chromium environment, using iframe viewport widths for phone/tablet/desktop checks. No physical Samsung device, Safari/Firefox session, live GitHub Pages origin, accessibility certification or performance benchmark was tested. Browser events occurring before per-frame error listeners attach may not be captured; interaction checks and syntax checks provide additional coverage. Lazy images were eagerly decoded for broken-image testing.

The original backup SHA-256 is:

`1c995ba461f532292593ee23f72911e1b74522fb5d66d1ddddd8d85c4047366a`

Deployment instructions and required backend configuration are in `README.md`.

## Recovered page inventory

Paths below are relative to the eventual GitHub Pages site root. Original unusual slugs are retained.

| Page | Path | Source type |
|---|---|---|
| Privacy Policy | `/privacy-policy/` | page |
| Home Page 01 | `/` | page |
| About Block 01 | `/about-block-01/` | page |
| Fleet | `/fleet/` | page |
| Service Block 01 | `/service-block-01/` | page |
| Our Services | `/services/` | page |
| Service Block 03 | `/service-block-03/` | page |
| Contact Block | `/contact-block/` | page |
| View All Services | `/view-all-services/` | page |
| Testimonials Block 02 | `/testimonials-block-02/` | page |
| FAQ'S Block 01 | `/faqs-block-01/` | page |
| Partner Block 01 | `/partner-block-01/` | page |
| Non-emergency Medical Transportation | `/non-emergency-medical-transportation/` | page |
| Wheelchair Van Transportation | `/wheelchair-van-transportation/` | page |
| Our Services | `/general-services/` | page |
| About Us | `/about-our-company/` | page |
| Team | `/team/` | page |
| Testimonials | `/testimonials/` | page |
| FAQ’s | `/faqs/` | page |
| Job Listings3 | `/job-listings-3/` | page |
| Blog Style 03 | `/blog-style-03/` | page |
| Contact | `/contact/` | page |
| Career Opportunities | `/service/random/` | service |
| Wheelchair Accessible Transportation | `/service/medical-flight-services/` | service |
| Non-emergency Medical Transportation. | `/service/medical-escort/` | service |
| Verified by Our Clients | `/testimonials/what-they-say/` | testimonials |
| On Time, Every Time | `/testimonials/nullam-eu-ullamcorper/` | testimonials |
| Jessica Brown | `/team/jessica-brown/` | team |
| Kevin Martin | `/team/kevin-martin/` | team |
| Sarah Albert | `/team/sarah-albert/` | team |
| David Cooper | `/team/david-cooper/` | team |
| Aleesha Brown | `/team/aleesha-brown/` | team |
| Andrew .J | `/team/mike-hardson/` | team |
| Albert .L | `/testimonials/sarah-albert/` | testimonials |
| Sandra .P | `/testimonials/cameron-lee/` | testimonials |
| Interdum et malesuada fames ac ante ipsum | `/faqs/interdum-et-malesuada-fames-ac-ante-ipsum/` | faqs |
| Maecenas condimentum sollicitudin ligula, | `/faqs/maecenas-condimentum-sollicitudin-ligula/` | faqs |
| Duis rhoncus orci ut metus rhoncus | `/faqs/duis-rhoncus-orci-ut-metus-rhoncus/` | faqs |
| n in libero sit amet tellus porttitor egestas | `/faqs/n-in-libero-sit-amet-tellus-porttitor-egestas/` | faqs |
| Mauris sed magna vel odio dictum | `/faqs/mauris-sed-magna-vel-odio-dictum/` | faqs |
| Proin ultricies rhoncus neque id dignissim | `/faqs/proin-ultricies-rhoncus-neque-id-dignissim/` | faqs |
| Private Air Ambulance | `/service/private-air-ambulance/` | service |
| Regular Treatment Rides | `/service/advance-life-support/` | service |
| Coming Soon... | `/service/general-services/` | service |
| Felix .G | `/testimonials/lora-fenty/` | testimonials |
| Peter D. | `/testimonials/john-peter/` | testimonials |
| John Doe | `/testimonials/robert-doe/` | testimonials |
| Andrew C | `/testimonials/david-clay/` | testimonials |
| Vehicle Operator - Ambulette | `/vehicle-operator-ambulette/` | post |
| Dispatcher | `/tag-health/` | post |
| Coming soon | `/coming-soon/` | post |
| Home Page 01 | `/home-page-01-2/` | page |
| Job Listings | `/job-listings/` | page |
