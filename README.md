# FBTA static reconstruction

This archive contains the recovered public site as static HTML, CSS and JavaScript. Extract its contents directly into the root of a **new, separate repository**. There is no build step. `index.html`, `assets/` and `.nojekyll` must remain together.

**Status: form endpoint connected; ready for separate GitHub Pages deployment testing.** The Google receiver is authorized and deployed, both approved test emails were received, and a real browser read an acknowledgement from a local preview. The website is not yet published to GitHub Pages. This is not a claim of complete original functionality or exact visual equivalence. Read `TEST_REPORT.md` before publishing.

## Items that must be resolved

1. **Messages and comments:** The Google Apps Script receiver is authorized and deployed. `assets/config.js` contains the verified public `/exec` URL; comments reuse the same endpoint. One approved contact test and one approved comment test reached `Info@fiveboroughstransportauthority.com`, as confirmed by the owner's mailbox screenshots and matching reference numbers. A real browser from a local preview read Google's redirected JSON acknowledgement while reusing the accepted contact request. An end-to-end submission from the eventual GitHub Pages HTTPS address still needs testing. Email and telephone links remain available.
2. **Business email:** The DNS check recorded incoming mail routing to `pixel.tkwebhosts.com`. Receipt of both synthetic messages is now confirmed. Outgoing replies, account billing and whether mail survives cancellation of the web-hosting plan remain unverified. Keep the current hosting and email arrangements. See `EMAIL_CHECK_REPORT.md`.
3. **Content and appearance review:** Published legacy/template pages and existing wording were retained. Some contain placeholder text, conflicting availability statements, or unverified claims. Original browser screenshots were not available, so pixel-for-pixel equivalence cannot be certified. Page inventory and audit scope are in the report.

**Original fonts restored:** Kumbh Sans, Catamaran and Caveat now load locally. The exact families and requested weight ranges were recovered from the original theme; the missing binaries were obtained from official Google Fonts following the owner's authorization. These are current official releases, not provably the same historical binary versions. Licenses and provenance are included. No new image or branding was added.

## GitHub Pages deployment

These are the deployment settings for this archive, verified against GitHub's official documentation on 3 November 2026. No repository has been created, altered or published during reconstruction.

1. Download and extract this ZIP. Use a new folder; do not extract into the existing FBTA token project.
2. Create an empty GitHub repository for this website's deployment test. A suggested distinct name is `fbta-website`. Use the account's supported visibility/Pages plan; GitHub Free supports Pages from public repositories. The published website is public.
3. Commit the **extracted files**, including `.nojekyll`, to the new repository's `main` branch. Uploading only the ZIP will not publish a website. Do not include the original account backup, cleaned ZIP, database, quarantine files or credentials.
4. In that repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then **Save**.
5. Wait for the Pages deployment to finish. Open the site address shown by GitHub and test every primary menu link, a nested job page, mobile navigation, images, map, and approved form delivery on the actual HTTPS deployment.
6. Keep the **Custom domain** field empty during this test. This package contains no `CNAME`. Do not alter the live domain, MX/email records or cancel TK WebHosts yet.
7. Domain migration is a separate step after the hosted replacement and business email arrangements are verified.

For Termux, deployment commands should be issued **one at a time**, after confirming the downloaded ZIP's actual path and the new repository's exact URL. This prevents commands from running in the existing token project. Git, curl and unzip were already present in the supplied phone reference. No GitHub credentials belong in a pasted command or these public files. GitHub deployment commands have not yet been tested on the user's phone.

Official references:

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## Completing the form connection

Follow `google-apps-script/SETUP.md`. The archive includes the complete original receiver (`Code.gs`) and a manifest requesting only Google's email-sending permission. This code runs in the owner's Google Apps Script project, not on GitHub Pages. The `.gs` file is source code and contains no secret; publishing it in the repository does not deploy a backend.

The owner has authorized and deployed it as a public web app, and the supplied public `/exec` URL is configured in `assets/config.js`. No paid Formspree/FormSubmit account or secret frontend API key is required. Google's consumer quota is currently 100 email recipients per day, shared across the owner's scripts; the included receiver also imposes rate and daily caps. Free does not mean unlimited or guaranteed delivery.

The adapter preserves the recovered fields, follows Google's ContentService redirect, waits for a matching JSON acknowledgement, and retains entered text on failure. Comments go to the business inbox for review and are not published automatically. The earlier mocked tests remain separately identified in the report. Actual inbox delivery and a browser acknowledgement from a local preview are now verified; the eventual hosted website still requires its own submission test.

## Maintaining this site

Edit public text in the corresponding page's `index.html`. Recovered theme styles are in `assets/theme/`; compatibility and responsive adjustments are in `assets/layout.css`; original media and font assets are in `assets/original/`. Restored Google Fonts and their licenses are in `assets/restored-fonts/`. New interactions are in `assets/site.js`, with form handling in `assets/forms.js`. The client-side search index is `assets/search-index.js` and must be updated when public text changes. There is no WordPress dashboard or database dependency.

`ASSET_PROVENANCE.json` records SHA-256 hashes for the 100 original assets and the separately identified restored fonts. `SHA256SUMS.txt` records hashes for the delivered files, excluding itself. Keep the original backup separately and unchanged.
