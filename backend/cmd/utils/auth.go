package utils

import (
	"errors"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	UserId       string `dynamodbav:"userId"`
	Username     string `dynamodbav:"username"`
	PasswordHash string `dynamodbav:"passwordHash"`
	CreatedAt    string `dynamodbav:"createdAt"`
}

type JWTData struct {
	UserId   string
	Username string
    jwt.RegisteredClaims
}

type JWTResponse struct {
	UserId   string `json:"userId"`
	Username string `json:"username"`
	Token    string `json:"token"`
}


var jwtSecret = []byte("test-secret")

func GenerateJWT(user User) (JWTResponse, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTData{
		UserId: user.UserId,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		log.Printf("Error: Creating Signed JWT String: %s\n", err)
		return JWTResponse{}, errors.New("Internal Error: JWT")
	}

	return JWTResponse{
		UserId: user.UserId,
		Username: user.Username,
		Token: tokenString,
	}, nil
}
