import requests
import json
import os
import subprocess
import tempfile
import sys
import argparse
import random

class ResembleAITextToSpeech:
    def __init__(self, config):
        """
        Initialize the Resemble AI client
        
        Args:
            config (dict): Configuration dictionary
        """
        self.api_key = config.get("api_key")
        self.project_uuid = config.get("project_uuid")
        self.voice_uuids = config.get("voice_uuids", [])
        self.streaming_endpoint = config.get("streaming_endpoint")
        
        # For backward compatibility, check for single voice_uuid as well
        single_voice_uuid = config.get("voice_uuid")
        if single_voice_uuid:
            if not self.voice_uuids:
                self.voice_uuids = [single_voice_uuid]
            elif single_voice_uuid not in self.voice_uuids:
                self.voice_uuids.append(single_voice_uuid)
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Validate required configuration
        missing_configs = []
        for key in ["api_key", "project_uuid", "streaming_endpoint"]:
            if not config.get(key):
                missing_configs.append(key)
        
        if not self.voice_uuids:
            missing_configs.append("voice_uuids or voice_uuid")
        
        if missing_configs:
            print(f"ERROR: Missing required configurations: {', '.join(missing_configs)}")
            print("Please check your config.json file.")
            sys.exit(1)
    
    def generate_audio_stream(self, ssml_content, voice_uuid=None):
        """
        Generate audio using Resemble AI streaming endpoint
        
        Args:
            ssml_content (str): SSML content to convert to speech
            voice_uuid (str, optional): Specific voice UUID to use. If None, randomly selects from available voices.
            
        Returns:
            bytes: Audio data if successful, None otherwise
        """
        if not ssml_content:
            print("ERROR: Cannot generate audio for empty content")
            return None
        
        # If no specific voice_uuid provided, randomly select one
        if voice_uuid is None:
            if not self.voice_uuids:
                print("ERROR: No voice UUIDs available")
                return None
            voice_uuid = random.choice(self.voice_uuids)
            
        print(f"Using voice UUID: {voice_uuid}")
        
        # Create API request with the SSML content directly
        data = {
            "project_uuid": self.project_uuid,
            "voice_uuid": voice_uuid,
            "data": ssml_content
        }
        
        try:
            print(f"Sending request to: {self.streaming_endpoint}")
            print(f"Data length: {len(ssml_content)} characters")
            print(f"Data preview: {ssml_content[:100]}...")
            
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
                
                # Retry with alternative formatting if needed
                if response.status_code == 500 and "data" in data:
                    print("Retrying with different request format...")
                    
                    # Try with 'text' parameter instead of 'data'
                    alt_data = {
                        "project_uuid": self.project_uuid,
                        "voice_uuid": voice_uuid,
                        "text": ssml_content
                    }
                    
                    retry_response = requests.post(
                        self.streaming_endpoint,
                        headers=self.headers,
                        json=alt_data,
                        stream=True
                    )
                    
                    if retry_response.status_code == 200:
                        print("Retry successful (200 OK)")
                        audio_data = b""
                        for chunk in retry_response.iter_content(chunk_size=1024):
                            if chunk:
                                audio_data += chunk
                        
                        print(f"Received {len(audio_data)} bytes of audio data")
                        return audio_data
                    else:
                        print(f"Retry failed: {retry_response.status_code}")
                        print(retry_response.text)
                
                return None
        except Exception as e:
            print(f"Exception during API request: {e}")
            return None
    
    def convert_wav_to_mp3(self, wav_data, mp3_file):
        """
        Convert WAV data to MP3 using ffmpeg
        
        Args:
            wav_data (bytes): WAV audio data
            mp3_file (str): Output MP3 file path
            
        Returns:
            bool: True if successful, False otherwise
        """
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
    
    def combine_wav_files(self, wav_files, output_mp3):
        """
        Combine multiple WAV files into a single MP3 file
        
        Args:
            wav_files (list): List of WAV file paths
            output_mp3 (str): Output MP3 file path
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not wav_files:
            print("ERROR: No WAV files to combine")
            return False
            
        if len(wav_files) == 1:
            # If there's only one WAV file, convert it directly
            with open(wav_files[0], 'rb') as f:
                wav_data = f.read()
            return self.convert_wav_to_mp3(wav_data, output_mp3)
        
        # Create a temporary directory for concatenation
        temp_dir = tempfile.mkdtemp()
        print(f"Created temporary directory: {temp_dir}")
        
        try:
            # Create a file list for ffmpeg
            list_file_path = os.path.join(temp_dir, "files.txt")
            with open(list_file_path, 'w') as f:
                for wav_file in wav_files:
                    f.write(f"file '{wav_file}'\n")
            
            print(f"Created file list: {list_file_path}")
            
            # Concatenate WAV files and convert to MP3
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
            
            # Convert to MP3
            print(f"Converting combined WAV to MP3: {output_mp3}")
            
            subprocess.run([
                'ffmpeg',
                '-i', temp_combined_wav,
                '-codec:a', 'libmp3lame',
                '-qscale:a', '2',
                output_mp3
            ], check=True, capture_output=True)
            
            print(f"Generated: {output_mp3}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"FFmpeg error: {e}")
            print(f"FFmpeg stdout: {e.stdout.decode() if e.stdout else 'None'}")
            print(f"FFmpeg stderr: {e.stderr.decode() if e.stderr else 'None'}")
            return False
        except Exception as e:
            print(f"Error in concatenation process: {e}")
            return False
        finally:
            # Clean up temporary files
            try:
                os.unlink(list_file_path)
            except:
                pass
            try:
                os.unlink(temp_combined_wav)
            except:
                pass
            try:
                os.rmdir(temp_dir)
                print(f"Removed temporary directory: {temp_dir}")
            except:
                pass
            
    def read_ssml_file(self, file_path):
        """
        Read SSML content from a file
        
        Args:
            file_path (str): Path to the SSML file
            
        Returns:
            str: SSML content if successful, None otherwise
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                return content
        except FileNotFoundError:
            print(f"ERROR: SSML file not found: {file_path}")
            return None
        except Exception as e:
            print(f"ERROR: Failed to read SSML file {file_path}: {e}")
            return None
    
    def process_tour_json(self, json_file, input_dir, output_dir):
        """
        Process tour JSON file and generate audio files
        
        Args:
            json_file (str): Path to the JSON file
            input_dir (str): Directory containing SSML files
            output_dir (str): Directory for output MP3 files
            
        Returns:
            list: List of generated MP3 file paths
        """
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
        
        tour_title = data.get("title", "Untitled Tour")
        sections = data.get("sections", [])
        
        print(f"Tour Title: {tour_title}")
        print(f"Number of sections: {len(sections)}")
        
        if not sections:
            print("WARNING: No sections found in the JSON file")
            return []
        
        generated_files = []
        
        # Process each section
        for i, section in enumerate(sections):
            section_id = section.get("id", f"section{i}")
            section_title = section.get("title", f"Section {i+1}")
            
            print(f"\nProcessing section {i+1}/{len(sections)}: {section_title} (ID: {section_id})")
            
            # Select a random voice for this entire section
            selected_voice = random.choice(self.voice_uuids) if self.voice_uuids else None
            print(f"Selected voice UUID: {selected_voice}")
            
            # Check if this is a single-file section or a multi-part section
            if "ssmlFile" in section:
                # Single-file section
                ssml_file = os.path.join(input_dir, section["ssmlFile"])
                mp3_file = os.path.join(output_dir, f"{section_id}.mp3")
                
                print(f"Single-file section. SSML file: {ssml_file}")
                
                # Read SSML content
                ssml_content = self.read_ssml_file(ssml_file)
                if not ssml_content:
                    print(f"WARNING: Failed to read SSML content for section '{section_title}'. Skipping...")
                    continue
                
                # Generate audio with selected voice
                audio_data = self.generate_audio_stream(ssml_content, selected_voice)
                if audio_data:
                    # Convert to MP3
                    if self.convert_wav_to_mp3(audio_data, mp3_file):
                        generated_files.append(mp3_file)
                        print(f"Generated: {mp3_file}")
                    else:
                        print(f"Failed to convert audio for: {section_title}")
                else:
                    print(f"Failed to generate audio for: {section_title}")
            
            elif "parts" in section:
                # Multi-part section
                parts = section.get("parts", [])
                combine_parts = section.get("combineIntoSingleMP3", False)
                
                print(f"Multi-part section with {len(parts)} parts. Combine parts: {combine_parts}")
                
                if not parts:
                    print(f"WARNING: No parts found for section '{section_title}'. Skipping...")
                    continue
                
                if combine_parts:
                    # Process all parts with same voice and combine into one MP3
                    temp_wav_files = []
                    temp_dir = tempfile.mkdtemp()
                    
                    try:
                        for j, part in enumerate(parts):
                            part_title = part.get("title", f"Part {j+1}")
                            ssml_file = os.path.join(input_dir, part["ssmlFile"])
                            
                            print(f"Processing part {j+1}/{len(parts)}: {part_title}")
                            print(f"SSML file: {ssml_file}")
                            
                            # Read SSML content
                            ssml_content = self.read_ssml_file(ssml_file)
                            if not ssml_content:
                                print(f"WARNING: Failed to read SSML content for part '{part_title}'. Skipping...")
                                continue
                            
                            # Generate audio with the same voice for all parts
                            audio_data = self.generate_audio_stream(ssml_content, selected_voice)
                            if audio_data:
                                # Save to temporary WAV file
                                temp_wav_path = os.path.join(temp_dir, f"part_{j}.wav")
                                with open(temp_wav_path, 'wb') as f:
                                    f.write(audio_data)
                                print(f"Saved part to: {temp_wav_path}")
                                temp_wav_files.append(temp_wav_path)
                            else:
                                print(f"Failed to generate audio for part '{part_title}'")
                        
                        if temp_wav_files:
                            # Combine WAV files into one MP3
                            mp3_file = os.path.join(output_dir, f"{section_id}.mp3")
                            if self.combine_wav_files(temp_wav_files, mp3_file):
                                generated_files.append(mp3_file)
                            else:
                                print(f"Failed to combine parts for section '{section_title}'")
                        else:
                            print(f"No audio generated for any part in section '{section_title}'")
                    finally:
                        # Clean up temporary files
                        for wav_file in temp_wav_files:
                            try:
                                os.unlink(wav_file)
                            except:
                                pass
                        try:
                            os.rmdir(temp_dir)
                            print(f"Removed temporary directory: {temp_dir}")
                        except:
                            pass
                
                else:
                    # Process each part separately, but using a new random voice for each part
                    for j, part in enumerate(parts):
                        part_title = part.get("title", f"Part {j+1}")
                        ssml_file = os.path.join(input_dir, part["ssmlFile"])
                        part_id = part.get("id", f"{section_id}_part{j}")
                        mp3_file = os.path.join(output_dir, f"{part_id}.mp3")
                        
                        # Each part gets its own random voice when not combining
                        part_voice = random.choice(self.voice_uuids) if self.voice_uuids else None
                        print(f"Selected voice for part {j+1}: {part_voice}")
                        
                        print(f"Processing part {j+1}/{len(parts)}: {part_title}")
                        print(f"SSML file: {ssml_file}")
                        
                        # Read SSML content
                        ssml_content = self.read_ssml_file(ssml_file)
                        if not ssml_content:
                            print(f"WARNING: Failed to read SSML content for part '{part_title}'. Skipping...")
                            continue
                        
                        # Generate audio with selected voice for this part
                        audio_data = self.generate_audio_stream(ssml_content, part_voice)
                        if audio_data:
                            # Convert to MP3
                            if self.convert_wav_to_mp3(audio_data, mp3_file):
                                generated_files.append(mp3_file)
                                print(f"Generated: {mp3_file}")
                            else:
                                print(f"Failed to convert audio for part '{part_title}'")
                        else:
                            print(f"Failed to generate audio for part '{part_title}'")
            
            else:
                print(f"WARNING: Section '{section_title}' has neither 'ssmlFile' nor 'parts'. Skipping...")
        
        return generated_files


def load_config(config_file="config.json"):
    """
    Load configuration from a JSON file
    
    Args:
        config_file (str): Path to the configuration file
        
    Returns:
        dict: Configuration dictionary
    """
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
    # Set up argument parser
    parser = argparse.ArgumentParser(description="Resemble AI Text-to-Speech Generator for Audio Tours")
    parser.add_argument("day", type=int, help="Day number for the tour to process")
    parser.add_argument("--config", default="config.json", help="Path to the configuration file (default: config.json)")
    
    args = parser.parse_args()
    day_number = args.day
    config_file = args.config
    
    # Set up paths
    input_dir = f"audio_scripts/day{day_number}"
    output_dir = f"tours/day{day_number}"
    json_file = os.path.join(input_dir, "audio_tour.json")
    
    # Load configuration
    config = load_config(config_file)
    if not config:
        print("ERROR: Could not load configuration. Exiting.")
        sys.exit(1)
    
    # Get configuration values
    api_key = config.get("api_key")
    project_uuid = config.get("project_uuid")
    voice_uuid = config.get("voice_uuid")
    streaming_endpoint = config.get("streaming_endpoint")
    
    print("=== Resemble AI Text-to-Speech Script ===")
    print(f"Processing tour for Day {day_number}")
    print(f"API Key: {'*'*4}{api_key[-4:] if api_key and len(api_key) > 4 and api_key != 'YOUR_API_KEY' else 'Not set'}")
    print(f"Project UUID: {project_uuid}")
    print(f"Voice UUID: {voice_uuid}")
    print(f"Streaming endpoint: {streaming_endpoint}")
    print(f"Input directory: {input_dir}")
    print(f"Output directory: {output_dir}")
    print(f"JSON file: {json_file}")
    print("========================================")
    
    # Verify input directory and JSON file exist
    if not os.path.exists(input_dir):
        print(f"ERROR: Input directory not found: {input_dir}")
        sys.exit(1)
    
    if not os.path.exists(json_file):
        print(f"ERROR: JSON file not found: {json_file}")
        sys.exit(1)
    
    # Initialize client
    resemble_client = ResembleAITextToSpeech(config)
    
    # Process JSON file
    generated_files = resemble_client.process_tour_json(json_file, input_dir, output_dir)
    
    if generated_files:
        print(f"\nSuccessfully generated {len(generated_files)} MP3 files:")
        for file in generated_files:
            print(f" - {file}")
    else:
        print("\nNo files were generated. Please check the error messages above.")


if __name__ == "__main__":
    main()