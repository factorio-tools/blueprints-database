import alias from 'rollup-plugin-alias'
import commonjs from 'rollup-plugin-commonjs'
import config from 'sapper/config/rollup.js'
import graphql from '@kocal/rollup-plugin-graphql'
var path = require('path')
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { string } from 'rollup-plugin-string'
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
            resolve({ browser: true, extensions: ['.mjs', '.js', '.ts', '.json'] }),
            commonjs(),
            alias({
                resolve: ['.js', '.ts', '.gql', '.svelte'],
                '~': path.join(__dirname, './src')
            }),
            graphql(),
            typescript({
                check: false
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
            alias({
                resolve: ['.js', '.ts', '.gql', '.svelte'],
                '~': path.join(__dirname, './src')
            }),
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
        plugins: [
            resolve(),
            replace({
                'process.browser': true,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            commonjs(),
            alias({
                resolve: ['.js', '.ts', '.gql', '.svelte'],
                '~': path.join(__dirname, './src')
            }),
            typescript({
                check: false
            }),
            !dev && terser()
        ]
    }
}
