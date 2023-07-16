import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { message, handle } from './schema'
import { eq, and, desc, sql, isNotNull, notInArray } from 'drizzle-orm'
import { parseAttributedBody } from './parse'
import os from 'os'
import { generateSQL } from './utils'
import ignore from '../ignore.json'

// run the function and log the code ts tdout
const code = get2faCode()
console.log(code) // necessary for Automator or Keyboard Maestro to get the code

// TODO: add cli args to get messages from a specific phone number
export function get2faCode(args: string[] = []) {
    const DB_PATH = os.homedir() + '/Library/Messages/chat.db'
    if (!DB_PATH) {
        throw new Error('Could not find text messages database')
    }

    const sqlite = new Database(DB_PATH, { readonly: true })
    const db: BunSQLiteDatabase = drizzle(sqlite)

    // ignore these phone numbers
    const ignoredNumbers = ignore.ignoredNumbers || []

    const recentMessages = db
        .selectDistinct({
            date: sql<string>`cast(${message.date} AS TEXT)`,
            attributedBody: message.attributedBody, // almost all 2fa codes are found in this column
            text: message.text,
            handleId: handle.rowid,
            phoneNumber: handle.id,
        })
        .from(message)
        .where(
            and(
                eq(message.service, 'SMS'), // 2fa codes are never sent via iMessage
                isNotNull(message.attributedBody),
                sql`length(${handle.id}) in (5,6)`,
                notInArray(handle.id, ignoredNumbers)
            )
        )
        .innerJoin(handle, eq(handle.rowid, message.handleId))
        .orderBy(desc(message.date))
        .limit(1)

    // Uncomment to see the generated SQL
    // console.log(
    //     generateSQL(
    //         recentMessages.toSQL() as {
    //             sql: string
    //             params: (string | number)[]
    //         }
    //     )
    // )
    const results = recentMessages.all()

    const row = results[0]
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
    // Remove whitespace
    messageText = messageText.replace(/\s/g, '')
    // 2fa code regex should match 5-7 digits,
    const code = messageText.match(/\d{5,7}/)?.[0]
    if (!code) {
        throw new Error('Could not find 2fa code')
    }
    // Print to stdout for use Automator/Shortcuts/Keyboard Maestro/Alfred/etc.
    return code
}
