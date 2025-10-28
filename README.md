# COMP-3512-assign-2 By Sergei and Faizan

# Formula 1 Race Data Application

This project is a Single-Page Application (SPA) created as part of the **COMP 3512** course assignment. The application allows users to explore Formula 1 race data from different seasons. It includes functionalities for viewing races, qualifying results, and details about circuits, drivers, and constructors. Users can also manage their favorite circuits, drivers, and constructors. The project demonstrates the application of JavaScript, local storage, and dynamic content updates to create an interactive and user-friendly experience.

---

## Features

- **Dynamic Views**:
  - **Home View**: Lets users select a season and navigate from Home View, Races View, & Favorites View.
                  - **Home**: Displays home page with visuals.
                  - **Race**: Displays selected season's Races, Qualifying Results, and Race Results.
                              Sorted by round and position. Includes table sorting with indicators and
                              Visual favoriting that updates all tables (data).
                  - **Favorites**: Displays users favorites.
- **Modal Popups**: Displays detailed information about circuits, drivers, and constructors in modal-style dialogs.
- **Favorites Management**: Allows users to add and manage their favorite circuits, drivers, and constructors.
- **Local Storage Caching**: Optimizes performance by storing race data locally after the first API fetch.
- **Responsive Design**: Designed to provide a seamless experience across different devices.
- **API Integration**: Consumes Formula 1 API to fetch and display real-time race data.
- **Custom Sorting**: Enables sorting by race details, such as round or position, with visual indicators for sorting changes.

---

## Technologies Used

- **HTML**
- **CSS**
- **JavaScript**

---

## Main Project Files

### `index.html`
- This is the main HTML file for the project. It serves as the entry point for the Single-Page Application (SPA).
- The file contains the basic structure of the application, including placeholders for dynamically inserted content. It also includes references to the external JavaScript and CSS files.

#### Key Features:
- Acts as the container for all dynamic views and modals.
- Links to the `homeView.js` script and `styles.css` for functionality and design.

---

### `homeView.js`
- This JavaScript file handles the dynamic functionality of the application. It contains the logic for fetching data from the API, rendering race-related views, and managing user interactions, such as sorting and marking favorites.

#### Key Features:
- Fetches data once and stores into local storage and displays data for races, drivers, constructors, and circuits.
- Handles user interactions, such as selecting view, selecting a season, or viewing detailed information.
- Implements local storage to cache data for better performance.

---

### `styles.css`
- This CSS file defines the visual appearance of the application. It includes custom styles to ensure a responsive and user-friendly design.

#### Key Features:
- Provides styles for layout, typography, and interactive elements (e.g., buttons, modals).
- Ensures the application is visually consistent and appealing across devices.
- Includes styling for themes or specific views, such as the home view.

---

## API Routes

The application uses the Formula 1 API to fetch race data. Below are the routes used in the application:

| **Route**                                             | **Description**                                                                      |
|-------------------------------------------------------|-------------------------------------------------------------------------------------|
| `[domain]/circuits.php`                               | Returns all circuits                                                                |
| `[domain]/circuits.php?id=1`                          | Returns a single circuit specified by the passed `circuitId` value                 |
| `[domain]/constructors.php`                           | Returns all constructors                                                           |
| `[domain]/constructors.php?id=1`                      | Returns a single constructor specified by the passed `constructorId` value         |
| `[domain]/constructors.php?ref=mclaren`               | Returns single constructor specified by the passed `constructorRef` value          |
| `[domain]/constructorResults.php?constructor=mclaren&season=2023` | Returns the race for a specified constructor (`constructorRef` value) and season |
| `[domain]/drivers.php`                                | Returns all drivers                                                                 |
| `[domain]/drivers.php?id=857`                        | Returns a single driver specified by the passed `driverId` value                   |
| `[domain]/drivers.php?ref=piastri`                    | Returns a single driver specified by the passed `driverRef` value                  |
| `[domain]/driverResults.php?driver=piastri&season=2023`| Returns the race results for a specified driver (`driverRef` value) and season     |
| `[domain]/races.php?id=1100`                          | Returns just the specified race (`raceId` value)                                   |
| `[domain]/races.php?race=1100`                        | Returns all the results for the specified race (`raceId` value)                    |
| `[domain]/qualifying.php?race=1100`                   | Returns all the qualifying results for the specified race (`raceId` value)         |

**Domain**: `https://www.randyconnolly.com/funwebdev/3rd/api/f1`

---

## Sample API URL
[domain]/constructors.php?ref=mclaren

---

## LIVE Site Preview
https://3-png.github.io/COMP-3512-assign-2/
  

