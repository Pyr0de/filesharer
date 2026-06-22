package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"filesharer-aws/cmd/utils"
	"fmt"
	"io"
	"math/rand/v2"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/kms"
	"github.com/aws/aws-sdk-go-v2/service/kms/types"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func Handler(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	request.Headers = utils.NormalizeHeaders(request.Headers)

	s3Client, err := utils.ConnectS3(context)
	
	if err != nil {
		return utils.CreateResponse(500, err), nil
	}

	metadataDb, err := utils.ConnectMetadataStore(context)
	if err != nil {
		return utils.CreateResponse(500, err), nil
	}



	kmsClient, err := utils.ConnectDataEncryptionKMS(context)
	if err != nil {
		return utils.CreateResponse(500, err), nil
	}

	form, err := utils.CreateMultipart(request)

	if err != nil {
		return utils.CreateResponse(400, err), nil
	}

	code := rand.IntN(1000000)

	for {
		part, err := form.NextPart()
		if err == io.EOF {
			break
		}

		if err != nil {
			return utils.CreateResponse(400, err), nil
		}

		fileName := part.FileName()

		if fileName == "" {
			continue
		}

		data, err := io.ReadAll(part)
		if err != nil {
			return utils.CreateResponse(400, "Could not read data"), nil
		}

		kmsOutput, err := kmsClient.Client.GenerateDataKey(context, &kms.GenerateDataKeyInput {
			KeyId: kmsClient.Id,
			KeySpec: types.DataKeySpecAes256,
		})
		if err != nil {
			return utils.CreateResponse(500, err), nil
		}

		encryptedData, err := utils.Encrypt(kmsOutput.Plaintext, data)
		if err != nil {
			return utils.CreateResponse(500, err), nil
		}

		encryptedFileName, err := utils.Encrypt(kmsOutput.Plaintext, []byte(fileName))
		if err != nil {
			return utils.CreateResponse(500, err), nil
		}
		safeFileName := base64.RawURLEncoding.EncodeToString(encryptedFileName)

		_, err = s3Client.Client.PutObject(context, &s3.PutObjectInput{
			Bucket: s3Client.Id,
			Key: aws.String(string(safeFileName)),
			Body: bytes.NewReader(encryptedData),
			ContentLength: aws.Int64(int64(len(encryptedData))),
		})

		if err != nil {
			return utils.CreateResponse(500, fmt.Sprint(err, string(encryptedFileName))), nil
		}

		metadata := utils.FileMetadata {
			Code: code,
			Key: kmsOutput.CiphertextBlob,
			File: safeFileName,
			Size: uint(len(data)),
		}

		item, err := attributevalue.MarshalMap(metadata)
		if err != nil {
			return utils.CreateResponse(500, err), nil
		}
		
		_, err = metadataDb.Client.PutItem(context, &dynamodb.PutItemInput{
			TableName: metadataDb.Id,
			Item: item,
		})
		if err != nil {
			return utils.CreateResponse(500, err), nil
		}
		
	}

	return utils.CreateResponse(201, fmt.Sprint(code)), nil
}

func main() {
	lambda.Start(Handler)
}

