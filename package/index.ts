/*!
 * HandlebarsConverter
 * Copyright(c) 2023 Tobi Ajibade
 * MIT Licensed
 */

import * as fs from "fs/promises";
import * as path from "path";
import * as handlebars from "handlebars";

type TemplateInitOptions = {
  templateDirPath: string,
  extName?: string;
  partialDirPath?: string,
  defaultLayoutFilePath? : string,
}

type TemplateGenerationOptions = {
  templateName: string,
  context?: object,
}

/**
 * @class 
 * @description A wrapper around handlebars that easily converts handlebars file to a html string or file
 * @author Tobi Ajibade
 */

export class HandlebarsConverter {
  private templateDirPath: string;
  private defaultExtName = 'hbs';
  private extName?: string;
  private defaultLayoutFilePath?: string;
  private partialDirPath?: string;

  constructor(configs: TemplateInitOptions) {
    const { templateDirPath, defaultLayoutFilePath, partialDirPath, extName } = configs;

    // validate required config paramater
    if (!templateDirPath) {
      throw new Error('Template directory is required');
    };

    this.templateDirPath = templateDirPath;
    this.extName = (extName !== undefined) ? extName : this.defaultExtName;
    this.defaultLayoutFilePath = defaultLayoutFilePath;
    this.partialDirPath = partialDirPath;
  };

  /**
   * @method compile
   * @description Compiles and generate a html code
   * @param {object} opts - The needed configuration data containing the template name and optional context to find and generate the html code.
   * @memberof HbsToHtml
  */
  
  async compile(opts: TemplateGenerationOptions) {
    try {
      const { templateName, context } = opts;

      // validate required properties
      if (!templateName || templateName === "" || typeof templateName !== 'string') {
        throw new Error('Template name is required to read and compile code to html');
      };

      const template = await fs.readFile(path.join(this.templateDirPath, `${templateName}.${this.extName}`), "utf-8");
      const contextPayload = {};

      // if partial is provided, register it
      if (this.partialDirPath) {
        await this.registerPartials(this.partialDirPath);
      };
      
      // compile template
      const compiledTemplate = handlebars.compile(template);

      // if context object is provided
      if (context) {
        Object.assign(contextPayload, context);
      };

      // if layout file path is provided, register it
      if (this.defaultLayoutFilePath) {
        const layoutFileContent = await fs.readFile(this.defaultLayoutFilePath, "utf-8");
        const layout = handlebars.compile(layoutFileContent);
        const viewTemplate = compiledTemplate(contextPayload);
        
        // inject the template into the main layout
        return layout({ body: viewTemplate, ...contextPayload });
      } else {
        return compiledTemplate(contextPayload);
      }
    } catch (error) {
      console.error('An error occured while compiling file to html', error);
      throw error;
    };
  };

  protected async registerPartials(dir: string) {
    try {
      if (!dir || dir === "" || typeof dir !== 'string') {
        throw new Error("Partial directory is required to register and populate partials within the template");
      };

      const files = await fs.readdir(dir);

      if (files.length === 0) {
        throw new Error("Partial directory is empty, no file(s) found");
      };

      for (const file of files) {
        // check file extention and use accordingly
        let extName = "hbs";
        let fileMeta = file.split(".");

        if (fileMeta[1] !== extName) {
          extName = "handlebars"
        };

        const partialFileName = file.replace(extName, "");
        const partialFileContent = await fs.readFile(path.join(dir, `${partialFileName}${extName}`), "utf-8");

        // slice the . after the filename away
        const keyName = partialFileName.split(".")[0];

        // an util function just for injecting dyanamic property name into object
        function getTemplateKeyName(key: string) {
          return `${key}`;
        }

        // construct partial object 
        const partialObject: object = {
          [getTemplateKeyName(keyName)]: partialFileContent,
        };

        //register the partials on the handlebar partial object
        Object.assign(handlebars.partials, partialObject);
      };
    } catch (error) {
      console.error('An error occured while registering partial files', error);
      throw error;
    };
  };
};
