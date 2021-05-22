export enum SocketDisconnectReasonEnum {
  TRANSPORT_ERROR = 'transport error',
  SERVER_NAMESPACE_DISCONNECT = 'server namespace disconnect',
  CLIENT_NAMESPACE_DISCONNECT = 'client namespace disconnect',
  PING_TIMEOUT = 'ping timeout',
  TRANSPORT_CLOSE = 'transport close',
}
