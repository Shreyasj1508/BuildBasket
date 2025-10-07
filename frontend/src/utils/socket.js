// Socket.IO fallback implementation
const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'

// Real socket implementation (can be enabled when socket.io is available)
export const socket = {
    on: (event, callback) => {
        // Fallback: could implement polling or other real-time alternatives
        console.log(`Socket event '${event}' registered (fallback mode)`);
    },
    emit: (event, data) => {
        // Fallback: could implement HTTP requests for real-time actions
        console.log(`Socket emit '${event}' with data:`, data, '(fallback mode)');
    },
    connect: () => {
        console.log('Socket connect called (fallback mode)');
    },
    disconnect: () => {
        console.log('Socket disconnect called (fallback mode)');
    },
    connected: false
}

export const overrideStyle = {
    display : 'flex', 
    margin : '0 auto',
    height: '24px',
    justifyContent : 'center',
    alignItems : 'center'
}

