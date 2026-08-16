package utils

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"mime"
	"mime/multipart"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func CreateResponse(status int, error_message any) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		Headers: map[string]string{
			"Content-Type": "text/plain",
		},
		Body:       fmt.Sprint(error_message),
		StatusCode: status,
	}
}

func CreateMultipart(request events.APIGatewayProxyRequest) (*multipart.Reader, error) {
	body := request.Body

	if request.IsBase64Encoded {
		decodedBody, err := base64.StdEncoding.DecodeString(request.Body)
		if err != nil {
			return nil, fmt.Errorf("decode base64 body: %w", err)
		}
		body = string(decodedBody)
	}

	contentType, ok := request.Headers["content-type"]
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

	reader := multipart.NewReader(bytes.NewReader([]byte(body)), params["boundary"])

	return reader, nil
}

func NormalizeHeaders(headers map[string]string) map[string]string {
	normalized := make(map[string]string, len(headers))

	for k, v := range headers {
		normalized[strings.ToLower(k)] = v
	}

	return normalized
}
