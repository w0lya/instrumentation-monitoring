# Reporting App

[![Build status](https://ci.appveyor.com/api/projects/status/drra1gtp1r2tqp1q?svg=true)](https://ci.appveyor.com/project/w0lya/instrumentation-monitoring)

A simple socket-based application implemented for displaying web request tracing data.
Intended to be used together with [Instrumentation Middleware](https://github.com/w0lya/DotnetInstrumentation).
The Middleware component, when hooked to a running .NET Core web site, fetches information about every request and sends it to an endpoint specified in configuration. This reporting application is what is behind that endpoint. In the next section, the main features of the app are described.

## Features
- Listens for incoming requests and saves request data to an Azure-hosted instance of MongoDb.
- Reads the pre-existing request data from MongoDb and displays it.
- While listening for incoming requests, updates the web page displaying the data in real time.

## Prerequisites
1. [npm](https://www.npmjs.com/get-npm)
2. [Node.js](https://nodejs.org/en/download/)
3. [Mongoose](https://www.npmjs.com/package/mongoose)
4. [Socket.IO](https://www.npmjs.com/package/socket.io)

## Running locally
1. Clone the repository
2. Open the containing folder in Visual Studio Code
3. Open Terminal ( Ctrl + ` )
4. Run 'npm update'
5. Run 'node server.js'
6. in your browser, go to localhost:3000. The app should load the pre-existing request data if any.

## Seeing updates in real time

When you post data to /messages route, the app saves it and adds it to the UI instantly.

Here is an example of a request:
```
{
  "TimeStamp" : "2019-04-04T04:00:00.000+00:00",  
  "RequestUrl" : "localhost:5000/home", 
  "ResponseTime" : 342,
  "ResponseBodySize" : 888
 }
 ```
To test, open Postman or Fiddler, create a POST request to localhost:3000/messages with the sample JSON data and send it. You should see the new entry appearing in the beginning of the table on the page.

## Tech Stack
This monitoring (reporting) app is based on Node.js on the backend, uses Socket.IO and the UI part is implemented using Vue.js.

## Future improvements
1. Move MongoDb connection string into config.
2. Use token-based authentication instead of user + password.
3. Use TypeScript for type safety.
4. Install and reference all the dependencies via a package manager, remove hardcoded CDN links.
5. Add minification, linting etc.
6. Implement more unit and integration tests.
7. Protect the app against heavy load by:
  - turning the request data log table into a paginated grid. Use a standard grid component
  - adding logic to batch the UI updates when the frequency of incoming requests is high
  - adding logic to purge the old data and only leave the X most recent records to be loaded (or move to a new 'archive' Db collection in Mongo)
  - limiting the Max number of allowed connections to socket
8. Take response codes into consideration when calculating response size stats (only calc for 200 ones).
9. Logging, exception handling...
10. Unit and integration tests.
10. Config merging.
11. Separate Components in the UI.
12. Folder structure (server, client etc.)
13. Enable logging and reporting from multiple applications.
14. Enable filtering, sorting of the logs (might just be done in 7.).
15. Add 'how to deploy' to README.


 
