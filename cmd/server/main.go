package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"os"

	"github.com/b2bfinance/oryboard/pkg/config"
)

func main() {
	ctx := context.Background()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	cnfPath := flag.String("config", "config.yaml", "Path to configuration file.")
	flag.Parse()

	cnf, err := config.FromFile(ctx, *cnfPath)
	if err != nil {
		logger.Error("configuration error", "error", err)
		os.Exit(1)
	}

	k, err := cnf.Kratos.Admin.KratosClient()
	if err != nil {
		logger.Error("initiating kratos client failed", "error", err)
		os.Exit(1)
	}

	r, _, err := k.IdentityAPI.ListIdentities(ctx).Execute()
	if err != nil {
		logger.Error("listing identites failed", "error", err)
		os.Exit(1)
	}

	fmt.Printf("%+v\n", r)
}
