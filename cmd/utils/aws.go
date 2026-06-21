package utils

import (
	"context"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type FileMetadata struct {
	Code int    `dynamodbav:"code"`
	Key  string `dynamodbav:"key"`
	File string `dynamodbav:"file"`
}

type S3Client struct {
	Client *s3.Client
	Id *string
}

type DynamoDBClient struct {
	Client *dynamodb.Client
	Id *string
}

func ConnectS3(context context.Context) (*S3Client, error){
	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	return &S3Client{
		Client: s3.NewFromConfig(cfg),
		Id: aws.String(os.Getenv("FILESTORES3_BUCKET_NAME")),
	}, nil
}

func ConnectMetadataStore(context context.Context) (*DynamoDBClient ,error) {
	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	return &DynamoDBClient{
		Client: dynamodb.NewFromConfig(cfg),
		Id: aws.String(os.Getenv("METADATA_STORE_NAME")),
	}, nil
}

