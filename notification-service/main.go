package main

import (
    "encoding/json"
    "io/ioutil"
    "log"
    "net/http"
    "os"

    "github.com/gorilla/mux"
    "github.com/rs/cors"

    "notification-service/manager"
    "notification-service/utils"
    "notification-service/websocket"
)

const (
    logDir        = "logs"
    secretKeyFile = "secret.key"
)

type MessageRequest struct {
    UserID      string   `json:"user_id,omitempty"`
    UserIDs     []string `json:"user_ids,omitempty"`
    MessageType string   `json:"message_type"`
    Message     string   `json:"message"`
}

func main() {
    // Ensure the logs directory exists
    if err := os.MkdirAll(logDir, os.ModePerm); err != nil {
        log.Fatalf("Failed to create logs directory: %v", err)
    }

    // Create a log file for server events
    serverLogFile, err := os.OpenFile(logDir+"/server.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
    if err != nil {
        log.Fatalf("Failed to open server log file: %v", err)
    }
    serverLogger := log.New(serverLogFile, "", log.LstdFlags)

    // Load configuration
    secretKey := loadSecretKey()

    // Initialize manager
    mgr := manager.NewManager()

    // Setup router
    router := setupRouter(mgr, secretKey)

    // Setup CORS
    handler := cors.Default().Handler(router)

    // Start server
    serverLogger.Println("Server started on :8080")
    defer serverLogger.Println("Server stopped")
    if err := http.ListenAndServe(":8080", handler); err != nil {
        serverLogger.Fatalf("Failed to start server: %v", err)
    }
}

func loadSecretKey() []byte {
    secretKey, err := ioutil.ReadFile(secretKeyFile)
    if err != nil {
        log.Fatalf("Failed to read secret key file: %v", err)
    }
    return secretKey
}

func setupRouter(mgr *manager.Manager, secretKey []byte) *mux.Router {
    router := mux.NewRouter()
    router.HandleFunc("/ws", websocket.Handler(mgr, secretKey)).Methods(http.MethodGet)
    router.HandleFunc("/send", handleSend(mgr)).Methods(http.MethodPost)
    return router
}

func handleSend(mgr *manager.Manager) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req MessageRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Invalid request", http.StatusBadRequest)
            return
        }
        if len(req.UserIDs) > 0 {
            mgr.SendMessageToGroup(req.UserIDs, utils.MessageType(req.MessageType), req.Message)
        } else if req.UserID != "" {
            mgr.SendMessageToUser(req.UserID, utils.MessageType(req.MessageType), req.Message)
        } else {
            mgr.SendMessageToAll(utils.MessageType(req.MessageType), req.Message)
        }
        w.WriteHeader(http.StatusOK)
    }
}

func startServer(handler http.Handler) {
    // Ensure the logs directory exists
    if err := os.MkdirAll("logs", os.ModePerm); err != nil {
        log.Fatalf("Failed to create logs directory: %v", err)
    }

    // Create a log file for server events
    serverLogFile, err := os.OpenFile("logs/server.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
    if err != nil {
        log.Fatalf("Failed to open server log file: %v", err)
    }
    serverLogger := log.New(serverLogFile, "", log.LstdFlags)

    serverLogger.Println("Server started on :8080")
    defer serverLogger.Println("Server stopped")

    if err := http.ListenAndServe(":8080", handler); err != nil {
        serverLogger.Fatalf("Failed to start server: %v", err)
    }
}