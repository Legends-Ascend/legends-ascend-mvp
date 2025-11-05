# Legends Ascend Brand Guidelines

## Overview

This document defines the official brand guidelines for Legends Ascend. All frontend code (web and app) **must strictly adhere** to these rules to ensure consistent brand identity across all platforms and touchpoints.

---

## 1. Logo Usage Rules

### Primary Logo
- Use the full-color logo on light backgrounds
- Maintain minimum clear space of 20px around the logo on all sides
- Never distort, rotate, or modify the logo proportions
- Always use vector formats (SVG) for web implementations when possible

### Logo Variations
- **Full Color**: Primary usage for all standard applications
- **Monochrome**: Use on complex backgrounds or when color reproduction is limited
- **Favicon**: Simplified icon version for browser tabs and app icons

### Prohibited Usage
- Do not add effects (shadows, glows, gradients) to the logo
- Do not place the logo on busy or low-contrast backgrounds
- Do not use outdated or unofficial logo versions
- Do not alter logo colors outside of approved variations

---

## 2. Color Palette

### Primary Colors

| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Primary Blue** | `#1E3A8A` | Primary brand color, CTA buttons, headers |
| **Accent Gold** | `#F59E0B` | Highlights, achievements, premium features |
| **Dark Navy** | `#0F172A` | Text, dark backgrounds, footers |

### Secondary Colors

| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Light Blue** | `#60A5FA` | Hover states, secondary elements |
| **Soft Gray** | `#F1F5F9` | Backgrounds, containers, dividers |
| **Medium Gray** | `#64748B` | Secondary text, subtle elements |

### Semantic Colors

| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **Success Green** | `#10B981` | Success messages, confirmations |
| **Warning Orange** | `#F97316` | Warnings, alerts |
| **Error Red** | `#EF4444` | Error messages, critical alerts |
| **Info Blue** | `#3B82F6` | Information messages, tooltips |

### Background Colors

| Color Name | HEX Code | Usage |
|------------|----------|-------|
| **White** | `#FFFFFF` | Primary background |
| **Off-White** | `#FAFAFA` | Secondary background |
| **Dark Mode BG** | `#111827` | Dark theme primary background |

---

## 3. Typography Recommendations

### Font Families

**Primary Font (Headings):**
- Font: **Inter** or **Poppins**
- Weights: 600 (Semi-Bold), 700 (Bold), 800 (Extra Bold)
- Usage: Headers (H1-H6), navigation, buttons

**Secondary Font (Body):**
- Font: **Inter** or **System UI**
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold)
- Usage: Body text, descriptions, form inputs

**Monospace Font (Code):**
- Font: **Fira Code** or **JetBrains Mono**
- Usage: Code snippets, technical content

### Typography Scale

```
H1: 48px / 3rem (Bold)
H2: 36px / 2.25rem (Bold)
H3: 30px / 1.875rem (Semi-Bold)
H4: 24px / 1.5rem (Semi-Bold)
H5: 20px / 1.25rem (Medium)
H6: 18px / 1.125rem (Medium)
Body Large: 18px / 1.125rem (Regular)
Body: 16px / 1rem (Regular)
Body Small: 14px / 0.875rem (Regular)
Caption: 12px / 0.75rem (Medium)
```

### Line Height
- Headings: 1.2 - 1.3
- Body text: 1.5 - 1.6
- Captions: 1.4

---

## 4. Favicon and Monochrome Usage

### Favicon Guidelines
- Use the simplified icon version (without wordmark)
- Minimum size: 16x16px, recommended: 32x32px, 180x180px (Apple), 512x512px (PWA)
- Ensure the icon is recognizable at small sizes
- Include multiple sizes in the favicon package
- Use transparent backgrounds for favicon.ico

### Monochrome Logo Usage
- **White version**: Use on dark backgrounds (minimum contrast ratio 4.5:1)
- **Black version**: Use on light backgrounds
- Use monochrome versions when color printing is unavailable
- Maintain the same spacing and sizing rules as the primary logo

---

## 5. Asset Referencing Conventions

### File Naming
- Logo files: `logo-[variant]-[color].[ext]`
  - Examples: `logo-full-color.svg`, `logo-icon-white.png`, `logo-monochrome-black.svg`
- Asset organization: Store all brand assets in `/public/assets/brand/` or `/assets/brand/`

### File Formats
- **Web**: SVG (preferred), PNG (fallback)
- **Print**: SVG, PDF, high-res PNG (300dpi minimum)
- **Favicon**: ICO, PNG, SVG

### Asset Path Structure
```
/assets/brand/
  /logos/
    - logo-full-color.svg
    - logo-monochrome-white.svg
    - logo-monochrome-black.svg
    - logo-icon.svg
  /favicons/
    - favicon.ico
    - favicon-16x16.png
    - favicon-32x32.png
    - apple-touch-icon.png
  /guidelines/
    - BRANDING_GUIDELINE.md (this file)
```

---

## 6. Web-First Accessibility Guidelines

### Color Contrast
- **WCAG 2.1 AA Compliance**: Minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text
- Test all color combinations with accessibility tools
- Never rely on color alone to convey information

### Logo Alt Text
- Always include descriptive alt text: `"Legends Ascend logo"`
- For decorative usage: `alt=""` or `aria-hidden="true"`

### Responsive Design
- Logo should scale appropriately across all screen sizes
- Minimum logo size: 120px width on mobile devices
- Consider using icon-only version on very small screens (<375px)

### Focus States
- Ensure all interactive elements with brand colors have visible focus indicators
- Focus outline: 2px solid with 2px offset, using Primary Blue or high-contrast color

### Dark Mode Support
- Provide appropriate logo variations for dark mode
- Adjust color contrast ratios for dark backgrounds
- Test all brand colors in both light and dark themes

### Screen Reader Compatibility
- Brand elements should be navigable via keyboard
- Ensure proper semantic HTML structure
- Use ARIA labels where necessary for brand components

---

## 7. Implementation Requirements

### Frontend Code Adherence

**All frontend implementations (web and app) MUST:**

1. ✅ Use only approved brand colors defined in this document
2. ✅ Reference logo assets from the designated asset paths
3. ✅ Implement typography scale as specified
4. ✅ Follow accessibility guidelines (WCAG 2.1 AA minimum)
5. ✅ Support both light and dark modes with appropriate brand adaptations
6. ✅ Use semantic HTML and proper ARIA attributes
7. ✅ Test all brand implementations across different devices and screen sizes
8. ✅ Maintain consistent spacing and sizing for logo usage
9. ✅ Never modify brand assets outside of this guideline
10. ✅ Document any deviations and obtain approval before implementation

### Code Review Checklist

Before merging any frontend PR, verify:
- [ ] Brand colors match the HEX codes in this document
- [ ] Logo usage follows spacing and sizing guidelines
- [ ] Typography uses approved fonts and scale
- [ ] Accessibility standards are met (contrast, alt text, focus states)
- [ ] Responsive behavior is tested across breakpoints
- [ ] Dark mode implementation uses appropriate brand variations

---

## 8. Summary Statement

**All frontend code (web and app) must strictly adhere to these branding guidelines.** Consistency in brand presentation is critical to building trust and recognition with our users. Any deviations from these guidelines must be documented, justified, and approved by the design team before implementation.

These guidelines are living documents and will be updated as the brand evolves. Always reference the latest version in the `/docs` folder of the repository.

---

## Questions or Clarifications?

For questions about brand usage or to request new brand assets, please:
1. Open an issue in the repository with the `design` label
2. Contact the design team directly
3. Reference this document in all brand-related discussions

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Maintained By:** Legends Ascend Design Team
