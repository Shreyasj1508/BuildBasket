import io from 'socket.io-client'

export const overrideStyle = {
    display : 'flex', 
    margin : '0 auto',
    height: '24px',
    justifyContent : 'center',
    alignItems : 'center'
}

const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'
export const socket = io(socketURL, {
    transports: ['websocket', 'polling'],
    upgrade: true,
    rememberUpgrade: true
})