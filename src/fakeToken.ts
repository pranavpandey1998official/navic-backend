import jwt from 'jsonwebtoken';
import {  JWT_AUTH_SECRET } from './utils/contants';
var a = jwt.sign({
    id: '6280e87789e5e72b46194b82',
    name: 'Pranav',
}, JWT_AUTH_SECRET)

console.log(a);
