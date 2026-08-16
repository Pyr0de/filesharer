package main

import (
	"context"
	"encoding/json"
	"filesharer-aws/cmd/middleware"
	"filesharer-aws/cmd/utils"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/google/uuid"
)

func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var creds utils.Credentials
	if err := json.Unmarshal([]byte(request.Body), &creds); err != nil {
		return utils.CreateResponseJSON(400, "Malformed JSON", "JSON_ERR"), err
	}

	dynamoClient, err := utils.ConnectUserStore(ctx)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	username := types.AttributeValueMemberS{
		Value: creds.Username,
	}

	response, err := dynamoClient.Client.Query(ctx, &dynamodb.QueryInput{
		TableName:              dynamoClient.Id,
		IndexName:              aws.String("UsernameIndex"),
		KeyConditionExpression: aws.String("username = :username"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":username": &username,
		},
		Limit: aws.Int32(1),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	if len(response.Items) != 0 {
		return utils.CreateResponseJSON(409, "Username already taken", "UNAME_TAKEN"), nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	user := utils.User{
		UserId:       uuid.New().String(),
		Username:     creds.Username,
		PasswordHash: string(hash),
		CreatedAt:    time.Now().String(),
	}

	dynamoItem, err := attributevalue.MarshalMap(user)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	_, err = dynamoClient.Client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: dynamoClient.Id,
		Item:      dynamoItem,
	})

	jwt, err := utils.GenerateJWT(user)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	jsonResponse, err := json.Marshal(jwt)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	return events.APIGatewayProxyResponse{
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body:       string(jsonResponse),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(middleware.CorsMiddleware(Handler))
}
