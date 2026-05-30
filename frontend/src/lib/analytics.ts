import type { AnalyticsEvent } from '@/types';

// Analytics tracking utility
class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];

  track(eventName: string, data?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      name: eventName,
      data: data || {},
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined') {
      // Send to backend analytics endpoint
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(() => {
        // Silently ignore analytics errors to avoid disrupting app
      });

      // Google Analytics
      const windowWithGtag = window as typeof window & { gtag?: (...args: unknown[]) => void };
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag('event', eventName, data);
      }
    }
  }

  trackPrediction(riskLevel: string, confidence: number) {
    this.track('prediction_made', {
      risk_level: riskLevel,
      confidence: confidence,
      timestamp: new Date().toISOString(),
    });
  }

  trackError(errorMessage: string, source: string) {
    this.track('error_occurred', {
      message: errorMessage,
      source: source,
      timestamp: new Date().toISOString(),
    });
  }

  trackPageView(page: string) {
    this.track('page_view', {
      page: page,
      timestamp: new Date().toISOString(),
    });
  }

  trackFormInteraction(formName: string, action: string) {
    this.track('form_interaction', {
      form: formName,
      action: action,
      timestamp: new Date().toISOString(),
    });
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }
}

export const analyticsTracker = new AnalyticsTracker();
