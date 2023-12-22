import pulumi
from pulumi_aws import s3


class FmBucket(pulumi.ComponentResource):
    def __init__(self, name, opts=None):
        super().__init__("pkg:index:FmBucket", "my-bucket", None, opts)
        self.name = name
        self.bucket = s3.Bucket(name, opts=pulumi.ResourceOptions(parent=self))
        s3.BucketPublicAccessBlock(
            self.name + "-public-access-block",
            bucket=self.bucket.id,
            block_public_acls=True,
            block_public_policy=True,
            ignore_public_acls=True,
            restrict_public_buckets=True,
            opts=pulumi.ResourceOptions(parent=self),
        )
