const sucrase = require('sucrase')
const sass = require('node-sass')
// const stylus = require('stylus')

// Needed for the svelte-vscode extension
module.exports = {
    preprocess: {
        style: ({ content, attributes, filename }) => {
            if (attributes.type !== 'text/sass' && attributes.lang !== 'sass') return

            // Needed because svelte indents the style content
            content = content.replace(/^    /gm, '')

            return new Promise((resolve, reject) => {
                sass.render(
                    {
                        data: content,
                        includePaths: ['src', 'node_modules'],
                        sourceMap: true,
                        indentedSyntax: true,
                        indentWidth: 4,
                        outFile: filename + '.css'
                    },
                    (err, result) => {
                        if (err) return reject(err)

                        resolve({
                            code: result.css.toString(),
                            map: result.map.toString(),
                            dependencies: result.stats.includedFiles
                        })
                    }
                )
            })

            // if (attributes.lang !== 'stylus') return

            // return new Promise((resolve, reject) => {
            //     const style = stylus(content, {
            //         filename,
            //         sourcemap: true
            //     })

            //     style.render((err, css) => {
            //         if (err) reject(err)

            //         resolve({ code: css, /*dependencies: style.deps(),*/ map: style.sourcemap })
            //     })
            // })
        },
        script: ({ content, attributes, filename }) => {
            if (attributes.lang !== 'typescript') return

            return new Promise((resolve, reject) => {
                try {
                    const result = sucrase.transform(content, {
                        transforms: ['typescript'],
                        filePath: filename,
                        sourceMapOptions: {
                            compiledFilename: filename
                        }
                    })

                    resolve({ code: result.code, map: result.sourceMap })
                } catch (e) {
                    reject(e)
                }
            })
        }
    }
}
