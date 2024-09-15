package handlers

import (
    "log"
    "net/http"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

// WebSocketHandler upgrades the HTTP connection to a WebSocket connection and registers the client.
func WebSocketHandler(w http.ResponseWriter, r *http.Request, manager *Manager) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Printf("Failed to upgrade to WebSocket: %v", err)
        return
    }

    client := &Client{
        Conn:    conn,
        Send:    make(chan []byte),
        Manager: manager,
    }

    manager.Register <- client

    go client.WriteMessages()
    go client.ReadMessages()
}
