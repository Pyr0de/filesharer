package main

import (
	"context"
	"encoding/json"
	"filesharer-aws/cmd/middleware"
	"filesharer-aws/cmd/utils"
	"fmt"
	"log"
	"math/rand/v2"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type CreateResponse struct {
	Code int    `json:"code"`
	Url  string `json:"url"`
}

type CreateRequest struct {
	Size int `json:"size"`
}

func Handler(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	request.Headers = utils.NormalizeHeaders(request.Headers)

	s3Client, err := utils.ConnectS3(context)

	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}

	var req CreateRequest;
	if err = json.Unmarshal([]byte(request.Body), &req); err != nil {
		return utils.CreateResponseJSON(400, "Malformed JSON", "JSON_ERR"), nil
	}

	if req.Size == 0 {
		return utils.CreateResponseJSON(400, "No size specified", "NO_SIZE"), nil
	}

	if req.Size > 10 * 1048576 {
		return utils.CreateResponseJSON(400, "File size larger than limit", "FILE_SIZE_TOO_LARGE"), nil
	}

	code := rand.IntN(900000) + 100000
	url, err := s3Client.PresignClient.PresignPutObject(context, &s3.PutObjectInput{
		Bucket: s3Client.Id,
		Key:    aws.String(fmt.Sprintf("%d", code)),
		ContentLength: aws.Int64(int64(req.Size)),
	})
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	outJson, err := json.Marshal(CreateResponse{
		Code: code,
		Url:  url.URL,
	})
	if err != nil {
		return events.APIGatewayProxyResponse{}, err
	}
	respone := events.APIGatewayProxyResponse{
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
		Body:       string(outJson),
		StatusCode: 200,
	}
	return respone, nil
}

func main() {
	log.SetFlags(log.LstdFlags | log.Lmicroseconds)
	lambda.Start(middleware.CorsMiddleware(Handler))
}
