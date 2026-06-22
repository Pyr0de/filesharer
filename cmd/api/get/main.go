package main

import (
	"context"
	"filesharer-aws/cmd/utils"
	"regexp"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

func Handler(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := request.PathParameters["id"]
	sixDigits := regexp.MustCompile(`^\d{6}$`)

	if !sixDigits.Match([]byte(id)) {
		return utils.CreateResponse(400, "Invalid fileshare id"), nil
	}

	metadataStore, err := utils.ConnectMetadataStore(context)
	if err != nil {
		return utils.CreateResponse(500, err), nil
	}

	result, err := metadataStore.Client.Query(context, &dynamodb.QueryInput{
		TableName: metadataStore.Id,
		KeyConditionExpression: aws.String("#c = :code"),
		ExpressionAttributeNames: map[string]string{
			"#c": "code",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":code": &types.AttributeValueMemberN{
				Value: id,
			},
		},
	})
	if err != nil {
		return utils.CreateResponse(500, err), nil
	}

	var items []utils.FileMetadata;

	err = attributevalue.UnmarshalListOfMaps(result.Items, &items)
	if err != nil {
		return utils.CreateResponse(500, err), nil
	}

	files := []string {}
	for _, item := range items {
		files = append(files, item.File)
	}

	return utils.CreateResponse(200, strings.Join(files, "\n")), nil
}

func main() {
	lambda.Start(Handler)
}
