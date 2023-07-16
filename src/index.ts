import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { message, handle } from './schema'
import { eq, and, desc, sql, isNotNull, notInArray } from 'drizzle-orm'
import { parseAttributedBody } from './parse'
import os from 'os'

const DB_PATH = os.homedir() + '/Library/Messages/chat.db'
if (!DB_PATH) {
    throw new Error('Could not find text messages database')
}

const sqlite = new Database(DB_PATH, { readonly: true })
const db: BunSQLiteDatabase = drizzle(sqlite)

// add any handles you want to ignore here
const ignoredHandles = [
    1224, // Truist
]

const recentMessages = db
    .selectDistinct({
        date: sql<string>`cast(${message.date} AS TEXT)`,
        attributedBody: message.attributedBody,
        text: message.text,
        handleId: handle.rowid,
        phoneNumber: handle.id,
    })
    .from(message)
    .where(
        and(
            eq(message.service, 'SMS'),
            isNotNull(message.attributedBody),
            sql`length(${handle.id}) in (5,6)`,
            notInArray(message.handleId, ignoredHandles)
        )
    )
    .innerJoin(handle, eq(handle.rowid, message.handleId))
    .orderBy(desc(message.date))
    .limit(1)

const results = recentMessages.all()

const row = results[0]
if (!row) {
    throw new Error('Could not find any recent messages')
}
// message text is either a string in the text column, or a blob in the attributedBody column
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
console.log(code)
