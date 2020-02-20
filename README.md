# SeisMix Frontend - README

## Settup: (NOTE: App was created with create-react-app, for default script info, see bottome of README)

To settup this app, after cloning run npm install to install all package dependencies. The main dependencies for this project are: 

- "d3": "^5.15.0"
- "react": "^16.12.0"
- "react-chartjs-2": "^2.9.0"
- "react-dom": "^16.12.0"
- "react-redux": "^7.1.3"
- "react-router-dom": "^5.1.2"
- "redux": "^4.0.5"
- "semantic-ui-react": "^0.88.2"
- "sweetalert2-react": "^0.8.3"
- "topojson-client": "^3.1.0"

After installing, running "yarn build" will create an optimized, minified version of the application that you can boot up with "serve -s build". This make take two to three minutes to complete. Alternatively, if you want to boot up the application in development mode, run "npm start".

Some functions may not work if you aren't running your backend on localhost:3000. If your backend is running on a different port, go to the reducer file at "/reducers/reducer.js". At the top of the file their should be an initialState variable that handles all the load-up defaults for the application. At the very top is a "domain" key set to "localhost:3000". Change the value to whatever domain your backend is being hosted on.

## Components

This segment will be a brief rundown of the major components and some of their responsibilities. An extensive component tree for this app is displayed below:

![alt text][logo]
[logo]: ./public/componentTree.png "Logo Title Text 2"

This is a rough idea of the filenames and their relationships/positions along the tree. Since state in this app is being handled almost entirely by redux, this tree won't usually need to be referred too aside from determining what pages render which blocks.


# Default README

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
