# Mobile Web Specialist Certification Course
---

**To run my version of the project** - install all the dependencies with 'npm install', then run 'gulp start'. That will trigger gulp to compile all the files and start browser-sync, which will automatically launch a browser window pointing to localhost. 

The main JS files are all saved in the js folder. Saving in any of those files while the gulp start task is running will trigger an automatic recompiling of the files, and a refresh of the browser page should show the changes. (Ideally browser-sync should auto-reload the page, but sometimes it doesn't.) Same goes for the CSS file or either of the HTML files.

#### _Three Stage Course Material Project - Restaurant Reviews_

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application.

## Project Overview: Stage 1

In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

Stage One Project Rubric - [Stage 1 Rubric](https://review.udacity.com/#!/rubrics/1090/view)

## Project Overview: Stage 2

In **Stage Two**, you will take the responsive, accessible design you built in Stage One and connect it to an external server. You’ll begin by using asynchronous JavaScript to request JSON data from the server. You’ll store data received from the server in an offline database using IndexedDB, which will create an app shell architecture. Finally, you’ll work to optimize your site to meet performance benchmarks, which you’ll test using Lighthouse.

Stage Two Rubric - [Stage 2 Rubric](https://review.udacity.com/#!/rubrics/1131/view)

Stage Two Development Server - [Stage 2 Server](https://github.com/udacity/mws-restaurant-stage-2)

## Project Overview: Stage 3

In **Stage Three**, you will take the connected application you built in Stage One and Stage Two and add additional functionality. You will add a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. You'll also add functionality that allows users to favorite or unfavorite a restaurant. Finally, you’ll work to optimize your site to meet even stricter performance benchmarks than the previous project, and test again using Lighthouse.

Stage Three Rubric - [Stage 3 Rubric](https://review.udacity.com/#!/rubrics/1132/view)

Stage Three Development Server - [Stage 3 Server](https://github.com/udacity/mws-restaurant-stage-3)
