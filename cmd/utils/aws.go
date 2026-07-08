package utils

import (
	"context"
	"errors"
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/kms"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type FileMetadata struct {
	Code int    `dynamodbav:"code" json:"-"`
	Key  []byte `dynamodbav:"key" json:"-"`
	File string `dynamodbav:"file" json:"file"`
	Size uint   `dynamodbav:"size" json:"size"`
}

type S3Client struct {
	Client *s3.Client
	PresignClient *s3.PresignClient
	Id *string
}

type DynamoDBClient struct {
	Client *dynamodb.Client
	Id *string
}

type KMSClient struct {
	Client *kms.Client
	Id *string
}

func getEnv(env_name string) (*string, error) {
	name := os.Getenv(env_name)
	if name == "" {
		return nil, errors.New(fmt.Sprintf("Environment variable '%s' not defined", env_name))
	}
	return aws.String(name), nil
}

func ConnectS3(context context.Context) (*S3Client, error){
	env_name := "FILESTORES3_BUCKET_NAME"
	name, err := getEnv(env_name)
	if err != nil {
		return nil, err
	}

	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg)

	return &S3Client{
		Client: client,
		PresignClient: s3.NewPresignClient(client),
		Id: name,
	}, nil
}
func ConnectTempS3(context context.Context) (*S3Client, error){
	env_name := "TEMPFILESTORES3_BUCKET_NAME"
	name, err := getEnv(env_name)
	if err != nil {
		return nil, err
	}

	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg)

	return &S3Client{
		Client: client,
		PresignClient: s3.NewPresignClient(client),
		Id: name,
	}, nil
}

func ConnectMetadataStore(context context.Context) (*DynamoDBClient ,error) {
	env_name := "METADATA_STORE_NAME"
	name, err := getEnv(env_name)
	if err != nil {
		return nil, err
	}
	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	return &DynamoDBClient{
		Client: dynamodb.NewFromConfig(cfg),
		Id: name,
	}, nil
}

func ConnectDataEncryptionKMS(context context.Context) (*KMSClient, error) {
	env_name := "DATA_ENCRYPTION_NAME"
	name, err := getEnv(env_name)
	if err != nil {
		return nil, err
	}
	cfg, err := config.LoadDefaultConfig(context)
	if err != nil {
		return nil, err
	}

	return &KMSClient{
		Client: kms.NewFromConfig(cfg),
		Id: name,
	}, nil
}
