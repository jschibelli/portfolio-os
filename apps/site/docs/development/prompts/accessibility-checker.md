# Accessibility Checker

Comprehensive accessibility audit and improvement guide for web applications. Covers WCAG guidelines, screen reader compatibility, keyboard navigation, and inclusive design principles.

## Prompt

```markdown
Perform a comprehensive accessibility audit for: **{{COMPONENT_OR_PAGE_NAME}}**

**Audit Target**:
{{AUDIT_TARGET_DESCRIPTION}}

**Accessibility Standards**:
- **WCAG Level**: {{WCAG_LEVEL}} (A/AA/AAA)
- **Compliance Target**: {{COMPLIANCE_TARGET}}
- **Screen Reader Support**: {{SCREEN_READER_SUPPORT}}
- **Keyboard Navigation**: {{KEYBOARD_NAVIGATION}}
- **Color Contrast**: {{COLOR_CONTRAST}}

**Audit Framework**:

1. **Perceivable Content**:
   - **Text Alternatives**: {{TEXT_ALTERNATIVES_CHECK}}
   - **Time-based Media**: {{TIME_BASED_MEDIA_CHECK}}
   - **Adaptable Content**: {{ADAPTABLE_CONTENT_CHECK}}
   - **Distinguishable Content**: {{DISTINGUISHABLE_CONTENT_CHECK}}

2. **Operable Interface**:
   - **Keyboard Accessible**: {{KEYBOARD_ACCESSIBLE_CHECK}}
   - **Enough Time**: {{ENOUGH_TIME_CHECK}}
   - **Seizure Prevention**: {{SEIZURE_PREVENTION_CHECK}}
   - **Navigable**: {{NAVIGABLE_CHECK}}

3. **Understandable Content**:
   - **Readable**: {{READABLE_CHECK}}
   - **Predictable**: {{PREDICTABLE_CHECK}}
   - **Input Assistance**: {{INPUT_ASSISTANCE_CHECK}}

4. **Robust Technology**:
   - **Compatible**: {{COMPATIBLE_CHECK}}
   - **Assistive Technology**: {{ASSISTIVE_TECHNOLOGY_CHECK}}

**Specific Areas to Check**:
- **Form Accessibility**: {{FORM_ACCESSIBILITY_CHECK}}
- **Navigation**: {{NAVIGATION_ACCESSIBILITY_CHECK}}
- **Images and Media**: {{MEDIA_ACCESSIBILITY_CHECK}}
- **Color and Contrast**: {{COLOR_ACCESSIBILITY_CHECK}}
- **Typography**: {{TYPOGRAPHY_ACCESSIBILITY_CHECK}}
- **Interactive Elements**: {{INTERACTIVE_ELEMENTS_CHECK}}

**Technical Context**:
- **Framework**: {{FRAMEWORK}}
- **UI Library**: {{UI_LIBRARY}}
- **Testing Tools**: {{TESTING_TOOLS}}
- **Screen Readers**: {{SCREEN_READERS}}

**Current Issues**:
{{CURRENT_ACCESSIBILITY_ISSUES}}

**User Personas**:
{{USER_PERSONAS}}

**Expected Output**:
1. Comprehensive accessibility report
2. Priority-based recommendations
3. Code examples for fixes
4. Testing checklist
5. Compliance roadmap
6. Monitoring plan

Please provide actionable recommendations to improve accessibility and ensure compliance with WCAG guidelines.
```

## Tips

### For Better Results
- Test with actual screen readers
- Include keyboard-only navigation testing
- Check color contrast ratios
- Verify focus management
- Test with different assistive technologies

### Common Variables to Replace
- `{{COMPONENT_OR_PAGE_NAME}}`: Name of component or page
- `{{AUDIT_TARGET_DESCRIPTION}}`: What you're auditing
- `{{WCAG_LEVEL}}`: A, AA, or AAA compliance level
- `{{FRAMEWORK}}`: React, Vue, Angular, etc.
- `{{UI_LIBRARY}}`: Material-UI, Ant Design, etc.
- `{{SCREEN_READERS}}`: NVDA, JAWS, VoiceOver, etc.
- `{{CURRENT_ACCESSIBILITY_ISSUES}}`: Known issues to address

### Example Usage
```markdown
Perform a comprehensive accessibility audit for: **User Registration Form**

**Audit Target**:
A multi-step registration form with validation, error handling, and progress indicators.

**Accessibility Standards**:
- **WCAG Level**: AA
- **Compliance Target**: Full WCAG 2.1 AA compliance
- **Screen Reader Support**: NVDA, JAWS, VoiceOver
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: 4.5:1 minimum ratio
```

### Output Expectations
- Detailed accessibility analysis
- Specific improvement recommendations
- Code examples and snippets
- Testing procedures
- Compliance verification
- User experience improvements
