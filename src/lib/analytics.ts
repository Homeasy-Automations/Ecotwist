import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const GA_MEASUREMENT_ID = 'G-5CPVWVZ880';
export const META_PIXEL_ID = '4461432844121458';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Track page view across both Google Analytics and Meta Pixel
 */
export function trackPageView(path: string, title?: string) {
  // Google Analytics Pageview
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // Meta Pixel PageView
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Track custom event in Google Analytics
 */
export function trackGoogleEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Track event in Meta Pixel (standard or custom)
 */
export function trackMetaEvent(eventName: string, params?: Record<string, any>, isCustom = false) {
  if (typeof window !== 'undefined' && window.fbq) {
    if (isCustom) {
      window.fbq('trackCustom', eventName, params);
    } else {
      window.fbq('track', eventName, params);
    }
  }
}

/**
 * Convenience helper to track high-value user conversions across both platforms
 */
export function trackConversion(eventName: string, details?: Record<string, any>) {
  trackGoogleEvent(eventName, details);

  // Map common events to standard Meta Pixel events if applicable
  const metaMap: Record<string, string> = {
    contact_form_submit: 'Lead',
    catalogue_download: 'ViewContent',
    inquiry: 'Contact',
    button_click: 'ViewContent',
  };

  const metaEvent = metaMap[eventName] || eventName;
  trackMetaEvent(metaEvent, details, !metaMap[eventName]);
}

/**
 * React Hook for automatic SPA route tracking
 */
export function useAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
}

/**
 * Component to mount inside React Router to enable automated page tracking
 */
export function AnalyticsTracker() {
  useAnalyticsTracker();
  return null;
}
