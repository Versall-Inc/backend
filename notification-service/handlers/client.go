package handlers

import "github.com/gorilla/websocket"

// ReadMessages handles incoming WebSocket messages from the client.
func (client *Client) ReadMessages() {
    defer func() {
        client.Manager.Unregister <- client
        client.Conn.Close()
    }()

    for {
        _, message, err := client.Conn.ReadMessage()
        if err != nil {
            return
        }
        client.Manager.Broadcast <- message
    }
}

// WriteMessages sends messages to the WebSocket client.
func (client *Client) WriteMessages() {
    defer client.Conn.Close()

    for {
        select {
        case message, ok := <-client.Send:
            if !ok {
                client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }
            client.Conn.WriteMessage(websocket.TextMessage, message)
        }
    }
}
