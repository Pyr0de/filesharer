package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"math/rand/v2"
	"mime"
	"mime/multipart"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type FileMetadata struct {
	Code int    `dynamodbav:"code"`
	Key  string `dynamodbav:"key"`
	File string `dynamodbav:"file"`
}

func createResponse(status int, error_message any) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		Headers: map[string]string {
			"Content-Type": "text/plain",
		},
		Body: fmt.Sprint(error_message),
		StatusCode: status,
	}
}

func createMultipart(request events.APIGatewayProxyRequest) (*multipart.Reader, error) {
	contentType, ok := request.Headers["content-type"];
	if !ok {
		return nil, errors.New("Content-Type not defined")
	}

	mediaType, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		return nil, errors.New("Could not parse Content-Type")
	}

	if mediaType != "multipart/form-data" {
		return nil, errors.New("Expected Content-Type: mulitpart/form-data")
	}

	reader := multipart.NewReader(bytes.NewReader([]byte(request.Body)), params["boundary"])

	return reader, nil
}

func connectS3(context context.Context) (*s3.Client, error){
	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg)
	return client, nil
}

func connectMetadataStore(context context.Context) (*dynamodb.Client ,error) {
	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}
	
	return dynamodb.NewFromConfig(cfg), nil
}

func normalizeHeaders(headers map[string]string) map[string]string {
	normalized := make(map[string]string, len(headers))

	for k, v := range headers {
		normalized[strings.ToLower(k)] = v
	}

	return normalized
}

func Handler(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	request.Headers = normalizeHeaders(request.Headers)

	client, err := connectS3(context)
	
	if err != nil {
		return createResponse(500, err), nil
	}

	metadatadb, err := connectMetadataStore(context)
	if err != nil {
		return createResponse(500, err), nil
	}

	form, err := createMultipart(request)

	if err != nil {
		return createResponse(400, err), nil
	}

	code := rand.IntN(1000000)

	for {
		part, err := form.NextPart()
		if err == io.EOF {
			break
		}

		if err != nil {
			return createResponse(400, err), nil
		}

		fileName := part.FileName()

		if fileName == "" {
			continue
		}

		data, err := io.ReadAll(part)
		if err != nil {
			return createResponse(400, "Could not read data"), nil
		}

		_, err = client.PutObject(context, &s3.PutObjectInput{
			Bucket: aws.String(os.Getenv("FILESTORES3_BUCKET_NAME")),
			Key: aws.String(fmt.Sprintf("%s", fileName)),
			Body: bytes.NewReader(data),
			ContentLength: aws.Int64(int64(len(data))),
		})

		if err != nil {
			return createResponse(500, err), nil
		}

		metadata := FileMetadata {
			Code: code,
			Key: "",
			File: fileName,
		}

		item, err := attributevalue.MarshalMap(metadata)
		if err != nil {
			return createResponse(500, err), nil
		}
		
		_, err = metadatadb.PutItem(context, &dynamodb.PutItemInput{
			TableName: aws.String(os.Getenv("METADATA_STORE_NAME")),
			Item: item,
		})
		if err != nil {
			return createResponse(500, err), nil
		}
		
	}
	return createResponse(201, fmt.Sprint(code)), nil
}

func main() {
	lambda.Start(Handler)
}

