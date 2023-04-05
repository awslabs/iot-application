import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CoreService, CoreServiceProps } from './core-service';

export interface CoreStackProps extends StackProps {
  readonly coreServiceProps: CoreServiceProps;
}

export class CoreStack extends Stack {
  readonly coreService: CoreService;

  constructor(scope: Construct, id: string, props: CoreStackProps) {
    super(scope, id, props);

    this.coreService = new CoreService(this, 'Service', props.coreServiceProps);
  }
}
