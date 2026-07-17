package middleware

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
)
type ApiGatewayProxyHandler func (
		context.Context,
		events.APIGatewayProxyRequest,
	) (events.APIGatewayProxyResponse, error)

func CorsMiddleware(next ApiGatewayProxyHandler) ApiGatewayProxyHandler {
	return func(ctx context.Context, e events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		resp, err := next(ctx, e)
		if err != nil {
			return resp, err
		}

		resp.Headers["Access-Control-Allow-Origin"] = "*"
		resp.Headers["Access-Control-Allow-Headers"] = "*"

		return resp, nil
	}
}
