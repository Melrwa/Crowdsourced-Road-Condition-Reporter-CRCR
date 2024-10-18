# Crowdsourced-Road-Condition-Reporter-CRCR

A simple web app that allows users to report and view road conditions. Users can submit new reports, upvote/downvote, and search/filter reports by location, traffic, or status.

## Features

- **Submit Road Conditions**: Report traffic and weather conditions with an optional image.
- **View Reports**: See a list of reported roads, sorted by date.
- **Upvote/Downvote**: Vote on road reports and change their status (Good or Bad).
- **Search and Filter**: Search by name or location, filter by traffic severity.
- **Theme Toggle**: Switch between light and dark themes.

## Technologies Used

- **HTML5**, **CSS**, **JavaScript**
- **JSON Server** (for API)
- **Fetch API** (for HTTP requests)
## Livelink 
[Crowdsourced-Road-Condition-Reporter-CRCR](https://crowdsourced-road-condition-reporter-crcr.vercel.app/)

## Getting Started



1. Clone the repository:
    ```bash
    git clone https://github.com/Melrwa/Crowdsourced-Road-Condition-Reporter-CRCR.git
    ```

2. Run JSON Server:
    ```bash
       json-server --watch db.json --port 3000
    ```

3. Open `index.html` in your browser.

## API Endpoints

- **GET /roads**: Fetch all reports
- **POST /roads**: Add a new report
- **PATCH /roads/:id**: Update votes or status
- **DELETE /roads/:id**: Remove a report

## License

This project is licensed under the MIT License.
