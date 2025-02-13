import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from SpeakerDetection.pyannoteCheckSpeechNote import pyannoteCheckSpeechNote

def upload_file_to_s3(fileName=None):
    file_name = f"./{fileName}"
    bucket_name = "se101"
    object_name = f'{fileName}'
    region = "us-east-1"
    if object_name is None:
        object_name = file_name

    # Create an S3 client
    try:
        s3_client = boto3.client('s3', region_name=region)

        # Upload the file
        s3_client.upload_file(file_name, bucket_name, object_name)
        print(f"File '{file_name}' successfully uploaded to bucket '{bucket_name}' as '{object_name}'.")
        pyannoteCheckSpeechNote(fileName)
        return True

    except FileNotFoundError:
        print(f"Error: File '{file_name}' not found.")
    except NoCredentialsError:
        print("Error: AWS credentials not available.")
    except PartialCredentialsError:
        print("Error: Incomplete AWS credentials provided.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    return False

