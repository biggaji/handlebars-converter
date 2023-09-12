const http = require("http");
const path = require("path");
const { HandlebarsConverter } = require('../lib/index');

const hbs = new HandlebarsConverter({
    templateDirPath: path.join(__dirname, "views"),
    defaultLayoutFilePath: path.join(__dirname, "views", "layouts", "main.hbs"),
    partialDirPath: path.join(__dirname, "views", "partials") 
  });

// local test renders the generated html
const server = http.createServer(async function(request, response) {
  try {
      const htmlToRender =  await hbs.compile({
        templateName: "index",
        context: {
          year: new Date().getFullYear(),
          title: "Testing package"
        }
      })
    response.setHeader('Content-Type', 'text/html');
    response.write(htmlToRender);
    response.end();
    
  } catch (error) {
    throw error;
  }
});

server.listen(4000, () => {
  console.log(`Server running ...`)
});