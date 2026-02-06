# Contributing to AI Leaders

Thank you for your interest in contributing to AI Leaders! We're excited to have you join our community and help build the future of AI and WordPress education.

## How to Contribute

We welcome contributions of all types—from fixing typos in the documentation to implementing new features.

### Finding Something to Work On

If you're looking for ways to contribute, please check our [GitHub Issues](https://github.com/1111philo/ai-leaders/issues).

If you have an idea for a new feature or have found a bug that isn't already listed, please [open a new issue](https://github.com/1111philo/ai-leaders/issues/new) to discuss it before starting work.

### Your First Pull Request

There are two primary ways to contribute: the traditional command-line approach and an AI-assisted approach using tools like Google Antigravity or Claude Code.

#### Option 1: AI-Powered Development (Recommended)

This project is built to be "AI-native." We recommend using **Google Antigravity** or **Claude Code** to streamline your contribution process. These tools can help you understand the codebase, generate tests, and write implementations for you.

1. **Open the Project**: Open the repository in your IDE where your AI agent (Antigravity, Claude Code, etc.) is enabled.
2. **Describe Your Task**: Start a conversation with your agent. For example:
   - *"I want to fix issue #123. Can you help me find the relevant files?"*
   - *"I need to add a new 'About' section. Can you generate the component and style it with Tailwind?"*
3. **Review and Iterate**: Review the code the AI generates. You can ask for modifications directly in the chat.
4. **Finalize**: Once the changes are ready, you can ask the AI to help you create a branch and commit your changes.

#### Option 2: Traditional Workflow (Command Line)

1. **Fork the repository**: Click the "Fork" button at the top right of this page to create your own copy.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/ai-leaders.git
   cd ai-leaders
   ```
3. **Set up the project**:
   ```bash
   npm install
   ```
4. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes**: Implement your feature or fix.
6. **Commit and Push**:
   ```bash
   git commit -m "Brief description of the change"
   git push origin your-branch-name
   ```

#### Option 3: GitHub Web Interface (No CLI required)

For simple changes like documentation fixes, you can use GitHub's built-in editor:
1. Navigate to the file you want to change.
2. Click the pen icon (**Edit this file**).
3. Make your changes in the editor.
4. Scroll down to **Commit changes**, select "Create a new branch for this commit and start a pull request," and click **Propose changes**.

### Adding or Updating Lessons

The curriculum is content-driven. Adding or updating a lesson is as simple as modifying or creating a Markdown file.

1. **Location**: All lesson files live in `src/content/lessons/`.
2. **File Naming**: Use the format `X.X-short-description.md` (e.g., `1.1-fundamentals-how-ai-works.md`).
3. **Format**: Every lesson file must start with a YAML frontmatter block. The application uses these fields to build the curriculum index and the lesson pages.

```markdown
---
id: "1.1"                     # Unique ID for sorting
title: "Lesson Title"         # Main headline
domain: "1. AI Leadership"    # Category (e.g., Foundations, AI Leadership, WordPress)
progression: "Micro-Credential" # Tier (Micro-Credential or Full Credential)
learning_objective: "..."     # Clear objective for the learner
enduring_understandings: "..." # Core concepts to remember
essential_questions: "..."    # Questions to spark critical thinking
assessment_project: "..."     # Description of the final task
mastery_criteria: "..."       # Specific metrics the AI Tutor uses for grading
activities: "..."             # Optional: list of learning activities
---

# Optional: Lesson Title Again (Will be stripped in UI to avoid duplication)

## Introduction
... Lesson content goes here ...
```

4. **Dynamic Updates**: When you add or change a file in this directory, the site's curriculum index, progress bars, and detail pages will update automatically.


### Submitting Your PR

Regardless of the method used, once your changes are pushed to your fork:
1. Go to the original [AI Leaders repository](https://github.com/1111philo/ai-leaders).
2. You should see a banner saying "your-branch-name had recent pushes". Click **Compare & pull request**.
3. Describe your changes clearly and link any related issues.

## Development Guidelines

- **Code Quality**: Follow existing code patterns. We use TypeScript and React.
- **Styling**: We use Tailwind CSS for styling.
- **Testing**: Before submitting a PR, ensure the project builds and runs correctly. You can ask your AI agent to:
  - *"Run the development server and check for errors."*
  - *"Run the build command to ensure everything compiles."*
  - (Manual commands: `npm run dev` or `npm run build`)

## Code of Conduct

Please be respectful and inclusive in all your interactions within the project. We are committed to providing a welcoming environment for everyone.

Thank you again for your contributions!
