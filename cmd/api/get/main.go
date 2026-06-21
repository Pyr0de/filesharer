package main

import (
	"context"
	"filesharer-aws/cmd/utils"
	"regexp"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := request.PathParameters["id"]
	sixDigits := regexp.MustCompile(`^\d{6}$`)

	if !sixDigits.Match([]byte(id)) {
		return utils.CreateResponse(400, "Invalid fileshare id"), nil
	}
	
	return utils.CreateResponse(200, id), nil
}

func main() {
	lambda.Start(Handler)
}
