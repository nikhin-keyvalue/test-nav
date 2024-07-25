/* eslint-disable no-console */
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { AWSXRayIdGenerator } from '@opentelemetry/id-generator-aws-xray';
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk';
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { AWSXRayPropagator } from '@opentelemetry/propagator-aws-xray';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  textMapPropagator: new AWSXRayPropagator(),
  idGenerator: new AWSXRayIdGenerator(),
  instrumentations: [
    new UndiciInstrumentation({
      ignoreRequestHook: (request) => request.path.includes('health'),
    }),
    new AwsInstrumentation({ suppressInternalInstrumentation: true }),
  ],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'crm-web',
  }),
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  traceExporter,
});
sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing and Metrics terminated'))
    .catch((error) =>
      console.log('Error terminating tracing and metrics', error)
    )
    .finally(() => process.exit(0));
});