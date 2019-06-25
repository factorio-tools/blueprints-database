import alias from 'rollup-plugin-alias'
import commonjs from 'rollup-plugin-commonjs'
import config from 'sapper/config/rollup.js'
import graphql from '@kocal/rollup-plugin-graphql'
import path from 'path'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { string } from 'rollup-plugin-string'
const svelteConfig = require('./svelte.config')

// Detect if we are building the app
const build = process.argv.includes('build')

// https://github.com/sveltejs/sapper-template/blob/36d8b980351a084b256795dc1dc7f5b3c238b55b/rollup.config.js#L14
const onwarn = (warning, onwarn) =>
    (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning)

export default {
    client: {
        input: config.client.input().replace(/\.js$/, '.ts'),
        output: config.client.output(),
        onwarn,
        plugins: [
            replace({
                'process.browser': true
            }),
            svelte({
                dev: !build,
                hydratable: true,
                emitCss: true,
                ...svelteConfig
            }),
            alias({
                resolve: ['.js', '.ts', '.gql', '.svelte'],
                '~': path.join(__dirname, './src'),
                'type-graphql': path.join(__dirname, './node_modules/type-graphql/dist/browser-shim')
            }),
            resolve({ extensions: ['.mjs', '.js', '.ts', '.json'] }),
            commonjs(),
            graphql(),
            typescript({
                check: false
            }),

            build &&
                terser({
                    module: true
                })
        ]
    },

    server: {
        input: { server: config.server.input().server.replace(/\.js$/, '.ts') },
        output: config.server.output(),
        onwarn,
        plugins: [
            replace({
                'process.browser': false
            }),
            svelte({
                generate: 'ssr',
                dev: !build,
                ...svelteConfig
            }),
            alias({
                resolve: ['.js', '.ts', '.gql', '.svelte'],
                '~': path.join(__dirname, './src')
            }),
            resolve({ extensions: ['.js', '.ts', '.mjs', '.json'] }),
            commonjs(),
            graphql(),
            typescript({
                check: false
            }),
            string({
                include: '**/*.graphqls'
            })
        ],
        external: Object.keys(pkg.dependencies).concat(
            require('module').builtinModules || Object.keys(process.binding('natives'))
        )
    },

    serviceworker: {
        input: config.serviceworker.input().replace(/\.js$/, '.ts'),
        output: config.serviceworker.output(),
        onwarn,
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                check: false
            }),
            build && terser()
        ]
    }
}
