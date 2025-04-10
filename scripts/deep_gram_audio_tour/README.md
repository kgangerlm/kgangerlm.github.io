# Iceland Audio Tour Generator

A complete solution for creating GPS-triggered audio tours with special handling for Icelandic place names. This system generates high-quality audio files from text using the Deepgram API and provides a simulation of the mobile experience for testing.

## Features

- Converts tour text into MP3 audio files using Deepgram's text-to-speech API
- Special handling for Icelandic place names to ensure correct pronunciation
- Organizes tours into geofenced sections for GPS triggering
- Creates GeoJSON files for mapping and visualization
- Includes a simulator to test the GPS triggering functionality
- Configurable for multiple tour days or routes

## Requirements

### For the Audio Generator
- Python 3.7+
- `deepgram-sdk`
- `python-dotenv`
- `requests`
- `geojson`

### For the Tour Player Simulator
- Python 3.7+
- `pygame` (for audio playback)
- `geopy` (for distance calculations)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/iceland-audio-tour.git
   cd iceland-audio-tour
   ```

2. Install required dependencies:
   ```
   pip install deepgram-sdk python-dotenv requests geojson pygame geopy
   ```

3. Create a `.env` file with your Deepgram API key:
   ```
   DEEPGRAM_API_KEY=your_api_key_here
   ```

## Directory Structure

Create a directory structure like this:

```
tours/
├── day1/
│   ├── config.json
│   ├── section1_welcome.txt
│   ├── section2_location1.txt
│   └── ...
├── day2/
│   ├── config.json
│   ├── section1_welcome.txt
│   └── ...
└── ...
```

## Usage

### 1. Create Tour Content

1. Create a directory for your tour day (e.g., `tours/day4/`)
2. Create a `config.json` file in this directory (see example below)
3. Create text files for each section of your tour

Example `config.json`:
```json
{
  "name": "Day 4: Iceland Glacier Country",
  "voice": "aura-asteria-en",
  "sections": [
    {
      "file": "section1_welcome.txt",
      "title": "Welcome to Glacier Country",
      "latitude": 63.9462,
      "longitude": -19.0199,
      "radius": 500
    },
    ...
  ]
}
```

### 2. Generate Audio Files

Run the generator script:

```
python generate_tour.py tours/day4
```

This will:
- Create an `audio` subdirectory in your tour folder
- Generate MP3 files for each section
- Create a `geofence_data.json` file for GPS triggering
- Create a `tour_points.geojson` file for visualization

### 3. Test the Tour Player

Run the tour player simulator:

```
python tour_player.py tours/day4/audio/geofence_data.json
```

This will simulate GPS movement and trigger audio playback when entering geofenced areas.

### 4. Transfer to Mobile App

For a real implementation, you would:
1. Build a mobile app using React Native, Flutter, or a similar framework
2. Transfer the audio files and geofence data to the mobile app
3. Implement actual GPS tracking and audio playback in the app

## Handling Icelandic Pronunciation

The generator includes a preprocessing function that helps with the pronunciation of Icelandic place names. It replaces complex Icelandic words with phonetic equivalents that English text-to-speech systems can pronounce more accurately.

You can extend the list of Icelandic place names in the `preprocess_icelandic_text` function if needed.

## Voice Selection

Deepgram offers multiple voice options. The default is `aura-asteria-en`, but you can experiment with others like:
- `aura-athena-en` - Alternative female voice
- `aura-zeus-en` - Male voice

You can specify voices at two levels:
1. At the tour level (in `config.json`) to set the default voice for all sections
2. At the section level to use a specific voice for that section only

Example with mixed voices:
```json
{
  "name": "Day 4: Iceland Glacier Country",
  "voice": "aura-asteria-en",  // Default voice for the tour
  "sections": [
    {
      "file": "section1_welcome.txt",
      "title": "Welcome to Glacier Country",
      "voice": "aura-zeus-en",  // Male voice for the introduction
      "latitude": 63.9462,
      "longitude": -19.0199
    },
    {
      "file": "section2_location.txt",
      "title": "Another Location",
      "latitude": 64.1234,
      "longitude": -18.5678
      // Uses the default voice (aura-asteria-en) as no override specified
    }
  ]
}
```

This flexible approach allows you to create more engaging tours with different narrators for different sections, or even create dialog between multiple voices.

## Customization

### Adding More Tours

Simply create new directories for each tour day or route, following the same structure.

### Adjusting Geofence Radius

The `radius` parameter in each section controls how close a user needs to be to trigger the audio. Adjust this based on your specific needs:
- Smaller radius (100-200m) for dense areas with many points of interest
- Larger radius (500m+) for more spread-out locations

### Advanced Geofencing

For more complex geofencing needs, you can modify the code to support polygon or path-based geofences instead of simple circles.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Deepgram for providing the text-to-speech API
- The open-source Python community for the various libraries used
