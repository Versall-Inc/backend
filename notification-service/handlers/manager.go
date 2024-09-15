package handlers

import "github.com/gorilla/websocket"

// Client represents a WebSocket connection and its associated data.
type Client struct {
    Conn    *websocket.Conn
    Send    chan []byte
    Manager *Manager
}

// Manager maintains the set of active clients and broadcasts messages to them.
type Manager struct {
    Register   chan *Client
    Unregister chan *Client
    Clients    map[*Client]bool
    Broadcast  chan []byte
}

// NewManager creates and returns a new Manager instance.
func NewManager() *Manager {
    return &Manager{
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Clients:    make(map[*Client]bool),
        Broadcast:  make(chan []byte),
    }
}

// Run starts the manager loop, which listens for registration, unregistration, and message broadcasting.
func (manager *Manager) Run() {
    for {
        select {
        case client := <-manager.Register:
            manager.Clients[client] = true
        case client := <-manager.Unregister:
            if _, ok := manager.Clients[client]; ok {
                delete(manager.Clients, client)
                close(client.Send)
            }
        case message := <-manager.Broadcast:
            for client := range manager.Clients {
                select {
                case client.Send <- message:
                default:
                    close(client.Send)
                    delete(manager.Clients, client)
                }
            }
        }
    }
}
