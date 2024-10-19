package manager

import (
    "log"
    "os"
    "sync"

    "github.com/gorilla/websocket"
    "notification-service/client"
    "notification-service/utils"
)

type Manager struct {
    clients       map[*websocket.Conn]*client.Client
    mu            sync.Mutex
    connectionLog *log.Logger
    messageLog    *log.Logger
    errorLog      *log.Logger
}

func NewManager() *Manager {
    // Ensure the logs directory exists
    if err := os.MkdirAll("logs", os.ModePerm); err != nil {
        log.Fatalf("Failed to create logs directory: %v", err)
    }

    // Create a log file for connections
    connectionLogFile, err := os.OpenFile("logs/connections.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
    if err != nil {
        log.Fatalf("Failed to open connection log file: %v", err)
    }
    connectionLogger := log.New(connectionLogFile, "", log.LstdFlags)

    // Create a log file for messages
    messageLogFile, err := os.OpenFile("logs/messages.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
    if err != nil {
        log.Fatalf("Failed to open message log file: %v", err)
    }
    messageLogger := log.New(messageLogFile, "", log.LstdFlags)

    // Create a log file for errors
    errorLogFile, err := os.OpenFile("logs/errors.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
    if err != nil {
        log.Fatalf("Failed to open error log file: %v", err)
    }
    errorLogger := log.New(errorLogFile, "", log.LstdFlags)

    return &Manager{
        clients:       make(map[*websocket.Conn]*client.Client),
        connectionLog: connectionLogger,
        messageLog:    messageLogger,
        errorLog:      errorLogger,
    }
}

func (m *Manager) AddClient(conn *websocket.Conn, userID string) {
    m.mu.Lock()
    defer m.mu.Unlock()
    m.clients[conn] = &client.Client{Conn: conn, UserID: userID}
    m.connectionLog.Printf("User connected: %s", userID)
}

func (m *Manager) RemoveClient(conn *websocket.Conn) {
    m.mu.Lock()
    defer m.mu.Unlock()
    if client, ok := m.clients[conn]; ok {
        m.connectionLog.Printf("User disconnected: %s", client.UserID)
        delete(m.clients, conn)
    }
}

func (m *Manager) SendMessage(conn *websocket.Conn, messageType utils.MessageType, message string) {
    msg := utils.FormatMessage(messageType, message)
    err := conn.WriteMessage(websocket.TextMessage, []byte(msg))
    if err != nil {
        log.Println(err)
        conn.Close()
        m.RemoveClient(conn)
    } else {
        client := m.clients[conn]
        m.messageLog.Printf("Sent to %s: %s", client.UserID, msg)
    }
}

func (m *Manager) SendMessageToUser(userID string, messageType utils.MessageType, message string) {
    m.mu.Lock()
    defer m.mu.Unlock()
    for conn, client := range m.clients {
        if client.UserID == userID {
            m.SendMessage(conn, messageType, message)
            return
        }
    }
    m.errorLog.Printf("User with ID %s not found", userID)
}

func (m *Manager) SendMessageToAll(messageType utils.MessageType, message string) {
    m.mu.Lock()
    defer m.mu.Unlock()
    for conn := range m.clients {
        m.SendMessage(conn, messageType, message)
    }
}

func (m *Manager) SendMessageToGroup(userIDs []string, messageType utils.MessageType, message string) {
    m.mu.Lock()
    defer m.mu.Unlock()
    for _, userID := range userIDs {
        found := false
        for conn, client := range m.clients {
            if client.UserID == userID {
                m.SendMessage(conn, messageType, message)
                found = true
                break
            }
        }
        if !found {
            m.errorLog.Printf("User with ID %s not found", userID)
        }
    }
}