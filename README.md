# FamilyEco

A modern, modular financial management dashboard designed for personal and family use.

## Overview
FamilyEco is a decoupled client-server web application that allows families to track income and expenses through a granular, 3-level category system. It features a responsive UI, real-time data filtering, and comprehensive reporting.

## Tech Stack
- **Frontend:** HTML5, CSS3 (Modern Orange/Gray theme), Bootstrap 5.3.2
- **Logic:** JavaScript (ES6+), jQuery (AJAX)
- **Data Handling:** DataTables (Export to Excel/PDF), Moment.js
- **Architecture:** Port-based multi-tenancy (Dynamic `serverURL` construction)

## Key Features
- **3-Level Category Hierarchy:** Organized financial tracking (Income vs. Expense).
- **Dynamic Port Connectivity:** Uses a custom `familyId` system to route requests to specific backend instances.
- **Advanced Reporting:** Statistical analysis with custom date range filtering.
- **Responsive Design:** Optimized for both desktop and mobile use with a collapsible sidebar.
- **Security:** Session-based authentication and client-side credential validation.

## Project Structure
- `index.html`: Entry point & Authentication.
- `trans.html`: Transaction management core.
- `stats.html`: Data visualization and statistics.
- `jsLib/`: Custom modular logic for category management, sessions, and UI state.
- `css/`: Thematic styling and component definitions.
