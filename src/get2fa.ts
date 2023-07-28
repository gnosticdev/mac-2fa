import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { message, handle } from './schema'
import { eq, and, desc, sql, isNotNull, notInArray, SQL } from 'drizzle-orm'
import { parseAttributedBody } from './parse'
import os from 'os'
import { SqlQuery, generateSQL } from './utils'
import ignore from '../ignore.json'

// TODO: add cli args to get messages from a specific phone number
const CLI_OPTIONS = ['raw', 'debug', 'use-all'] as const
type Flag = (typeof CLI_OPTIONS)[number]

// get flags and the values passed to them (if any)
const flags = process.argv
    .slice(2)
    .filter((arg) => arg.startsWith('--')) // only get flags
    .map((arg) => arg.replace('--', '')) as Flag[]

if (flags.length > 0 && flags.some((flag) => !CLI_OPTIONS.includes(flag))) {
    throw new Error(
        `Invalid flag(s) passed: ${flags.filter(
            (flag) => !CLI_OPTIONS.includes(flag)
        )}`
    )
}

// ----------------- CLI ENTRY POINT -----------------
// run the function and log the code to stdout
const code = get2faCode(flags)
console.log(code) // necessary for Automation App (e.g. Automator) to receive code
// ----------------- END -----------------

// TODO: add cli args to get messages from a specific phone number
export function get2faCode(cliFlags?: Flag[]) {
    // Messages DB is located at ~/Library/Messages/chat.db always unless you've moved it
    const DB_PATH = os.homedir() + '/Library/Messages/chat.db'
    if (!DB_PATH) {
        throw new Error('Could not find text messages database')
    }

    const sqlite = new Database(DB_PATH, { readonly: true })
    const db: BunSQLiteDatabase = drizzle(sqlite)

    // ignore these phone numbers
    const ignoredNumbers = ignore.ignoredNumbers || []
    const numbersQuery: SQL<string> | undefined = flags.includes('use-all')
        ? undefined
        : sql`length(${handle.id}) in (5,6)`
    // Selecting more columns than needed to make debugging easier
    const recentMessages = db
        .selectDistinct({
            date: sql<string>`cast(${message.date} AS TEXT)`,
            attributedBody: message.attributedBody, // almost all 2fa codes are found in this column
            text: message.text, // some 2fa codes are found in this column
            handleId: handle.rowid,
            phoneNumber: handle.id,
        })
        .from(message)
        .where(
            and(
                eq(message.service, 'SMS'), // 2fa codes are never sent via iMessage
                isNotNull(message.attributedBody),
                numbersQuery,
                notInArray(handle.id, ignoredNumbers)
            )
        )
        .innerJoin(handle, eq(handle.rowid, message.handleId))
        .orderBy(desc(message.date))
        .limit(10)

    // return the raw sql query
    if (cliFlags?.includes('raw')) {
        return generateSQL(recentMessages.toSQL() as SqlQuery)
    }

    const results = recentMessages.all()
    // Send back debugger object if debug flag is passed
    if (cliFlags?.includes('debug')) {
        return {
            query: generateSQL(recentMessages.toSQL() as SqlQuery),
            results: results.map((row) => ({
                messageText: row.attributedBody
                    ? parseAttributedBody(row.attributedBody)
                    : row.text,
                handleId: row.handleId,
                phoneNumber: row.phoneNumber,
            })),
        }
    }

    // find the first message with a 2fa code
    for (const row of results) {
        if (!row) {
            throw new Error('Could not find any recent messages')
        }

        // message text is usually found in the attributedBody column, but lets try this first
        let messageText = row.text
        if (!messageText && row.attributedBody) {
            messageText = parseAttributedBody(row.attributedBody)
        } else if (!messageText) {
            throw new Error('Could not find message text')
        }

        messageText = messageText.replace(/\s/g, '')
        // 2fa code regex should match 5-7 digits,
        const code = messageText.match(/\d{5,7}/)?.[0]
        if (code) {
            // Print to stdout for use Automator/Shortcuts/Keyboard Maestro/Alfred/etc.
            return code
        }
    }

    return 'Could not find any 2fa codes'
}
