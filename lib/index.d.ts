/*!
 * HandlebarsConverter
 * Copyright(c) 2023 Tobi Ajibade
 * MIT Licensed
 */
type TemplateInitOptions = {
    templateDirPath: string;
    extName?: string;
    partialDirPath?: string;
    defaultLayoutFilePath?: string;
};
type TemplateGenerationOptions = {
    templateName: string;
    context?: object;
};
/**
 * @class
 * @description A wrapper around handlebars that easily converts handlebars file to a html string or file
 * @author Tobi Ajibade
 */
export declare class HandlebarsConverter {
    private templateDirPath;
    private defaultExtName;
    private extName?;
    private defaultLayoutFilePath?;
    private partialDirPath?;
    constructor(configs: TemplateInitOptions);
    /**
     * @method compile
     * @description Compiles and generate a html code
     * @param {object} opts - The needed configuration data containing the template name and optional context to find and generate the html code.
     * @memberof HbsToHtml
    */
    compile(opts: TemplateGenerationOptions): Promise<string>;
    protected registerPartials(dir: string): Promise<void>;
}
export {};
