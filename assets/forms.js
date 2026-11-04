"use strict";
(() => {
  const protocol = "fbta-contact-v1";
  const fallback = " Please email Info@fiveboroughstransportauthority.com or call 929-800-2024.";
  const aliases = {
    "text-463": "name", "email-762": "email", "text-464": "phone",
    "text-465": "subject", "textarea-290": "message",
    "text-938": "name", "email-901": "email", "text-937": "phone",
    "textarea-915": "message", "comment": "message"
  };
  const allowedFields = new Set(["name", "email", "phone", "subject", "message", "_gotcha"]);

  function endpointFor(form) {
    const config = window.FBTA_CONFIG || {};
    const value = form.dataset.formId === "comment"
      ? (config.commentEndpoint || config.formEndpoint || "") : (config.formEndpoint || "");
    if (!value) return null;
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "script.google.com" ||
        url.port || url.username || url.password || url.search || url.hash ||
        !/^\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(url.pathname)) {
      throw new Error("Invalid submission endpoint");
    }
    return url.href;
  }

  function newRequestId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
  }

  function payloadFor(form) {
    const result = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      const field = aliases[key] || key;
      if (typeof value === "string" && allowedFields.has(field)) result.set(field, value.trim());
    }
    result.set("protocol", protocol);
    result.set("source_form", form.dataset.formId || "");
    result.set("page", location.origin + location.pathname);
    return result;
  }

  document.querySelectorAll(".fbta-contact-form").forEach(form => {
    const status = form.querySelector(".form-status");
    const button = form.querySelector("button[type=submit]");
    if (!status || !button) return;
    let pending = false, previousPayload = "", requestId = "";
    const honeypot = document.createElement("input");
    honeypot.type = "text";
    honeypot.name = "_gotcha";
    honeypot.tabIndex = -1;
    honeypot.autocomplete = "off";
    honeypot.setAttribute("aria-hidden", "true");
    honeypot.className = "fbta-form-honeypot";
    form.append(honeypot);
    try { if (endpointFor(form)) status.textContent = ""; } catch {}

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (pending) return;
      if (!form.reportValidity()) {
        status.textContent = "Please complete the required fields and enter a valid email address.";
        return;
      }
      let endpoint;
      try { endpoint = endpointFor(form); } catch {}
      if (honeypot.value || !endpoint) {
        status.textContent = "Your message has not been sent." + fallback;
        return;
      }
      pending = true;
      button.disabled = true;
      form.setAttribute("aria-busy", "true");
      status.textContent = "Sending your message…";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      try {
        const payload = payloadFor(form);
        const signature = endpoint + "\n" + payload.toString();
        // Retry unchanged text with the same ID if the acknowledgement was lost.
        if (signature !== previousPayload || !requestId) {
          requestId = newRequestId();
          previousPayload = signature;
        }
        payload.set("request_id", requestId);
        const response = await fetch(endpoint, {
          method: "POST", body: payload, headers: {Accept: "application/json"},
          mode: "cors", credentials: "omit", redirect: "follow", signal: controller.signal
        });
        const responseOrigin = new URL(response.url).origin;
        if (!response.ok || response.type === "opaque" ||
            !["https://script.google.com", "https://script.googleusercontent.com"].includes(responseOrigin)) {
          throw new Error("Unconfirmed response");
        }
        const result = await response.json();
        if (!result || result.protocol !== protocol || result.request_id !== requestId ||
            result.ok !== true || result.code !== "accepted") {
          const messages = {
            invalid: "Please check your entries and their length. Your message has not been sent.",
            rate_limited: "The form is temporarily busy. Please wait before trying again.",
            quota: "Online messages are temporarily unavailable.",
            blocked: "Your message has not been sent."
          };
          const explanation = result && result.protocol === protocol && result.request_id === requestId && messages[result.code];
          if (explanation) { status.textContent = explanation + " Your text is still here." + fallback; return; }
          throw new Error("Service did not confirm acceptance");
        }
        status.textContent = form.dataset.formId === "comment"
          ? "Your comment has been submitted for review. It will not appear automatically."
          : "Your message has been submitted. For time-sensitive requests, please call 929-800-2024.";
        form.reset();
        previousPayload = "";
        requestId = "";
      } catch {
        status.textContent = "We could not confirm your submission. Your text is still here." + fallback;
      } finally {
        clearTimeout(timeout);
        pending = false;
        button.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });
  });
})();
