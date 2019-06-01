import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sucrasePlugin from 'rollup-plugin-sucrase'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'

import sucrase from 'sucrase'
import sass from 'node-sass'
// import stylus from 'stylus'

const mode = process.env.NODE_ENV
const dev = mode === 'development'

const preprocessObj = {
    style: ({ content, attributes, filename }) => {
        if (attributes.lang !== 'sass') return

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
                    production: !dev,
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

export default {
    client: {
        input: config.client.input().replace(/\.js$/, '.ts'),
        output: config.client.output(),
        plugins: [
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            svelte({
                //preprocess: preprocess(opts),
                dev,
                hydratable: true,
                emitCss: true,
                preprocess: preprocessObj
            }),
            resolve({ extensions: ['.js', '.ts', '.mjs', '.json'] }),
            commonjs(),
            sucrasePlugin({
                include: ['**/*.ts'],
                exclude: ['node_modules/**'],
                transforms: ['typescript']
            }),

            !dev &&
                terser({
                    module: true
                })
        ]
    },

    server: {
        input: { server: config.server.input().server.replace(/\.js$/, '.ts') },
        output: config.server.output(),
        plugins: [
            replace({
                'process.browser': false,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            svelte({
                //preprocess: preprocess(opts),
                generate: 'ssr',
                dev,
                preprocess: preprocessObj
            }),
            resolve({ extensions: ['.js', '.ts', '.mjs', '.json'] }),
            commonjs(),
            sucrasePlugin({
                include: ['**/*.ts'],
                exclude: ['node_modules/**'],
                transforms: ['typescript']
            })
        ],
        external: Object.keys(pkg.dependencies).concat(
            require('module').builtinModules || Object.keys(process.binding('natives'))
        )
    },

    serviceworker: {
        input: config.serviceworker.input().replace(/\.js$/, '.ts'),
        output: config.serviceworker.output(),
        plugins: [
            resolve(),
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            commonjs(),
            !dev && terser()
        ]
    }
}
