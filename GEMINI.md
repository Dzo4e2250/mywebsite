# Project Overview

This is a personal portfolio website for George Ristov, a sales professional with a passion for technology and AI. The website is designed to showcase his skills, projects, and career journey. It's a static website built with vanilla HTML, CSS, and JavaScript, demonstrating a clean and modern design. The entire website is in Slovenian.

## Key Technologies

*   **Frontend:** HTML, CSS, JavaScript
*   **Libraries:** No major libraries or frameworks are used, indicating a focus on fundamental web technologies.
*   **APIs:** The site fetches the number of public repositories from the GitHub API.

## Project Structure

The project has a simple and flat structure:

*   `index.html`: The main landing page.
*   `o-meni.html`: "About Me" page.
*   `projects.html`: "Projects" page.
*   `styles.css`: Contains all the styles for the website.
*   `app.js` / `script.js`: Contains the JavaScript for the website, including:
    *   Dynamic year calculation for work experience.
    *   Scroll animations.
    *   Smooth scrolling.
    *   A simple form handler.
    *   Navigation highlighting.
    *   Expandable cards for showcasing project details.
    *   A modal system for displaying project information.
*   `*.svg`, `*.jpg`, `*.png`: Image assets used in the website.

## Building and Running

This is a static website, so there is no build process. To run the project, you can simply open the `index.html` file in a web browser.

For development, it's recommended to use a simple local server to avoid any potential CORS issues when fetching data from the GitHub API. You can use the following Python command to start a simple server:

```bash
python -m http.server
```

Or, if you have Node.js installed:

```bash
npx http-server
```

## Development Conventions

*   The code is well-structured and commented in English, even though the website content is in Slovenian.
*   The JavaScript code is organized into functions with clear responsibilities.
*   The CSS uses custom properties (variables) for colors, fonts, and spacing, which makes it easy to maintain and customize the design.
*   The project uses a clean and modern design with a focus on readability and user experience.
