/**
 * json-pages
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

const glob = require('glob-promise')

const { promisify } = require('util')
const fs = require('fs')
const readFile = promisify(require('fs').readFile);

/**
 * Module exports.
 */

module.exports = jsonPages

/**
 * Creates a middleware that serves up json objects into template
 *
 * @param {string} folderPath
 * @param {string} key
 * @return {function}
 */

function jsonPages(folderPath, key = null) {
    if(typeof folderPath !== 'string') {
        console.error('Invalid path to folder')
        return 1
    }

    key = (typeof key === 'string') ? key : 0;
    let routes, ready = false;

    getRoutes(folderPath, key).then(resp => {
        ready = true;
        routes = resp;
    })

    return (req, res, next) => {
        if(!ready) next();

        const path = req.path.slice(1)

        if(routes[path]) {
            loadPage(routes, path, folderPath)
                .then(page => {
                    res.status(200).set('Content-Type', 'html')
                    res.end(page)
                })
                .catch(err => next(err))
        } else {
            next();
        }
    }
}

/*
 * Goes through all JSON files and stores each possible route
 */

async function getRoutes(folderPath, key) {
    const routes = {};

    const files = await glob(folderPath + '*.json')

    for(let file of files) {

        const data = await readFile(file, 'utf-8')

        JSON.parse(data).map((object, index) => {
            if(typeof key === 'string') {
                routes[object[key]] = { file, index }
            }
            else {
                routes[key++] = { file, index }
            }
        })
    }

    return routes
}

/*
 * Get's the data from the JSON file and injects into the html
 */

async function loadPage(routes, path, folderPath) {
    let route = routes[path];

    const jsonFile = await glob(route.file)
    const htmlFile = await glob(folderPath + '*.html')

    const jsonData = await readFile(jsonFile[0], 'utf-8')
    const htmlData = await readFile(htmlFile[0], 'utf-8')

    const object = JSON.parse(jsonData)[route.index]
    let page = htmlData;

    for(let key of Object.keys(object)) {
        page = page.replace(`{{${key}}}`, (object[key]))
    }
    page = page.replace(/{{[^}]*}}/g, '')

    return page
}
