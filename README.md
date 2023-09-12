# handlebars-converter
Converts handlebars code with partials or(and) layout to html.

# Hypothesis
I built this package specfically because I want an easier way to generate or compile a handlebars file into html code that I could pass to my `nodemailer` html property without having to set up a server e.g(`expressjs`) basically just because I need to use handlebars as html templating engine with nodemailer.

Apart from that most handlebars packages relies on a web server to work, some implementation details are not clear enough lol.

So I need to build a simple package that helps me achieve my goal and offers the same capability as `express-handlebars`, but standalone, does not rely on a web server to work. IT JUST WORKS.

# Installation

```sh
npm install handlebars-converter
or
yarn add handlebars-converter
```

# Usage

## Configuration

The package can be initialized with several options:

```js
const { HandlebarsConverter } = require("handlebars-converter");

const templateConverter = new HandlebarsConverter({
  templateDirPath: "path/to/views",
});
```

| Options   | Required | Description                                                  |
| --------------- | -------- | ----------------------------- |
| `templateDirPath`   | yes      | Directory path to where the template files are located. |
| `defaultLayoutFilePath` | no | The file path of the default layout file including the file extention e.g (`'./layouts/main.hbs'`). |
| `partialDirPath` | no | Directory path to where the partial files are located.|
| `extName` | no | The handlebars file extention being use in your code. Defaults to `"hbs"` if not provided. |

You can initialize the package accordingly based on what options you have i.e are there partial files? Add the `partialDirPath` option to the constructor and provide the directory path as it value, do you have a default layout? Add the `defaultLayoutFilePath` option and provide the file path as a value to it. The optional fields work independent of each other. You provide what you have and you get an output of what you provide 😀. 


The following example initialize the package with the all options providing the  `partials` directory, the `layout` file, and an `extName` for of the handlebars files.

```js
const templateConverter = new HandlebarsConverter({
  templateDirPath: "path/to/views",
  defaultLayoutFilePath: "path/to/layouts/main.hbs",
  partialDirPath: "path/to/partials",
  extName: "hbs",
});
```

## Generating the html code
Use the `compile()` method available on the templateConverter class instance created earlier to generate an html output, it returns a promise so we need to use await keyword.

```js
const generatedHtml = await templateConverter.compile({
  templateName: "filename",

  // any data you want to pass into the template(s)
  context: {},
});
```

| Options   | Required | Description                                                  |
| --------------- | -------- | ----------------------------- |
| `templateName`   | yes      | Name of the handlebars template file `e.g(index.hbs)`, `index` is the templateName |
| `context` | no | An object containing data you want to inject into the template(s) |



# Example

The template file

./views/index.hbs
```hbs
  <p>This is a test paragraph.</p>
```


> **Note** Please make sure your layout file includes the `{{{body}}}` within your body tag to inject the template else your template won't show.

The layout file

./views/layouts/main.hbs
```hbs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    p {
      color: tomato;
    }
  </style>
</head>
<body>
  {{> header}}
    {{{body}}}
  {{> footer}}
</body>
</html>
```

Header partial file

./views/partials/header.hbs
```hbs
<h1>This a test header.</h1>
```

Footer partial file

./views/partials/footer.hbs
```hbs
<h1>Copyright &copy; sdk package Inc {{year}}</h1>
```

```js
const path = require("path");
const { HandlebarsConverter } = require("handlebars-converter");

const templateConverter = new HandlebarsConverter({
  templateDirPath: path.join(__dirname, "views"), //required
  defaultLayoutFilePath: path.join(__dirname, "views", "layouts", "main.hbs"),
  partialDirPath: path.join(__dirname, "views", "partials"),
  extName: "hbs"
});

async function generateHtml(filename) {
  const generatedHtml = await templateConverter.compile({
    templateName: filename,

    //any data you want to pass into the template(s)
    context: {
      year: new Date().getFullYear(),
      title: "Testing package"
    }
  });

  return generatedHtml; 
}

// would return a compiled html code with all the template data injected
generateHtml("index"); 
```

I tested the code using http server, i generated the html code and passed the output to be rendered to the client. Screenshot below:

![Screen shot of the above implementation result](https://res.cloudinary.com/dahn8uiyc/image/upload/v1688652447/hbs-to-html-snipshot_lug4m3.png)


Check out the example [code implementation here](https://github.com/biggaji/handlebars-converter/tests).


## How can I thank you?

Star the [Github repo](https://github.com/biggaji/handlebars-converter). I'd love the attention! Why not share the link for this repository on Twitter, Thread or HackerNews? Spread the word📢!

Don't forget to follow me on [Twitter](https://twitter.com/oxwware) and on [Thread](https://threads.net/@oxwware). Let's chat.

# Issues
Please use the [issues tab](https://github.com/biggaji/handlebars-converter/issues) on Github to create issues you encountered or feature you would love to see included in this awesome package.

# Thank You!
Please freely reach out to me on the above channels.
Thanks for using my package.
