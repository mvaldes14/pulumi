"""An AWS Python Pulumi program"""
from services.application import FmApp 
app = FmApp('my-bucket')
