import jwt from 'jsonwebtoken';
import {  JWT_SECRET } from './utils/contants';
var a = jwt.sign({
    id: '000000017a0bb682ce84e60e',
    name: 'Pranav',
}, JWT_SECRET)

console.log(a);
