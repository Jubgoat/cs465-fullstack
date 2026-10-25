# cs465-fullstack
CS-465 Full Stack Development with MEAN

# Travlr Getaways

Travlr Getaways is a full stack web application built with the MEAN stack for this class CS 465. It has a customer-facing website built with Express and Handlebars, and an administrative single-page application built with Angular. Both sides talk to a shared REST API backed by a MongoDB database. Admin users log in with JWT authentication through Passport before they can add, edit, or delete trips.

## Architecture

**Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA). **

The customer side of Travlr uses Express with Handlebars templates. With this approach the server builds each page as complete HTML and sends it to the browser, so every click on a link triggers a new request and a full-page load. This was simple to build, works well for mostly static content like the home, rooms, and travel pages, and is easy for search engines to read. The tradeoff is that the page flickers and reloads whenever something changes. Plain JavaScript sits in between these two approaches. I used it on the customer side to fetch trip data from the API and to add small bits of behavior, but it requires me to manage the page by hand, and that gets messy as features grow.

The admin side is an Angular SPA. The browser loads one page and then Angular swaps components in and out without reloading, pulling data from the API as needed. This makes the admin experience feel faster and more like a real application, and it let me build reusable components like the trip card. The cost is a heavier setup, a build step, and more concepts to learn, such as components, services, routing, and change detection. Overall, I would use server rendered HTML for simple public pages and an SPA for interactive tools like the admin dashboard, which is how Travlr ended up being structured.

**Why did the backend use a NoSQL MongoDB database? **

MongoDB was a good fit because Travlr's data is made up of self-contained documents, and a trip is a good example. Each trip has a code, name, length, resort, price, description, and image, and none of that needs to be joined with other tables. MongoDB stores these as JSON-like documents, so the data looks the same in the database, the API, and the frontend, with no translation layer in between. It is also flexible, so I could add fields to a trip without migration. With Mongoose I still get a defined schema and validation, which gave me the structure I wanted. I seeded the database from a `trips.json` file using a `seed.js` script, which made it easy to reset my data during development.

## Functionality

**How is JSON different from JavaScript and how does JSON tie together the frontend and backend development pieces? **

JavaScript is a programming language that can contain logic, functions, and variables. JSON is only a text format for describing data, using key and value pairs, arrays, strings, numbers, and booleans. It cannot contain functions or comments, and its keys must be in double quotes. JSON was inspired by JavaScript object syntax, which is why they look similar, but they are not the same thing. JSON is what ties the project together. The Express API sends trips from MongoDB as JSON, the Handlebars pages and the Angular app both read that JSON, and when an admin adds or edits a trip, Angular sends JSON back to the API to be saved. Because every layer speaks JSON, the pieces stay loosely connected, and I could change the frontend without touching the database logic.

**Provide instances in the full stack process when you refactored code to improve functionality and efficiencies and name the benefits that come from reusable user interface (UI) components. **

My first big refactor was moving the customer travel page away from reading trip data directly and having it fetch the data from the API in the travel controller. That removed duplicated data logic and meant the website and the admin app both used the same source of truth. In the Angular app, I refactored the listing page by pulling the trip markup into a separate trip card component. I later moved the HTTP calls into a trip data service, so components no longer handle requests themselves. Each of these changes made the code shorter and easier to read and debug.

Reusable UI components pay off in several ways. I write the layout once and use it for every trip, so a design change only has to happen in one place. Components are easier to test in isolation, they keep the code consistent, and they make new features such as the Add Trip and Edit Trip pages faster to build because I can reuse existing pieces.

## Testing

**Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application. **

An endpoint is a URL on the API that does one job, and the HTTP method tells the server what action to take on it. In Travlr, a GET request to `/api/trips` retrieves every trip, and a GET to `/api/trips/:tripCode` retrieves one. POST creates a new trip, PUT updates an existing one, and DELETE removes one. Each combination of method and endpoint must be tested to confirm it returns the correct data, the correct status code, and a useful error when something goes wrong. I tested these with Postman and by watching the browser's network tab while using the apps.

Security makes testing harder because protected routes now reject any request that does not carry a valid token. Reading trips stays public, but the routes that change data require a JWT that is created when an admin logs in through Passport. To test them I first must log in, copy the token, and send it in the Authorization header with each request. I also had to test the failure cases, such as a missing token, a wrong password, and an invalid token, to make sure the API returned an unauthorized response instead of letting the request through. The Angular side adds another layer because it must store the token and attach it to every protected request. Testing security means testing both what should work and what should be blocked.
