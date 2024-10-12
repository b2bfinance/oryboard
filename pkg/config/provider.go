package config

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth"
	restclient "k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

type providerSpecS3 struct {
	Bucket   string `yaml:"bucket"`
	Region   string `yaml:"region"`
	Endpoint string `yaml:"endpoint"`
	Key      string `yaml:"key"`
	Secret   string `yaml:"secret"`
	Object   string `yaml:"object"`
}

type providerSpecKubernetes struct {
	Namespace      string `yaml:"namespace"`
	ConfigName     string `yaml:"config_name"`
	DataKey        string `yaml:"data_key"`
	KubeconfigPath string `yaml:"kubeconfig_path"`
}

// ProviderSpec defines a way to read/write to a configuration blob for one of
// the Ory instances.
type ProviderSpec struct {
	File       string                 `yaml:"file"`
	S3         providerSpecS3         `yaml:"s3"`
	Kubernetes providerSpecKubernetes `yaml:"kubernetes"`
}

type ConfigProvider interface {
	Read(context.Context) ([]byte, error)
	Write(context.Context, []byte) error
}

type localFile string

type s3Object struct {
	client *minio.Client
	bucket string
	object string
}

type k8sObject struct {
	client     *kubernetes.Clientset
	namespace  string
	configName string
	dataKey    string
}

func (p *ProviderSpec) ReadWriter(ctx context.Context) (ConfigProvider, error) {
	if p.File != "" {
		return localFile(p.File), nil
	}

	if p.S3.Bucket != "" {
		if p.S3.Endpoint == "" {
			p.S3.Endpoint = "s3.amazonaws.com"
		}
		client, err := minio.New(p.S3.Endpoint, &minio.Options{
			Creds:  credentials.NewStaticV4(p.S3.Key, p.S3.Secret, ""),
			Secure: true,
		})
		if err != nil {
			return nil, fmt.Errorf("unable to initialise s3 client %w", err)
		}

		if ok, err := client.BucketExists(ctx, ""); err != nil {
			return nil, fmt.Errorf("unable to determine if bucket exists %w", err)
		} else if !ok {
			return nil, fmt.Errorf("configured bucket '%s' does not exist", p.S3.Bucket)
		}

		return &s3Object{
			client: client,
			bucket: p.S3.Bucket,
			object: p.S3.Object,
		}, nil
	}

	if p.Kubernetes.Namespace != "" {
		var cnf *restclient.Config

		if p.Kubernetes.KubeconfigPath != "" {
			v, err := clientcmd.BuildConfigFromFlags("", p.Kubernetes.KubeconfigPath)
			if err != nil {
				return nil, fmt.Errorf("unable to resolve kubeconfig %w", err)
			}
			cnf = v
		} else {
			v, err := restclient.InClusterConfig()
			if err != nil {
				return nil, fmt.Errorf("unable to resolve cluster config %w", err)
			}
			cnf = v
		}

		client, err := kubernetes.NewForConfig(cnf)
		if err != nil {
			return nil, fmt.Errorf("unable to initialise Kubernetes client %w", err)
		}

		return &k8sObject{
			client:     client,
			namespace:  p.Kubernetes.Namespace,
			configName: p.Kubernetes.ConfigName,
			dataKey:    p.Kubernetes.DataKey,
		}, nil
	}

	return nil, fmt.Errorf("unknown provider spec")
}

func (o localFile) Read(ctx context.Context) ([]byte, error) {
	return os.ReadFile(string(o))
}

func (o localFile) Write(ctx context.Context, p []byte) error {
	return os.WriteFile(string(o), p, 0666)
}

func (o *s3Object) Read(ctx context.Context) ([]byte, error) {
	obj, err := o.client.GetObject(ctx, o.bucket, o.object, minio.GetObjectOptions{})
	if err != nil {
		return nil, err
	}
	defer obj.Close()

	return io.ReadAll(obj)
}

func (o *s3Object) Write(ctx context.Context, p []byte) error {
	b := bytes.NewBuffer(p)

	_, err := o.client.PutObject(ctx, o.bucket, o.object, b, int64(len(p)), minio.PutObjectOptions{
		DisableMultipart: true,
		ContentType:      "text/yaml",
	})

	return err
}

func (o *k8sObject) Read(ctx context.Context) ([]byte, error) {
	println(o.namespace, "/", o.configName)
	v, err := o.client.CoreV1().ConfigMaps(o.namespace).Get(ctx, o.configName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	rb, ok := v.Data[o.dataKey]
	if !ok {
		return nil, fmt.Errorf("unable to find key '%s' in configmap '%s/%s'", o.dataKey, o.namespace, o.configName)
	}

	return []byte(rb), nil
}

func (o *k8sObject) Write(ctx context.Context, p []byte) error {
	s := o.client.CoreV1().ConfigMaps(o.namespace)

	if v, err := s.Get(ctx, o.configName, metav1.GetOptions{}); err == nil {
		v.Data[o.dataKey] = string(p)
		_, err = s.Update(ctx, v, metav1.UpdateOptions{})
		return err
	}

	_, err := s.Create(ctx, &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name: o.configName,
		},
		Data: map[string]string{
			o.dataKey: string(p),
		},
	}, metav1.CreateOptions{})
	return err
}
