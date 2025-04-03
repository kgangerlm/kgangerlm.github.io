import requests
import json
import os
from pydub import AudioSegment
import io

class ResembleAITextToSpeech:
    def __init__(self, api_key, project_uuid, voice_uuid):
        """
        Initialize the Resemble AI client

        Args:
            api_key (str): Your Resemble AI API key
            project_uuid (str): Your project UUID
            voice_uuid (str): Your voice UUID
        """
        self.api_key = api_key
        self.project_uuid = project_uuid
        self.voice_uuid = voice_uuid
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Get the streaming endpoint URL
        # Note: In a real implementation, you would get this from your Resemble account
        self.streaming_endpoint = None
        self.get_streaming_endpoint()

    def get_streaming_endpoint(self):
        """Retrieve the streaming endpoint URL from Resemble AI"""
        try:
            response = requests.get(
                f"https://app.resemble.ai/api/v2/projects/{self.project_uuid}/voices/{self.voice_uuid}",
                headers=self.headers
            )

            if response.status_code == 200:
                data = response.json()
                self.streaming_endpoint = data.get("streaming_endpoint")
                if not self.streaming_endpoint:
                    print("Streaming endpoint not found in response. Please set it manually.")
            else:
                print(f"Failed to retrieve streaming endpoint: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"Error retrieving streaming endpoint: {e}")

    def chunk_text(self, text, max_length=3000):
        """
        Split text into chunks that are under the max_length

        Args:
            text (str): The text to chunk
            max_length (int): Maximum character length (default 3000)

        Returns:
            list: List of text chunks
        """
        # If text is already within limits, return as is
        if len(text) <= max_length:
            return [text]

        chunks = []
        current_chunk = ""

        # Split by sentences (roughly)
        sentences = text.replace(". ", ".|").replace("! ", "!|").replace("? ", "?|").split("|")

        for sentence in sentences:
            # If adding this sentence would exceed the limit, save current chunk and start a new one
            if len(current_chunk) + len(sentence) > max_length:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = sentence
            else:
                if current_chunk:
                    current_chunk += " " + sentence
                else:
                    current_chunk = sentence

        # Add the last chunk if it's not empty
        if current_chunk:
            chunks.append(current_chunk)

        return chunks

    def generate_audio_stream(self, text):
        """
        Generate audio using Resemble AI streaming endpoint

        Args:
            text (str): Text to convert to speech

        Returns:
            bytes: WAV audio data
        """
        if not self.streaming_endpoint:
            raise ValueError("Streaming endpoint URL is not set")

        data = {
            "text": text,
            "voice_uuid": self.voice_uuid,
            "project_uuid": self.project_uuid
        }

        try:
            # Make request to streaming endpoint
            response = requests.post(
                self.streaming_endpoint,
                headers=self.headers,
                json=data,
                stream=True
            )

            if response.status_code == 200:
                # Stream the response and gather all chunks
                audio_data = b""
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        audio_data += chunk

                return audio_data
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
                return None
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None

    def convert_wav_to_mp3(self, audio_data, mp3_file):
        """
        Convert WAV audio data to MP3 directly

        Args:
            audio_data (bytes): The WAV audio data
            mp3_file (str): Output MP3 file path

        Returns:
            bool: Success status
        """
        try:
            sound = AudioSegment.from_wav(io.BytesIO(audio_data))
            sound.export(mp3_file, format="mp3")
            return True
        except Exception as e:
            print(f"Error converting to MP3: {e}")
            return False

    def process_json_file(self, json_file, output_dir="output"):
        """
        Process JSON file containing location data

        Args:
            json_file (str): Path to JSON file
            output_dir (str): Directory to store output files

        Returns:
            str: Path to generated MP3 file
        """
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Read JSON file
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Handle both single object and array formats
        if isinstance(data, dict):
            data = [data]

        generated_files = []

        # Process each entry
        for entry in data:
            title = entry.get("title", "Untitled")
            text = entry.get("text", "")

            # Create a filename-friendly version of the title
            safe_title = "".join(c if c.isalnum() else "_" for c in title)
            mp3_file = os.path.join(output_dir, f"{safe_title}.mp3")

            # Chunk the text if necessary
            text_chunks = self.chunk_text(text)

            if len(text_chunks) == 1:
                # Simple case - one chunk
                print(f"Generating audio for '{title}'...")
                audio_data = self.generate_audio_stream(text)
                if audio_data:
                    # Convert directly to MP3
                    if self.convert_wav_to_mp3(audio_data, mp3_file):
                        generated_files.append(mp3_file)
                        print(f"Generated: {mp3_file}")
            else:
                # Multiple chunks needed
                print(f"Text for '{title}' exceeds 3000 characters. Splitting into {len(text_chunks)} chunks.")

                temp_audio_segments = []

                for i, chunk in enumerate(text_chunks):
                    print(f"Processing chunk {i+1}/{len(text_chunks)}...")
                    audio_data = self.generate_audio_stream(chunk)

                    if audio_data:
                        # Convert to AudioSegment
                        audio_segment = AudioSegment.from_wav(io.BytesIO(audio_data))
                        temp_audio_segments.append(audio_segment)

                if temp_audio_segments:
                    # Concatenate all audio segments
                    combined = temp_audio_segments[0]
                    for segment in temp_audio_segments[1:]:
                        combined += segment

                    # Export as MP3
                    combined.export(mp3_file, format="mp3")
                    generated_files.append(mp3_file)
                    print(f"Generated: {mp3_file}")

        return generated_files


def main():
    # Configuration
    api_key = "Ury7EUOCOpGmq9mTSHFuXAtt"
    project_uuid = "a60eac7d"
    voice_uuid = "c0bf0d6d"
    json_file = "audio_scripts/day3.json"
    output_dir = "tours/day3"

    # Initialize client
    resemble_client = ResembleAITextToSpeech(api_key, project_uuid, voice_uuid)

    # Process JSON file
    generated_files = resemble_client.process_json_file(json_file, output_dir)

    print(f"Generated {len(generated_files)} MP3 files:")
    for file in generated_files:
        print(f" - {file}")


if __name__ == "__main__":
    main()
