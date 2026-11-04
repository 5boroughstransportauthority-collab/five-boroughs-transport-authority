# FBTA business-email verification

Public DNS was checked on 3 November 2026. Later that evening, two approved synthetic Google Apps Script messages were submitted and the owner provided mailbox screenshots confirming both receipts. The assistant did not log into the mailbox or change DNS.

## Verified current records

| Record | Observed value |
|---|---|
| MX | Priority 1: `pixel.tkwebhosts.com` |
| Mail-server IPv4 | `45.43.208.21` |
| Nameservers | `kellen.ns.cloudflare.com`, `grace.ns.cloudflare.com` |
| SPF | `v=spf1 include:mxroute.com -all` |
| DMARC | `v=DMARC1; p=reject; pct=100; sp=none; adkim=r; aspf=r; fo=1; rf=afrf; ri=3600;` |

Google Public DNS supplied the records above. Cloudflare's public DNS independently returned the same MX destination. These DNS observations establish the published routing and policy. Separate delivery evidence now confirms receipt of the two approved test messages; DNS can change after this check.

The `default._domainkey` selector returned no record. The account's actual DKIM selector is unknown, so this does **not** establish that DKIM is absent. A received test message's authentication headers or the current mail provider's settings are needed to verify signing.

## Migration consequence

The current MX points to a TK WebHosts-named server. DNS alone cannot establish the billing arrangement, who operates the underlying mailbox, whether the business address is a mailbox or forwarder, or whether email service continues after cancellation of a web-hosting subscription.

The old backup's DNS zone points mail to the main domain and contains a different SPF configuration. It is stale relative to the current public records. Do not restore that old zone during website migration. Moving the website to GitHub Pages does not create or migrate an email mailbox.

## Required account and receipt verification

1. Keep the current email hosting active and preserve its MX, SPF, DKIM and DMARC records during website testing.
2. The owner has shown receipt of both tests in the business webmail. Outgoing delivery still needs a separate test to a real owner-controlled address, followed by inspection of the received message's authentication results. The synthetic `example.com` reply addresses in these two tests are placeholders and must not be used for that reply test.
3. Confirm in the current provider account or with its support that business email is separately retained before canceling any web-hosting package. No support message was sent in this task.
4. Google receiver authorization and deployment are complete, its public `/exec` URL is configured, and both direct endpoint tests reached the inbox. A real browser read the existing acknowledgement from a local preview. A full submission from the eventual GitHub Pages HTTPS site remains to be tested. The Google sender account does not replace the existing business mailbox.

Status: **public DNS checked; contact and comment inbox receipts confirmed; outbound business-mail delivery and cancellation continuity remain unverified.** No old passwords, tokens or administrator accounts are required for the replacement website.

DNS query references:

- https://dns.google/resolve?name=fiveboroughstransportauthority.com&type=MX
- https://dns.google/resolve?name=fiveboroughstransportauthority.com&type=TXT
- https://dns.google/resolve?name=_dmarc.fiveboroughstransportauthority.com&type=TXT
- https://cloudflare-dns.com/dns-query?name=fiveboroughstransportauthority.com&type=MX
