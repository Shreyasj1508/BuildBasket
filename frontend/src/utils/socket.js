// Socket.IO removed - using fallback implementation
// const socketURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'

// Mock socket object for compatibility
export const socket = {
    on: () => {},
    emit: () => {},
    connect: () => {},
    disconnect: () => {},
    connected: false
}

export const overrideStyle = {
    display : 'flex', 
    margin : '0 auto',
    height: '24px',
    justifyContent : 'center',
    alignItems : 'center'
}

