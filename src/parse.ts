export function parseAttributedBody(attributedBody: Uint8Array) {
    // message text is found after the NSString marker, so lets find that first
    const marker = Buffer.from('NSString')
    const position = attributedBody.findIndex((_, index) =>
        // Check if the next 8 bytes match the marker
        marker.every((val, i) => attributedBody[index + i] === val)
    )
    if (position === -1) {
        throw new Error('NSString marker not found in data')
    }

    // Strip off data before the NSString marker
    let textData = attributedBody.slice(position + marker.length)
    // Strip off the 5-bytes of useless data between the marker and the message text
    textData = textData.slice(5)

    // Check the first byte
    const firstByte = textData[0]
    if (!firstByte) throw new Error('Could not find first byte of text data')
    let textLength = 0
    // If the first byte is 0x80, the length is stored in the next byte
    if (firstByte === 0x81) {
        // If the first byte is 0x81, the length is stored in the next 2 bytes
        const dataView = new DataView(textData.buffer)
        textLength = dataView.getUint8(1) // false for big-endian
        textData = textData.slice(3, 3 + textLength)
    } else {
        // Otherwise, the first byte is the length
        textLength = firstByte
        textData = textData.slice(1, 1 + textLength)
    }

    // Decode the text data as a UTF-8 string
    const text = Buffer.from(textData).toString('utf8')

    return text
}
