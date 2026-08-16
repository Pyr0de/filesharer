package main

import (
	"context"
	"filesharer-aws/cmd/middleware"
	"filesharer-aws/cmd/utils"
	"regexp"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func Handler(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := request.PathParameters["id"]
	sixDigits := regexp.MustCompile(`^\d{6}$`)

	if !sixDigits.Match([]byte(id)) {
		return utils.CreateResponse(400, "Invalid fileshare id"), nil
	}

	s3client, err := utils.ConnectS3(context)
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	url, err := s3client.PresignClient.PresignGetObject(context, &s3.GetObjectInput{
		Bucket: s3client.Id,
		Key:    aws.String(id),
	})

	return utils.CreateResponse(200, url.URL), nil
}

func main() {
	lambda.Start(middleware.CorsMiddleware(Handler))
}
