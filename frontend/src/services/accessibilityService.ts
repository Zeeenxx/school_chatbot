// Accessibility service for improved user experience
class AccessibilityService {
  private isEnabled = false;
  private highContrastMode = false;
  private reducedMotion = false;
  private fontSize = 16; // Base font size in pixels
  private focusVisible = false;

  constructor() {
    this.initializeAccessibility();
    this.setupEventListeners();
  }

  private initializeAccessibility(): void {
    // Check for system preferences
    if (window.matchMedia) {
      // Check for reduced motion preference
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for high contrast preference
      this.highContrastMode = window.matchMedia('(prefers-contrast: high)').matches;
    }

    // Load saved preferences
    const savedFontSize = localStorage.getItem('accessibility_font_size');
    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize, 10);
    }

    const savedHighContrast = localStorage.getItem('accessibility_high_contrast');
    if (savedHighContrast) {
      this.highContrastMode = savedHighContrast === 'true';
    }

    this.applyAccessibilitySettings();
  }

  private setupEventListeners(): void {
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        this.applyAccessibilitySettings();
      });

      window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
        this.highContrastMode = e.matches;
        this.applyAccessibilitySettings();
      });
    }

    // Listen for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.focusVisible = true;
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      this.focusVisible = false;
      document.body.classList.remove('keyboard-navigation');
    });
  }

  private applyAccessibilitySettings(): void {
    const root = document.documentElement;
    
    // Apply font size
    root.style.fontSize = `${this.fontSize}px`;
    
    // Apply high contrast mode
    if (this.highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (this.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }

  // Public methods
  enable(): void {
    this.isEnabled = true;
    this.applyAccessibilitySettings();
  }

  disable(): void {
    this.isEnabled = false;
    document.documentElement.classList.remove('high-contrast', 'reduced-motion');
    document.documentElement.style.fontSize = '';
  }

  setFontSize(size: number): void {
    this.fontSize = Math.max(12, Math.min(24, size)); // Clamp between 12px and 24px
    localStorage.setItem('accessibility_font_size', this.fontSize.toString());
    this.applyAccessibilitySettings();
  }

  getFontSize(): number {
    return this.fontSize;
  }

  setHighContrast(enabled: boolean): void {
    this.highContrastMode = enabled;
    localStorage.setItem('accessibility_high_contrast', enabled.toString());
    this.applyAccessibilitySettings();
  }

  getHighContrast(): boolean {
    return this.highContrastMode;
  }

  setReducedMotion(enabled: boolean): void {
    this.reducedMotion = enabled;
    this.applyAccessibilitySettings();
  }

  getReducedMotion(): boolean {
    return this.reducedMotion;
  }

  // Focus management
  focusElement(selector: string): boolean {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      return true;
    }
    return false;
  }

  focusFirstInteractive(): boolean {
    const interactiveElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (interactiveElements.length > 0) {
      (interactiveElements[0] as HTMLElement).focus();
      return true;
    }
    return false;
  }

  focusLastInteractive(): boolean {
    const interactiveElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (interactiveElements.length > 0) {
      const lastElement = interactiveElements[interactiveElements.length - 1] as HTMLElement;
      lastElement.focus();
      return true;
    }
    return false;
  }

  // Screen reader announcements
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Skip links
  createSkipLink(text: string, target: string): HTMLElement {
    const skipLink = document.createElement('a');
    skipLink.href = target;
    skipLink.textContent = text;
    skipLink.className = 'skip-link';
    skipLink.setAttribute('tabindex', '1');
    
    return skipLink;
  }

  // ARIA helpers
  setAriaExpanded(element: HTMLElement, expanded: boolean): void {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  setAriaSelected(element: HTMLElement, selected: boolean): void {
    element.setAttribute('aria-selected', selected.toString());
  }

  setAriaHidden(element: HTMLElement, hidden: boolean): void {
    element.setAttribute('aria-hidden', hidden.toString());
  }

  // Color contrast checker
  getContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    // In a real implementation, you'd want to use a proper color contrast library
    return 4.5; // Placeholder value
  }

  // Get accessibility status
  getStatus(): {
    enabled: boolean;
    fontSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
    focusVisible: boolean;
  } {
    return {
      enabled: this.isEnabled,
      fontSize: this.fontSize,
      highContrast: this.highContrastMode,
      reducedMotion: this.reducedMotion,
      focusVisible: this.focusVisible
    };
  }
}

// Create singleton instance
const accessibilityService = new AccessibilityService();

export default accessibilityService;


