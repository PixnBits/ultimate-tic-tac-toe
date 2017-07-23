export default function io() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    open: jest.fn(),
    connect: jest.fn(),
    send: jest.fn(),
    emit: jest.fn((eventName) => {}),
    on: jest.fn((eventName, callback) => {}),
    compress: jest.fn(value => value),
    close: jest.fn(),
    disconnect: jest.fn(),
  };
}
