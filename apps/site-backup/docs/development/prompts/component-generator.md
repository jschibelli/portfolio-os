# Component Generator

Generate production-ready React components with TypeScript, proper styling, accessibility, and comprehensive documentation. Optimized for Cursor's codebase-aware capabilities.

## Prompt

```markdown
Create a {{COMPONENT_TYPE}} React component with the following specifications:

**Component Name**: {{COMPONENT_NAME}}
**Purpose**: {{COMPONENT_PURPOSE}}
**Props Interface**: {{PROPS_INTERFACE}}

**Requirements**:
- TypeScript with strict typing
- Tailwind CSS for styling (use stone color palette)
- Proper accessibility (ARIA labels, keyboard navigation, screen reader support)
- Responsive design (mobile-first approach)
- Error boundaries and loading states
- Comprehensive JSDoc documentation
- Unit test structure with Playwright
- Storybook story (if applicable)

**Additional Context**:
- Project uses Next.js {{NEXT_VERSION}}
- Styling follows stone theme guidelines
- Component should be reusable and composable
- Include proper error handling and validation
- Follow React best practices and hooks guidelines

**Expected Output**:
1. Main component file (.tsx)
2. TypeScript interface file (.d.ts) if needed
3. Unit test file (.spec.ts)
4. Storybook story (.stories.tsx) if applicable
5. Brief usage examples

Please generate clean, production-ready code that follows the existing codebase patterns and conventions.
```

## Tips

### For Better Results
- Provide specific prop examples in the interface
- Mention any existing similar components for consistency
- Specify if the component needs to integrate with specific libraries (form libraries, state management, etc.)
- Include any specific business logic or validation requirements

### Common Variables to Replace
- `{{COMPONENT_TYPE}}`: Button, Form, Modal, Card, Table, etc.
- `{{COMPONENT_NAME}}`: PascalCase component name
- `{{COMPONENT_PURPOSE}}`: Brief description of what the component does
- `{{PROPS_INTERFACE}}`: TypeScript interface for component props
- `{{NEXT_VERSION}}`: Your Next.js version (e.g., 13, 14)

### Example Usage
```markdown
Create a Button React component with the following specifications:

**Component Name**: PrimaryButton
**Purpose**: Primary action button with loading states and variants
**Props Interface**: 
```typescript
interface PrimaryButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}
```
```

### Output Expectations
- Clean, well-documented code
- Proper TypeScript types
- Accessibility features
- Responsive design
- Error handling
- Test coverage structure
