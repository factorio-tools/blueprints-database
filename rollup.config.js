import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sucrase from 'rollup-plugin-sucrase'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
const svelteConfig = require('./svelte.config')

const mode = process.env.NODE_ENV
const dev = mode === 'development'

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
                dev,
                hydratable: true,
                emitCss: true,
                ...svelteConfig
            }),
            resolve({ extensions: ['.js', '.ts', '.mjs', '.json'] }),
            commonjs(),
            sucrase({
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
                generate: 'ssr',
                dev,
                ...svelteConfig
            }),
            resolve({ extensions: ['.js', '.ts', '.mjs', '.json'] }),
            commonjs(),
            sucrase({
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
            sucrase({
                include: ['**/*.ts'],
                exclude: ['node_modules/**'],
                transforms: ['typescript']
            }),
            !dev && terser()
        ]
    }
}
