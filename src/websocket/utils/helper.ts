import Message from '../../customTypes/message'
import createLogger from '@utils/logger';

var logger = createLogger("websocket.WSConnection.decoder")

const decodeMessage = (buffer: Buffer | String) : Message | string => {
    const payload = buffer.toString();
    try {
        const data: any =  JSON.parse(payload);
        return <Message>data;
    } catch(e) {
        logger.error(e)
        return payload;
    }
}

const encodeMessage = (message: Message) => {
    return JSON.stringify(message)
}

export { decodeMessage, encodeMessage };