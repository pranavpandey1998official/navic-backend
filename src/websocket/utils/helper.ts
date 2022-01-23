import Message from '../../types/message'

const decodeMessage = (buffer: Buffer) : Message | string => {
    const payload = buffer.toString();
    try {
        const data: any =  JSON.parse(payload);
        return <Message>data;
    } catch(e) {
        return payload;
    }
}

const encodeMessage = (message: Message) => {
    return Buffer.from(JSON.stringify(message))
}

export { decodeMessage, encodeMessage };