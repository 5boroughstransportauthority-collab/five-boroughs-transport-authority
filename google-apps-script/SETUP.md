# Free Google Apps Script form setup

The website stays on GitHub Pages. This separate Google web app receives contact messages and comments and emails them to **Info@fiveboroughstransportauthority.com**. Nothing is deployed or authorized by extracting this ZIP.

## Current setup status

The owner has completed authorization and deployed **FBTA Website Forms v1**. The supplied `assets/config.js` now contains the verified public deployment URL. The two approved contact/comment tests were received in the business inbox, and a browser from a local preview read an existing acknowledgement through Google's redirect. No repeat login, new project or second deployment is required. The remaining website check is an end-to-end submission from the eventual GitHub Pages HTTPS address. The setup instructions below are retained for maintenance and recovery.

## Cost and limits

Google currently allows consumer accounts 100 Apps Script email recipients per day, shared with the owner's other scripts. Quotas reset 24 hours after the first request and can change. This code also caps attempted sends at 100 in a rolling 24-hour window, 10 in 10 minutes, and one per supplied email address per minute. It uses one fixed recipient and sends no autoresponders. Available capacity can therefore be lower than 100. This is a no-subscription option within Google's free quotas, not unlimited email or a delivery guarantee.

## Set up the Google receiver

1. Open https://script.google.com/home in your browser. On a phone, use the browser's **Desktop site** option if the editor controls are cramped. Sign in with the Google account you want to own the form service.
2. Choose **New project**. Name it **FBTA Website Forms**. In the editor, replace the default contents of **Code.gs** with the entire supplied `google-apps-script/Code.gs` file. Save.
3. In **Project Settings**, enable **Show "appsscript.json" manifest file in editor**. Return to the editor and replace that manifest with the supplied `google-apps-script/appsscript.json`. Save. This explicitly limits the requested Google permission to sending email.
4. Select **authorizeFBTA** from the function selector and choose **Run**. Google will ask the owner to authorize sending email. This function checks the remaining quota; it sends nothing. Verify that the project is your own and the permission is for sending email. This implementation does not request permission to read Gmail, access Drive or edit Sheets. If Google or your organization blocks authorization, stop and report the displayed message rather than changing security settings.
5. Choose **Deploy → New deployment**. Select the gear/type selector and **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. This makes the form endpoint publicly callable while the fixed recipient and server validation remain enforced. Choose **Deploy**. Organization policy may prevent anonymous web apps; if “Anyone” is unavailable, this account cannot use this flow as written.
6. Copy the **Web app URL** ending in `/exec`, such as `https://script.google.com/macros/s/DEPLOYMENT_ID/exec`. Do not use the editor address, a `/dev` test URL, or the temporary `script.googleusercontent.com` response URL. The deployment URL is public configuration, not an account password.
7. Provide that public URL so it can be inserted into `assets/config.js` as `formEndpoint`. Leave `commentEndpoint` empty to route comments through the same receiver. Do not change the recipient in the script or put a Google password, OAuth token or private recovery email into the website.
8. Open the deployed URL in a signed-out/private browser window. Expected read-only health result: `{"protocol":"fbta-contact-v1","ready":true}`. This confirms public access only; it does **not** test MailApp permissions or inbox delivery.
9. Test a synthetic contact message from the intended HTTPS website origin after configuration, confirm receipt in the business inbox (and check spam), then test a comment and an outgoing reply. Only a real browser test can confirm Google's redirect/CORS behavior and only inbox inspection can confirm delivery. No real email has been sent in the supplied local tests.

The notification sender is the Google account that owns the deployment; the destination remains the public business inbox. The reply-to address is the visitor's unverified address. The owner account is not embedded in website source. A notice from Google may identify the deployment's owner; review the deployed visitor experience before publishing.

Keep TK WebHosts and existing email/DNS arrangements until mailbox continuity is verified. This receiver does not create or replace the business mailbox.

## How the included code behaves

- Sends plain-text email only, with a fixed subject prefix and recipient. Visitor-supplied recipients, CC/BCC, HTML bodies, sheet names, unknown fields, duplicate parameters and header control characters are rejected.
- Preserves original contact fields. Name and email are required; the original optional contact-message behavior is retained. Comments require text and go to the owner for review, without public posting.
- Allows only a public HTTPS Apps Script `/exec` endpoint. The browser follows Google's ContentService redirect, requires a readable JSON response matching the protocol and request ID, and never uses `no-cors` or JSONP to pretend a send succeeded.
- Uses a 30-second browser timeout. Failures keep the entered text and display the business email/phone fallback. Accepted by Google does not mean delivered to the recipient's inbox.
- Prevents duplicate clicks. Unchanged retries in the same loaded form reuse a random request ID. Server records suppress repeated sends for 48 hours, including ambiguous mail failures. Reloading the page or editing the message creates a new ID; deduplication does not span that change.
- Saves only request IDs, timestamps, SHA-256 hashes of normalized submissions and sender addresses, and delivery state in private Script Properties. These are pseudonymous metadata, not anonymous data. Expired records are removed when the next valid submission is processed. Message bodies are not stored in Sheets or explicitly written to execution logs; Google and the recipient's mail provider process the submitted message.
- Uses a server-side honeypot and global/per-address limits. These are basic abuse controls, not human verification. An attacker can rotate email addresses and consume the shared quota or execution capacity. There is no CAPTCHA or IP-based control in this version, no durable retry queue, and no uptime guarantee. Monitor usage before relying on it for time-sensitive enquiries.

## Update, disable and diagnose

Code changes in the editor do not update a versioned deployment automatically. Use **Deploy → Manage deployments → Edit → New version → Deploy** to retain the same endpoint. Do not publish a second receiver accidentally.

To stop public form processing, archive the deployment in Google and clear `formEndpoint` in the website. To revoke its email permission, review the project's access in your Google account. Do not erase pending deduplication records to force a retry: an earlier email may already have been accepted.

- Sign-in HTML instead of JSON: check **Anyone** access, the owner authorization, the `/exec` URL and the deployed version.
- Health JSON works but browser form fails: inspect the actual POST response and browser console; verify the current deployed code, manifest and the site's Google connection policy. Do not replace readable responses with `no-cors`.
- “Temporarily busy”: wait for the rate window. Email or call for urgent requests.
- “Could not confirm”: preserve the text, check the business inbox before manually resending, and investigate Apps Script execution status without sharing message bodies or credentials.
- Successful acknowledgement without inbox arrival: check spam, mailbox status and mail routing. Do not treat acknowledgement as proof of delivery.

Official references (checked 3 November 2026):
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/guides/content
- https://developers.google.com/apps-script/reference/mail/mail-app
- https://developers.google.com/apps-script/guides/services/quotas
- https://developers.google.com/apps-script/guides/properties
