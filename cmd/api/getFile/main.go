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
	file := request.PathParameters["file"]

	sixDigits := regexp.MustCompile(`^\d{6}$`)
	if !sixDigits.Match([]byte(id)) {
		return utils.CreateResponse(400, "Invalid fileshare id"), nil
	}
	
	if file == "" {
		return utils.CreateResponse(400, "Invalid file name"), nil
	}

	return utils.CreateResponse(200, "Success"), nil
	
}

func main() {
	lambda.Start(Handler)
}
