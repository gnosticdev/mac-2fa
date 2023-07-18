/**
 * Converts an Apple timestamp to a Date object
 * ```typescript
 * const date = convertAppleTimestamp(372372372372)
 * console.log(date) // 1/1/1981, 12:12:12 AM
 * ```
 * @param {number} appleTimestamp - The timestamp to convert
 * @returns {Date} A date object representing the timestamp
 */
export const convertAppleTimestamp = (appleTimestamp: string | number) => {
    // Convert from nanoseconds to milliseconds
    const timestampInMilliseconds = Number(
        BigInt(appleTimestamp) / BigInt(1000000)
    )

    // Define the Apple Epoch in Unix time (milliseconds from Unix Epoch to Apple Epoch)
    const appleEpoch = 978307200000

    // Convert the timestamp to Unix time (milliseconds since Unix Epoch)
    const unixTimestamp = timestampInMilliseconds + appleEpoch

    // Create a new Date object from the Unix timestamp
    const date = new Date(unixTimestamp)

    // Return the date as a string
    return date.toLocaleString()
}

export type SqlQuery = {
    sql: string
    params: (string | number)[]
}

/**
 * Generates a SQL string by replacing placeholders with the corresponding values
 * @param {SqlQuery} sqlObject - An object containing the SQL string and its parameters
 * @returns {string} The generated SQL string
 */
export const generateSQL = (sqlObject: {
    sql: string
    params: (string | number)[]
}) => {
    const { sql, params } = sqlObject
    let sqlString = sql
    params.forEach((param) => {
        sqlString =
            typeof param === 'string'
                ? sqlString.replace('?', `"${param}"`)
                : sqlString.replace('?', param.toString())
    })
    return sqlString
}

/**
 * Type-safe Object.entries
 * @param {Record<string, unknown>} obj - The object to convert
 * @returns {Array<[string, unknown]>} An array of key-value tuples
 */
export const objectEntries = <Obj extends Record<string, unknown>>(
    obj: Obj
) => {
    type KeyofObj = keyof Obj
    type Tuple = { [K in KeyofObj]: [K, Obj[K]] }[KeyofObj]
    return Object.entries(obj) as Tuple[]
}
