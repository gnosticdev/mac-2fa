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

export const objectEntries = <Obj extends Record<string, unknown>>(
    obj: Obj
) => {
    type KeyofObj = keyof Obj
    type Tuple = { [K in KeyofObj]: [K, Obj[K]] }[KeyofObj]
    return Object.entries(obj) as Tuple[]
}

// generate raw SQL for a given query by replacing the placeholders with the values
export const generateSQL = (sqlObject: {
    sql: string
    params: (string | number)[]
}) => {
    const { sql, params } = sqlObject
    let sqlString = sql
    params.forEach((param) => {
        sqlString = sqlString.replace('?', `"${param}"`)
    })
    return sqlString
}
