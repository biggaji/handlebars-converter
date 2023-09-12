"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlebarsConverter = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const handlebars = __importStar(require("handlebars"));
/*!
 * HandlebarsConverter
 * Copyright(c) 2023 Tobi Ajibade
 * MIT Licensed
 */
/**
 * @class
 * @description A wrapper around handlebars that easily converts handlebars file to a html string or file
 * @author Tobi Ajibade
 */
class HandlebarsConverter {
    constructor(configs) {
        this.defaultExtName = 'hbs';
        const { templateDirPath, defaultLayoutFilePath, partialDirPath, extName } = configs;
        // validate required config paramater
        if (!templateDirPath) {
            throw new Error('Template directory is required');
        }
        ;
        this.templateDirPath = templateDirPath;
        this.extName = (extName !== undefined) ? extName : this.defaultExtName;
        this.defaultLayoutFilePath = defaultLayoutFilePath;
        this.partialDirPath = partialDirPath;
    }
    ;
    /**
     * @method compile
     * @description Compiles and generate a html code
     * @param {object} opts - The needed configuration data containing the template name and optional context to find and generate the html code.
     * @memberof HbsToHtml
    */
    compile(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateName, context } = opts;
                // validate required properties
                if (!templateName || templateName === "" || typeof templateName !== 'string') {
                    throw new Error('Template name is required to read and compile code to html');
                }
                ;
                const template = yield fs.readFile(path.join(this.templateDirPath, `${templateName}.${this.extName}`), "utf-8");
                const contextPayload = {};
                // if partial is provided, register it
                if (this.partialDirPath) {
                    yield this.registerPartials(this.partialDirPath);
                }
                ;
                // compile template
                const compiledTemplate = handlebars.compile(template);
                // if context object is provided
                if (context) {
                    Object.assign(contextPayload, context);
                }
                ;
                // if layout file path is provided, register it
                if (this.defaultLayoutFilePath) {
                    const layoutFileContent = yield fs.readFile(this.defaultLayoutFilePath, "utf-8");
                    const layout = handlebars.compile(layoutFileContent);
                    const viewTemplate = compiledTemplate(contextPayload);
                    // inject the template into the main layout
                    return layout(Object.assign({ body: viewTemplate }, contextPayload));
                }
                else {
                    return compiledTemplate(contextPayload);
                }
            }
            catch (error) {
                console.error('An error occured while compiling file to html', error);
                throw error;
            }
            ;
        });
    }
    ;
    registerPartials(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!dir || dir === "" || typeof dir !== 'string') {
                    throw new Error("Partial directory is required to register and populate partials within the template");
                }
                ;
                const files = yield fs.readdir(dir);
                if (files.length === 0) {
                    throw new Error("Partial directory is empty, no file(s) found");
                }
                ;
                for (const file of files) {
                    // check file extention and use accordingly
                    let extName = "hbs";
                    let fileMeta = file.split(".");
                    if (fileMeta[1] !== extName) {
                        extName = "handlebars";
                    }
                    ;
                    const partialFileName = file.replace(extName, "");
                    const partialFileContent = yield fs.readFile(path.join(dir, `${partialFileName}${extName}`), "utf-8");
                    // slice the . after the filename away
                    const keyName = partialFileName.split(".")[0];
                    // an util function just for injecting dyanamic property name into object
                    function getTemplateKeyName(key) {
                        return `${key}`;
                    }
                    // construct partial object 
                    const partialObject = {
                        [getTemplateKeyName(keyName)]: partialFileContent,
                    };
                    //register the partials on the handlebar partial object
                    Object.assign(handlebars.partials, partialObject);
                }
                ;
            }
            catch (error) {
                console.error('An error occured while registering partial files', error);
                throw error;
            }
            ;
        });
    }
    ;
}
exports.HandlebarsConverter = HandlebarsConverter;
;
