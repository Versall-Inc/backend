package websocket

import (
    "log"
    "net/http"
    "strings"

    "github.com/gorilla/websocket"
    "notification-service/jwt"
    "notification-service/manager"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func Handler(mgr *manager.Manager, secretKey []byte) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Println(err)
            return
        }
        defer conn.Close()

        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            log.Println("Authorization header missing")
            return
        }

        tokenString := strings.Replace(authHeader, "Token ", "", 1)
        userID, err := jwt.DecodeJWT(tokenString, secretKey)
        if err != nil {
            log.Println(err)
            return
        }

        mgr.AddClient(conn, userID)

        // Send a test message to the client
        mgr.SendMessage(conn, "INFO", "Welcome! This is a test message from the manager.")

        for {
            _, msg, err := conn.ReadMessage()
            if err != nil {
                log.Println(err)
                mgr.RemoveClient(conn)
                break
            }
            log.Printf("Received: %s", msg)
        }
    }
}