# Webpack Static Website Boilerplate

## About the Project

Boilerplate for building classic static websites using modern technology.

### Features
- **Modern technology:** ES6+ (Babel), Sass
- **Webpack:** Project bundling with Webpack
- **DevServer:** Local server with HMR
- **Imagemin:** Image minifying with Imagemin
- **EditorConfig и Prettier:** Code formatting on commit

### Project Structure
All development takes place in the `src` directory.
- `fonts`
- `img`
- `js`
- `scss`
- `static`

HTML files are located in the `src` root. It is possible to use LoDash as a templating tool (you can create a separate directory for templates).

More about `static`.  
Webpack copies all its content to the root of the build directory. To use static files in HTML, you need to start the path to them with `./`, for example, `./favicon.ico`.

Build configuration is in the `config` object in the file `webpack.config.js`.

## Installation and Usage
```
npm install
```

To make the pre-commit hook work, you need to run `npm install` when the project is already initialized as a Git repository.

If the project is initialized as a repository later, you need to additionally execute `npm run prepare`.

### Development
```
npm start
```

### Production
```
npm run build
```

## Contact
Dmitrii Sviridov  
Telegram: [slamach](https://t.me/slamach)  
Email: sviridov.dvv@gmail.com
