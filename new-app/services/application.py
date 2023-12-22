import pulumi
from resources.bucket import FmBucket

class FmApp(pulumi.ComponentResource):
    def __init__(self, name, opts=None):
        super().__init__("pkg:index:FmApp", "my-app", None, opts)
        self.name = name
        self.bucket = FmBucket('my-bucket')
        self.opts = pulumi.ResourceOptions(parent=self)
