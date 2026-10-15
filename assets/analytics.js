/*
 * Lightweight first-party interaction hooks. No vendor script, cookies,
 * identifiers, names, ratings, phone numbers, message bodies, or full URLs.
 *
 * TODO — connect Google Analytics 4 when Sonia approves the production setup:
 *   1. Add the official Google tag with the confirmed GA4 measurement ID.
 *   2. Configure the production site's privacy/consent settings before loading it.
 *   3. This adapter will call gtag('event', name, parameters) when gtag exists.
 *
 * Alternative: use Google Tag Manager custom-event triggers for the events
 * below, which are pushed to dataLayer while gtag is absent. Choose one
 * forwarding method so the same interaction is not reported twice.
 * No GA measurement ID or Google request is active in this preview.
 *
 * WhatsApp events mean an outgoing link was clicked, never that a message was
 * sent or an enquiry/review received. Likewise, preparing a brief is not a booking.
 */
(() => {
  'use strict';
  const pageType = location.pathname.endsWith('gallery.html') ? 'gallery' : 'home';
  function track(eventName, parameters = {}) {
    const details = { page_type: pageType, ...parameters };
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, details);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...details });
    }
    // Optional local debugging hook, with the same restricted payload.
    window.dispatchEvent(new CustomEvent('sonias:analytics', {
      detail: { event: eventName, ...details }
    }));
  }
  function placement(element) {
    if (element.closest('#review-dialog')) return 'review_dialog';
    if (element.closest('#planner')) return 'event_planner';
    if (element.closest('header')) return 'header';
    if (element.closest('footer')) return 'footer';
    if (element.closest('#sample-menu')) return 'sample_menu';
    if (element.closest('#testimonials')) return 'testimonial';
    if (element.closest('.gallery-page')) return 'gallery';
    return 'main';
  }
  document.addEventListener('click', event => {
    const element = event.target.closest('a,button');
    if (!element) return;
    const parameters = { interaction_location: placement(element) };
    const href = element.getAttribute('href') || '';
    let name;
    if (element.matches('[data-plan]')) name = 'planner_open';
    else if (element.matches('[data-review]')) name = 'review_form_open';
    else if (element.matches('.gallery-item')) name = 'gallery_photo_open';
    else if (element.matches('[data-filter]')) name = 'gallery_filter_click';
    else if (element.matches('[data-menu]')) name = 'sample_menu_click';
    else if (element.id === 'copy-brief') name = 'event_brief_copy_click';
    else if (href.startsWith('tel:')) name = 'phone_click';
    else if (href.startsWith('https://wa.me/')) {
      name = element.id === 'send-review' ? 'review_whatsapp_click'
        : element.id === 'whatsapp-brief' ? 'event_brief_whatsapp_click'
        : 'whatsapp_click';
    } else if (href.startsWith('https://www.instagram.com/')) {
      name = 'social_click'; parameters.platform = 'instagram';
    } else if (href.startsWith('https://web.facebook.com/')) {
      name = 'social_click'; parameters.platform = 'facebook';
    } else if (href === 'gallery.html') name = 'gallery_navigation_click';
    if (name) track(name, parameters);
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'plan-form') track('event_brief_prepared');
    if (event.target.id === 'review-form' &&
        String(new FormData(event.target).get('message') || '').trim().length >= 10) {
      track('review_prepared');
    }
  });
})();
