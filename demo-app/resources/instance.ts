import * as pulumi from "@pulumi/pulumi";
import { ec2 } from "@pulumi/aws";

type InstanceArgs = {
  name: string;
  service: string;
};

export class FmInstance extends pulumi.ComponentResource {
  constructor(args: InstanceArgs, opts?: pulumi.ComponentResourceOptions) {
    const name = `${args.service}-${args.name}`;
    super("pkg:index:FmInstance", name, {}, opts);

    const vpc = new ec2.Vpc(
      "vpc",
      {
        cidrBlock: "10.0.0.0/16",
      },
      { parent: this }
    );

    const subnet = new ec2.Subnet(
      "subnet",
      {
        vpcId: vpc.id,
        cidrBlock: "10.0.1.0/24",
      },
      { parent: vpc }
    );

    const basicSg = new ec2.SecurityGroup(
      "basic-sg",
      {
        vpcId: vpc.id,
        ingress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
          },
        ],
        egress: [
          {
            cidrBlocks: ["0.0.0.0/0"],
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
          },
        ],
      },
      { parent: vpc }
    );

    const ami = pulumi.output(
      ec2.getAmi({
        owners: ["amazon"],
        mostRecent: true,
        filters: [{ name: "description", values: ["Amazon Linux 2 *"] }],
      })
    );

    new ec2.Instance(
      "instance",
      {
        ami: ami.id,
        instanceType: "t3.nano",
        subnetId: subnet.id,
        vpcSecurityGroupIds: [basicSg.id],
        userData: `
        #!/bin/bash
        amazon-linux-extras install nginx1
        amazon-linux-extras enable nginx
        systemctl enable nginx
        systemctl start nginx
    `,
        tags: {
          Name: name,
          Env: pulumi.getStack(),
        },
      },
      {
        parent: this,
      }
    );
  }
}
