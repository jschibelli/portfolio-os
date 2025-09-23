# AI Prompt Template Library

A curated collection of AI prompts designed for senior front-end developers building AI-powered SaaS products. These templates are optimized for use with Cursor, Claude, and ChatGPT in multi-agent workflows.

## 🚀 Quick Start

1. **Copy the prompt** from the relevant template file
2. **Paste into your AI tool** (Cursor, Claude, ChatGPT)
3. **Fill in the variables** marked with `{{VARIABLE_NAME}}`
4. **Execute and iterate** based on the response

## 📁 Template Categories

### 🎯 Development Workflow
- **component-generator.md** - Generate React components with proper TypeScript, styling, and accessibility
- **feature-spec.md** - Create detailed feature specifications for new functionality
- **refactor-review.md** - Analyze and improve existing code structure
- **post-merge-review.md** - Review code after merging to ensure quality

### 📝 Content & Documentation
- **case-study-template.md** - Generate comprehensive case studies with proper structure
- **blog-article-template.md** - Create engaging blog content with SEO optimization
- **seo-checklist.md** - Comprehensive SEO audit and optimization guide

### 🧪 Testing & Quality
- **playwright-test-generator.md** - Generate comprehensive test suites
- **accessibility-checker.md** - Audit and improve accessibility compliance
- **bug-report-response.md** - Structured approach to bug investigation and resolution

### 🔧 DevOps & CI/CD
- **ci-debug-helper.md** - Debug CI/CD pipeline issues systematically
- **commit-message-writer.md** - Generate clear, conventional commit messages

## 🎨 Usage Guidelines

### When to Use Each Template

| Template | Best For | AI Tool Preference |
|----------|----------|-------------------|
| component-generator | New UI components | Cursor |
| feature-spec | Planning new features | Claude |
| case-study-template | Documentation | ChatGPT |
| playwright-test-generator | Test coverage | Cursor |
| refactor-review | Code improvement | Claude |
| seo-checklist | SEO audits | ChatGPT |

### Prompt Customization Tips

1. **Context Matters**: Always provide relevant context about your project
2. **Be Specific**: Replace all `{{VARIABLE_NAME}}` placeholders with actual values
3. **Iterate**: Use the AI's response to refine your next prompt
4. **Combine**: Mix and match sections from different templates as needed

## 🔄 Adding New Templates

To add a new prompt template:

1. Create a new `.md` file in this directory
2. Follow the standard format:
   ```markdown
   # Template Name
   
   Brief description of what this prompt does and when to use it.
   
   ## Prompt
   
   ```markdown
   Your actual prompt content here
   ```
   
   ## Tips
   
   - Optional usage tips
   - Examples of good responses
   - Common pitfalls to avoid
   ```

3. Update this README.md with the new template
4. Test the prompt with your preferred AI tool

## 🎯 Best Practices

### For Cursor Users
- Use component-generator for React/TypeScript components
- Leverage refactor-review for code improvements
- Combine with your existing codebase context

### For Claude Users
- Use feature-spec for detailed planning
- Leverage case-study-template for documentation
- Take advantage of Claude's reasoning capabilities

### For ChatGPT Users
- Use blog-article-template for content creation
- Leverage seo-checklist for optimization
- Use accessibility-checker for compliance

## 🔗 Related Resources

- [Case Study Structure Guide](../case-study-structure.md)
- [Amber Styling Guide](../AMBER_STYLING_GUIDE.md)
- [Implementation Documentation](../implementation/)

---

**Last Updated**: {{DATE}}
**Version**: 1.0.0
