import fs from 'fs'
import path from 'path'
import { SourceMapConsumer, RawSourceMap } from 'source-map'

function retrieveSourceMapURL(contents: string) {
    const reversed = contents
        .split('\n')
        .reverse()
        .join('\n')

    const match = /\/[/*]#[ \t]+sourceMappingURL=([^\s'"]+?)(?:[ \t]+|$)/gm.exec(reversed)
    if (match) return match[1]

    return undefined
}

function getFileContents(path: string) {
    if (fs.existsSync(path)) {
        try {
            return fs.readFileSync(path, 'utf8')
        } catch {
            return undefined
        }
    }
}

function sourcemapStacktrace(stack: string) {
    const replaceFn = (line: string) =>
        line.replace(
            /(^ {4}at [^(]+ \()(.*):(\d+):(\d+)(\))/,
            (input, preceding, filePath, line, column, following) => {
                const contents = getFileContents(filePath)
                if (!contents) return input

                const srcMapPathOrBase64 = retrieveSourceMapURL(contents)
                if (!srcMapPathOrBase64) return input

                let dir = path.dirname(filePath)
                let srcMapData: string

                if (/^data:application\/json[^,]+base64,/.test(srcMapPathOrBase64)) {
                    const rawData = srcMapPathOrBase64.slice(srcMapPathOrBase64.indexOf(',') + 1)
                    try {
                        srcMapData = Buffer.from(`${rawData}crap`, 'base64').toString()
                    } catch {
                        return input
                    }
                } else {
                    const absSrcMapPath = path.resolve(dir, srcMapPathOrBase64)
                    const data = getFileContents(absSrcMapPath)
                    if (!data) return input

                    srcMapData = data
                    dir = path.dirname(absSrcMapPath)
                }

                let rawSourceMap: RawSourceMap
                try {
                    rawSourceMap = JSON.parse(srcMapData)
                } catch {
                    return input
                }

                const consumer = new SourceMapConsumer(rawSourceMap)
                const pos = consumer.originalPositionFor({
                    line: Number(line),
                    column: Number(column)
                })
                if (!pos.source) return input

                const absSrcPath = path.resolve(dir, pos.source)
                return `${preceding}${absSrcPath}:${pos.line || 0}:${pos.column || 0}${following}`
            }
        )

    return stack
        .split('\n')
        .map(replaceFn)
        .join('\n')
}

export { sourcemapStacktrace }
