import requests
import json
import os
import subprocess
import tempfile
import sys

class ResembleAITextToSpeech:
    def __init__(self, config):
        """
        Initialize the Resemble AI client
        
        Args:
            config (dict): Configuration dictionary
        """
        self.api_key = config.get("api_key")
        self.project_uuid = config.get("project_uuid")
        self.voice_uuid = config.get("voice_uuid")
        self.streaming_endpoint = config.get("streaming_endpoint")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Validate required configuration
        missing_configs = []
        for key in ["api_key", "project_uuid", "voice_uuid", "streaming_endpoint"]:
            if not config.get(key):
                missing_configs.append(key)
        
        if missing_configs:
            print(f"ERROR: Missing required configurations: {', '.join(missing_configs)}")
            print("Please check your config.json file.")
            sys.exit(1)
    
    def chunk_text(self, text, max_length=3000):
        """Split text into chunks under max_length"""
        if not text:
            print("WARNING: Empty text provided for chunking")
            return []
            
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
        """Generate audio using Resemble AI streaming endpoint"""
        if not text:
            print("ERROR: Cannot generate audio for empty text")
            return None
            
        # Updated API request format according to error message
        data = {
            "project_uuid": self.project_uuid,
            "voice_uuid": self.voice_uuid,
            "data": text  # Using 'data' field instead of 'text'
        }
        
        try:
            print(f"Sending request to: {self.streaming_endpoint}")
            print(f"Data length: {len(text)} characters")
            print(f"Data preview: {text[:100]}...")
            
            # Make request to streaming endpoint
            response = requests.post(
                self.streaming_endpoint,
                headers=self.headers,
                json=data,
                stream=True
            )
            
            if response.status_code == 200:
                print("Request successful (200 OK)")
                # Stream the response and gather all chunks
                audio_data = b""
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        audio_data += chunk
                
                print(f"Received {len(audio_data)} bytes of audio data")
                return audio_data
            else:
                print(f"Error response: {response.status_code}")
                print(response.text)
                return None
        except Exception as e:
            print(f"Exception during API request: {e}")
            return None
    
    def convert_wav_to_mp3(self, wav_data, mp3_file):
        """Convert WAV data to MP3 using ffmpeg"""
        try:
            # Create a temporary file for the WAV data
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_wav_file:
                temp_wav_path = temp_wav_file.name
                temp_wav_file.write(wav_data)
            
            print(f"Temporary WAV file created: {temp_wav_path}")
            print(f"Converting to MP3: {mp3_file}")
            
            # Use ffmpeg to convert WAV to MP3
            try:
                result = subprocess.run([
                    'ffmpeg',
                    '-i', temp_wav_path,
                    '-codec:a', 'libmp3lame',
                    '-qscale:a', '2',  # High quality setting
                    mp3_file
                ], check=True, capture_output=True)
                
                print("Conversion successful")
                return True
            except subprocess.CalledProcessError as e:
                print(f"FFmpeg error: {e}")
                print(f"FFmpeg stdout: {e.stdout.decode() if e.stdout else 'None'}")
                print(f"FFmpeg stderr: {e.stderr.decode() if e.stderr else 'None'}")
                return False
            finally:
                # Clean up the temporary WAV file
                os.unlink(temp_wav_path)
                print(f"Temporary file removed: {temp_wav_path}")
                
        except Exception as e:
            print(f"Error in conversion process: {e}")
            return False
    
    def process_json_file(self, json_file, output_dir="output"):
        """Process JSON file containing tour data with sections"""
        # Create output directory if it doesn't exist
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"Created output directory: {output_dir}")
        
        # Read JSON file
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"Loaded JSON file: {json_file}")
        except FileNotFoundError:
            print(f"ERROR: JSON file not found: {json_file}")
            return []
        except json.JSONDecodeError as e:
            print(f"ERROR: Invalid JSON in file {json_file}: {e}")
            return []
        
        main_title = data.get("title", "Untitled Tour")
        sections = data.get("sections", [])
        
        print(f"Tour Title: {main_title}")
        print(f"Number of sections: {len(sections)}")
        
        if not sections:
            print("WARNING: No sections found in the JSON file")
            return []
        
        generated_files = []
        
        # Process each section
        for i, section in enumerate(sections):
            section_title = section.get("title", f"Section {i+1}")
            section_text = section.get("text", "")
            
            if not section_text:
                print(f"WARNING: Empty text for section '{section_title}'. Skipping...")
                continue
                
            print(f"\nProcessing section {i+1}/{len(sections)}: {section_title}")
            print(f"Text length: {len(section_text)} characters")
            print(f"Text preview: {section_text[:100]}...")
            
            # Create a filename-friendly version of the section title
            safe_title = "".join(c if c.isalnum() else "_" for c in section_title)
            mp3_file = os.path.join(output_dir, f"{safe_title}.mp3")
            
            # Chunk the text if necessary
            text_chunks = self.chunk_text(section_text)
            
            if not text_chunks:
                print(f"WARNING: No valid text chunks for '{section_title}'. Skipping...")
                continue
                
            if len(text_chunks) == 1:
                # Simple case - one chunk
                print(f"Generating audio (single chunk)...")
                audio_data = self.generate_audio_stream(section_text)
                if audio_data:
                    # Convert directly to MP3
                    if self.convert_wav_to_mp3(audio_data, mp3_file):
                        generated_files.append(mp3_file)
                        print(f"Generated: {mp3_file}")
                    else:
                        print(f"Failed to convert audio for: {section_title}")
                else:
                    print(f"Failed to generate audio for: {section_title}")
            else:
                # Multiple chunks needed
                print(f"Text exceeds 3000 characters. Splitting into {len(text_chunks)} chunks.")
                
                # Create a temporary directory for chunk WAV files
                temp_dir = tempfile.mkdtemp()
                print(f"Created temporary directory: {temp_dir}")
                
                temp_wav_files = []
                
                try:
                    # Generate audio for each chunk
                    for j, chunk in enumerate(text_chunks):
                        print(f"Processing chunk {j+1}/{len(text_chunks)}...")
                        audio_data = self.generate_audio_stream(chunk)
                        
                        if audio_data:
                            # Save to temporary WAV file
                            temp_wav_path = os.path.join(temp_dir, f"chunk_{j}.wav")
                            with open(temp_wav_path, 'wb') as f:
                                f.write(audio_data)
                            print(f"Saved chunk to: {temp_wav_path}")
                            temp_wav_files.append(temp_wav_path)
                        else:
                            print(f"Failed to generate audio for chunk {j+1}")
                    
                    if temp_wav_files:
                        # Create a file list for ffmpeg
                        list_file_path = os.path.join(temp_dir, "files.txt")
                        with open(list_file_path, 'w') as f:
                            for wav_file in temp_wav_files:
                                f.write(f"file '{wav_file}'\n")
                        
                        print(f"Created file list: {list_file_path}")
                        
                        # Concatenate all WAV files and convert to MP3
                        try:
                            # First concatenate WAV files
                            temp_combined_wav = os.path.join(temp_dir, "combined.wav")
                            print(f"Concatenating WAV files to: {temp_combined_wav}")
                            
                            subprocess.run([
                                'ffmpeg',
                                '-f', 'concat',
                                '-safe', '0',
                                '-i', list_file_path,
                                '-c', 'copy',
                                temp_combined_wav
                            ], check=True, capture_output=True)
                            
                            # Then convert to MP3
                            print(f"Converting combined WAV to MP3: {mp3_file}")
                            
                            subprocess.run([
                                'ffmpeg',
                                '-i', temp_combined_wav,
                                '-codec:a', 'libmp3lame',
                                '-qscale:a', '2',
                                mp3_file
                            ], check=True, capture_output=True)
                            
                            generated_files.append(mp3_file)
                            print(f"Generated: {mp3_file}")
                        except subprocess.CalledProcessError as e:
                            print(f"FFmpeg error: {e}")
                            print(f"FFmpeg output: {e.stdout.decode() if e.stdout else ''}")
                            print(f"FFmpeg error output: {e.stderr.decode() if e.stderr else ''}")
                    else:
                        print("No chunks were successfully processed")
                finally:
                    # Clean up temporary files
                    print("Cleaning up temporary files...")
                    for wav_file in temp_wav_files:
                        try:
                            os.unlink(wav_file)
                        except Exception as e:
                            print(f"Failed to remove {wav_file}: {e}")
                    try:
                        os.unlink(os.path.join(temp_dir, "combined.wav"))
                    except Exception as e:
                        print(f"Failed to remove combined.wav: {e}")
                    try:
                        os.unlink(list_file_path)
                    except Exception as e:
                        print(f"Failed to remove files.txt: {e}")
                    try:
                        os.rmdir(temp_dir)
                        print(f"Removed temporary directory: {temp_dir}")
                    except Exception as e:
                        print(f"Failed to remove temporary directory: {e}")
        
        return generated_files


def load_config(config_file="config.json"):
    """Load configuration from a JSON file"""
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            config = json.load(f)
            return config
    except FileNotFoundError:
        print(f"ERROR: Config file not found: {config_file}")
        return {}
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON in config file {config_file}: {e}")
        return {}


def main():
    # Load configuration from config.json
    config_file = "config.json"
    if len(sys.argv) > 1:
        config_file = sys.argv[1]
    
    config = load_config(config_file)
    if not config:
        print("ERROR: Could not load configuration. Exiting.")
        sys.exit(1)
    
    # Get configuration values with defaults
    api_key = config.get("api_key")
    project_uuid = config.get("project_uuid")
    voice_uuid = config.get("voice_uuid")
    streaming_endpoint = config.get("streaming_endpoint")
    json_file = config.get("json_file", "input.json")
    output_dir = config.get("output_dir", "audio_output")
    
    print("=== Resemble AI Text-to-Speech Script ===")
    print(f"API Key: {'*'*4}{api_key[-4:] if api_key and api_key != 'YOUR_API_KEY' else 'Not set'}")
    print(f"Project UUID: {project_uuid}")
    print(f"Voice UUID: {voice_uuid}")
    print(f"Streaming endpoint: {streaming_endpoint}")
    print(f"JSON file: {json_file}")
    print(f"Output directory: {output_dir}")
    print("========================================")
    
    # Initialize client
    resemble_client = ResembleAITextToSpeech(config)
    
    # Process JSON file
    generated_files = resemble_client.process_json_file(json_file, output_dir)
    
    if generated_files:
        print(f"\nSuccessfully generated {len(generated_files)} MP3 files:")
        for file in generated_files:
            print(f" - {file}")
    else:
        print("\nNo files were generated. Please check the error messages above.")


if __name__ == "__main__":
    main()