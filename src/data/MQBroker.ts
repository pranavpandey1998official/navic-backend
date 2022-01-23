import amqp from 'amqplib';
import { RABBITMQ_URL } from 'utils/contants'

class MQBroker {
    static instance: MQBroker;
    connecton : amqp.Connection;

    constructor(connecton :amqp.Connection) {
        this.connecton =  connecton;
    }

    

    static getInstance() {
        if (!MQBroker.instance) {
            throw "MQBroker not initialized"
        }
        return MQBroker.instance
    }

    static async init() {
        if(!MQBroker.instance) {
            const connection = await amqp.connect(RABBITMQ_URL)
            console.log('Rabbitmq broker connected')
            MQBroker.instance = new MQBroker(connection);
        }
    } 

}

export default MQBroker;