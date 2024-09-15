package main

import (
    "log"
    "net/http"
    "notification-service/handlers"
)

func main() {
    manager := handlers.NewManager()
    go manager.Run()

    http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        handlers.WebSocketHandler(w, r, manager)
    })

    log.Println("Server started on :8080")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
