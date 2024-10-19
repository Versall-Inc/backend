package jwt

import (
    "fmt"

    "github.com/dgrijalva/jwt-go"
)

func DecodeJWT(tokenString string, secretKey []byte) (string, error) {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return secretKey, nil
    })
    if err != nil {
        return "", err
    }
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        userID := claims["user_id"].(string)
        return userID, nil
    }
    return "", fmt.Errorf("invalid token")
}