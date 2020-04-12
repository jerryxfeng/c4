export enum MESSAGE_TYPE {
  NEW_PLAYER_CONNECTION_REQUEST = 'NEW_PLAYER_CONNECTION_REQUEST',
  NEW_PLAYER_CONNECTION_OK = 'NEW_PLAYER_CONNECTION_OK',

  NEW_MATCH_REQUEST = 'NEW_MATCH_REQUEST',
  NEW_MATCH_OK = 'NEW_MATCH_OK',

  GAME_READY = 'GAME_READY',
  GAME_ENDED = 'GAME_ENDED',
  GAME_RESET = 'GAME_RESET',

  CONNECT_MATCH_REQUEST = 'CONNECT_MATCH_REQUEST',
  CONNECT_MATCH_OK = 'CONNECT_MATCH_OK',
  CONNECT_MATCH_FAIL = 'CONNECT_MATCH_FAIL',

  HUNG_UP = 'HUNG_UP',
  OTHER_PLAYER_HUNGUP = 'OTHER_PLAYER_HUNGUP',

  MOVE_MAIN = 'MOVE_MAIN',
  MOVE_SHADOW = 'MOVE_SHADOW',
}

export function constructMessage(type: MESSAGE_TYPE, payload?: any): string {
  console.log('[ws] send: ', type, payload)
  return JSON.stringify({
    type,
    payload,
  })
}
export function parseMessage(
  message: string
): { type: MESSAGE_TYPE; payload: any } {
  const parsedMessage = JSON.parse(message)
  console.log('[ws] receive: ', parsedMessage)
  return parsedMessage
}