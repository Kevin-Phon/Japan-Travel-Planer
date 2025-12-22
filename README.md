<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Japan Travel Planner

An AI-powered travel planner for your trips to Japan.

## Getting Started

### Prerequisites

- **Node.js**: v20 or higher is recommended.
- **npm**: Comes with Node.js.

### Installation

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   - Create a `.env` file in the root directory (based on `.env.example` if available).
   - Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_api_key_here
     ```

### Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Deployment

This project is configured to verify and deploy automatically using **GitHub Actions**.

### How to Deploy

1. **Push to GitHub**: The deployment workflow is triggered on every push to the `main` branch.
2. **Configure GitHub Pages**:
   - Go to your repository **Settings**.
   - Select **Pages** from the sidebar.
   - Under **Build and deployment**, select **GitHub Actions** as the source.
   - *Alternatively*, if the action has already run, verify it deployed to the `gh-pages` branch and select that as the source.

## Project Structure

- `src/`: Source code for React components and logic.
- `.github/workflows/`: CI/CD configurations.
- `public/`: Static assets.
