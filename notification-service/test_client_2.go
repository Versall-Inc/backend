package main

import (
    "log"
    "net/http"

    "github.com/gorilla/websocket"
    "github.com/dgrijalva/jwt-go"
)

func main() {
    // Generate a JWT token for testing
    secretKey := []byte("supersecretkey12345")
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": "67891",
    })
    tokenString, err := token.SignedString(secretKey)
    if err != nil {
        log.Fatalf("Failed to generate token: %v", err)
    }

    // Connect to the WebSocket server
    url := "ws://localhost:8080/ws"
    headers := http.Header{
        "Authorization": []string{"Token " + tokenString},
    }
    conn, _, err := websocket.DefaultDialer.Dial(url, headers)
    if err != nil {
        log.Fatalf("Failed to connect to WebSocket server: %v", err)
    }
    defer conn.Close()

    // Read response
    for {
        _, message, err := conn.ReadMessage()
        if err != nil {
            log.Fatalf("Failed to read message: %v", err)
        }
        log.Printf("Received: %s", message)
    }
}