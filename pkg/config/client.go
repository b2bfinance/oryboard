package config

import (
	"crypto/tls"
	"crypto/x509"
	"net/http"
	"strings"

	hydra "github.com/ory/hydra-client-go/v2"
	keto "github.com/ory/keto-client-go"
	kratos "github.com/ory/kratos-client-go"
)

type remoteAPI struct {
	Address string            `yaml:"address"`
	CA      []byte            `yaml:"ca"`
	Headers map[string]string `yaml:"headers"`
}

func newHttpClientWithCA(ca []byte) *http.Client {
	transport := http.DefaultTransport.(*http.Transport).Clone()

	if len(ca) > 0 {
		caCertPool := x509.NewCertPool()
		_ = caCertPool.AppendCertsFromPEM(ca)

		transport.TLSClientConfig = &tls.Config{
			RootCAs: caCertPool,
		}
	}

	return &http.Client{
		Transport: transport,
	}
}

func (c remoteAPI) KratosClient() (*kratos.APIClient, error) {
	return kratos.NewAPIClient(&kratos.Configuration{
		Servers: kratos.ServerConfigurations{
			{
				URL: strings.TrimSuffix(c.Address, "/"),
			},
		},
		UserAgent:     "oryboard-v1",
		DefaultHeader: c.Headers,
		Debug:         true,
		HTTPClient:    newHttpClientWithCA(c.CA),
	}), nil
}

func (c remoteAPI) HydraClient() (*hydra.APIClient, error) {
	return hydra.NewAPIClient(&hydra.Configuration{
		Servers: hydra.ServerConfigurations{
			{
				URL: strings.TrimSuffix(c.Address, "/"),
			},
		},
		UserAgent:     "oryboard-v1",
		DefaultHeader: c.Headers,
		HTTPClient:    newHttpClientWithCA(c.CA),
	}), nil
}

func (c remoteAPI) KetoClient() (*keto.APIClient, error) {
	return keto.NewAPIClient(&keto.Configuration{
		Servers: keto.ServerConfigurations{
			{
				URL: strings.TrimSuffix(c.Address, "/"),
			},
		},
		UserAgent:     "oryboard-v1",
		DefaultHeader: c.Headers,
		HTTPClient:    newHttpClientWithCA(c.CA),
	}), nil
}
