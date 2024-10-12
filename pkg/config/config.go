package config

import (
	"context"
	"fmt"
	"os"

	"gopkg.in/yaml.v2"
)

type kratosConfig struct {
	Public         remoteAPI    `yaml:"public"`
	Admin          remoteAPI    `yaml:"admin"`
	ConfigProvider ProviderSpec `yaml:"config_provider"`
}

type hydraConfig struct {
	Public         remoteAPI    `yaml:"public"`
	Admin          remoteAPI    `yaml:"admin"`
	ConfigProvider ProviderSpec `yaml:"config_provider"`
}

type ketoConfig struct {
	Public         remoteAPI    `yaml:"public"`
	Admin          remoteAPI    `yaml:"admin"`
	ConfigProvider ProviderSpec `yaml:"config_provider"`
}

type Config struct {
	Host string `yaml:"host"`
	Port int    `yaml:"port"`

	Kratos kratosConfig `yaml:"kratos"`
	Hydra  hydraConfig  `yaml:"hydra"`
	Keto   ketoConfig   `yaml:"keto"`
}

func FromFile(ctx context.Context, path string) (cnf Config, err error) {
	rb, err := os.ReadFile(path)
	if err != nil {
		err = fmt.Errorf("unable to read config %w", err)
		return
	}

	err = yaml.Unmarshal(rb, &cnf)
	if err != nil {
		err = fmt.Errorf("unable to parse config %w", err)
		return
	}

	return
}
