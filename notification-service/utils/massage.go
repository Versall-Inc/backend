package utils

import "fmt"

type MessageType string

const (
    Info    MessageType = "INFO"
    Warning MessageType = "WARNING"
    Error   MessageType = "ERROR"
)

func FormatMessage(messageType MessageType, message string) string {
    return fmt.Sprintf("%s: %s", messageType, message)
}