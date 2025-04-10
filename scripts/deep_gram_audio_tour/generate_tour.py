import os
import sys
import json
import argparse
import time
import requests
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from dotenv import load_dotenv


class IcelandicTourGenerator:
    def __init__(self, tour_dir: str, output_dir: str = None):
        """Initialize the tour generator.

        Args:
            tour_dir: Path to the tour directory containing config.json and text files
            output_dir: Optional path to output directory for generated files
        """
        # Load environment variables from .env file if it exists
        load_dotenv()

        # Get API key from environment variables
        self.api_key = os.getenv("DEEPGRAM_API_KEY")
        if not self.api_key:
            raise ValueError("DEEPGRAM_API_KEY environment variable is not set")

        # Set up paths
        self.tour_dir = Path(tour_dir)
        self.config_path = self.tour_dir / "config.json"

        if not self.config_path.exists():
            raise FileNotFoundError(f"Config file not found: {self.config_path}")

        # Load config
        with open(self.config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

        # Set up output directory
        if output_dir:
            self.output_dir = Path(output_dir)
        else:
            self.output_dir = self.tour_dir / "audio"

        self.output_dir.mkdir(exist_ok=True, parents=True)

        # Base URL for Deepgram TTS API
        self.api_url = "https://api.deepgram.com/v1/speak"
        
        self.geofence_data = []

    def preprocess_icelandic_text(self, text: str) -> str:
        """Preprocess text to help with pronunciation of Icelandic words.

        This function applies various rules to improve the pronunciation of
        Icelandic place names in English TTS systems.

        Args:
            text: Input text that may contain Icelandic place names

        Returns:
            Preprocessed text with phonetic hints for better pronunciation
        """
        # List of common Icelandic place names and their phonetic equivalents
        icelandic_replacements = {
            # General locations
            "Reykjavík": "Rey kya veek",
            "Keflavík": "Kef la veek",
            "Akureyri": "Ah koo rey ri",
            "Höfn": "Hup n",
            "Vík": "Veek",
            "Selfoss": "Self oss",
            "Egilsstaðir": "Ey gils sta thir",
            "Akranes": "Ak ra nes",
            "Siglufjörður": "Sig lu fyur thur",
            "Grundarfjörður": "Grun dar fyur thur",
            "Ólafsvík": "Oh lafs veek",
            "Stykkishólmur": "Stik is hole mur",
            "Borgarnes": "Bor gar nes",
            "Eidar": "Ey dar",
            "Hvolsvöllur": "Kvol svut lur",
            "Blönduós": "Blun du ohs",
            "Sauðárkrókur": "Soy thar krow kur",
            "Húsavík": "Hoo sa veek",
            
            # Peninsulas and regions
            "Snæfellsnes": "Sny fetls nes",
            "Tröllaskagi": "Trut la ska yi",
            "Borgarfjörður Eystri": "Bor gar fyur thur Ey stri",
            "Vestmannaeyjar": "Vest man a ey yar",
            "Skagafjörður": "Ska ga fyur thur",
            "Eyjafjörður": "Ey ya fyur thur",
            "Faxaflói": "Fax a floy i",
            "Reykjanes": "Rey kya nes",
            "Seltjarnarnes": "Selt yar nar nes",
            
            # Waterfalls
            "Seljalandsfoss": "Sel ya lands foss",
            "Skógafoss": "Sko ga foss",
            "Svartifoss": "Svar ti foss",
            "Dettifoss": "Det ti foss",
            "Goðafoss": "Go tha foss",
            "Gullfoss": "Gult foss",
            "Kvernufoss": "Kver nu foss",
            "Strútsfoss": "Stroots foss",
            "Faxi": "Fax i",
            "Brúarfoss": "Broo ar foss",
            "Gljúfrabúi": "Glyoo fra boo i",
            "Háifoss": "How i foss",
            "Hjálparfoss": "Hyowl par foss",
            "Kirkjufellsfoss": "Kirk yu fetls foss",
            "Öxarárfoss": "Ux ar our foss",
            "Hraunfossar": "Hroyn foss ar",
            "Dynjandi": "Din yan di",
            "Barnafoss": "Bar na foss",
            "Aldeyjarfoss": "Al dey yar foss",
            "Hengifoss": "Heng i foss",
            "Glymur": "Glim ur",
            "Folaldafoss": "Fo lald a foss",
            "Bjarnarfoss": "Byar nar foss",
            "Svöðufoss": "Svu thu foss",
            "Tungnaárfellsfoss": "Tung na our fetls foss",
            "Mígandifoss": "Mee gan di foss",
            "Bergárfoss": "Berg our foss",
            
            # Glaciers and ice features
            "Vatnajökull": "Vat na yu kutl",
            "Jökulsárlón": "Yu kuls our lohn",
            "Skaftafellsjökull": "Skaf ta fetls yu kutl",
            "Svínafellsjökull": "Svee na fetls yu kutl",
            "Fjallajökull": "Fyat la yu kutl",
            "Snæfellsjökull": "Sny fetls yu kutl",
            "Langjökull": "Lang yu kutl",
            "Sólheimajökull": "Soul hey ma yu kutl",
            "Eyjafjallajökull": "Ey ya fyat la yu kutl",
            "Mýrdalsjökull": "Meer dals yu kutl",
            "Hofsjökull": "Hofs yu kutl",
            "Drangajökull": "Dran ga yu kutl",
            
            # Beaches and coastal features
            "Reynisfjara": "Rey nis fyara",
            "Vikurfjara": "Vik ur fyara",
            "Djúpalónssandur": "Dyoo pa loans san dur",
            "Ytri Tunga": "It ri Tung a",
            "Hvalnes": "Kval nes",
            "Reynisdrangar": "Rey nis drang ar",
            "Dyrhólaey": "Dir hoe la ey",
            "Hvítserkur": "Kveet ser kur",
            "Lóndrangar": "Lohn drang ar",
            
            # Hot springs and bathing spots
            "Reykjadalur": "Rey kya da lur",
            "Lanbrotalaug": "Lan bro ta loyg",
            "Mývatn": "Mee vatn",
            "Laugarvatn": "Loy gar vatn",
            "Hofsós": "Hofs ohs",
            "Bjórböðin": "Byohr buh thin",
            "Fontana": "Fon ta na",
            "Laugardalslaug": "Loy gar dals loyg",
            "Krauma": "Krow ma",
            
            # National parks and natural features
            "Þingvellir": "Thing vet lir",
            "Skaftafell": "Skaf ta fetl",
            "Ásbyrgi": "Ows bir yi",
            "Fjaðrárgljúfur": "Fyath rowr glyoo fur",
            "Eldgjá": "Eld gyow",
            "Laki": "La ki",
            "Landmannalaugar": "Land man a loy gar",
            "Kerið": "Ker ith",
            "Geysir": "Gay sir",
            "Strokkur": "Strok kur",
            "Kerlingarfjöll": "Ker ling ar fyutl",
            "Stórurð": "Stow urth",
            "Námaskarð": "Now ma skarth",
            "Hverfjall": "Kver fyatl",
            "Krafla": "Kraf la",
            "Saxhóll": "Sax howl",
            "Berserkjahraun": "Ber serk ya hroyn",
            "Kirkjufell": "Kirk yu fetl",
            "Almannagjá": "Al man na gyow",
            "Rauðfeldsgjá": "Roy felds gyow",
            
            # Accommodations, towns, and specific locations
            "Laugavegur": "Loy ga ve gur",
            "Álfaborg": "Owl fa borg",
            "Skólavörðustígur": "Sko la vur thu stee gur",
            "Harpa": "Har pa",
            "Hallgrímskirkja": "Hat lgreems kirk ya",
            "Friðheimar": "Frith hey mar",
            "Langhús": "Lang hoos",
            "Ásgeirsstaðir": "Ows gayrs sta thir",
            "Arnarstapi": "Ar nar sta pi",
            "Hellnar": "Het nar",
            "Hafnarhólmi": "Haf nar howl mi",
            "Búðakirkja": "Boo tha kirk ya",
            "Gerðuberg": "Gerth u berg",
            "Stokksnes": "Stoks nes",
            "Vestrahorn": "Ves tra horn",
            "Lindarbakki": "Lin dar bak ki",
            "Grettislaug": "Gret tis loyg",
            "Grafarkirkja": "Graf ar kirk ya",
            "Víðimýri": "Vee thi meer i",
            "Skaftárstofa": "Skaf tour sto fa",
            "Norðurfoss": "Nor thur foss",
            "The Barn": "The Barn",
            "Brúnavík": "Broo na veek"
        }

        # Replace Icelandic place names with their phonetic equivalents
        for original, phonetic in icelandic_replacements.items():
            # Use word boundaries to avoid partial replacements
            text = text.replace(original, phonetic)

        return text

    def generate_audio(self, section_index: int) -> Tuple[str, Dict]:
        """Generate audio for a specific section using Deepgram REST API directly.

        Args:
            section_index: Index of the section in the config file

        Returns:
            Tuple of (output_file_path, section_metadata)
        """
        if section_index >= len(self.config["sections"]):
            raise ValueError(f"Section index {section_index} out of range")

        section = self.config["sections"][section_index]
        section_file = self.tour_dir / section["file"]

        if not section_file.exists():
            raise FileNotFoundError(f"Section file not found: {section_file}")

        # Read section text
        with open(section_file, "r", encoding="utf-8") as f:
            original_text = f.read()

        # Preprocess text for better Icelandic pronunciation
        processed_text = self.preprocess_icelandic_text(original_text)

        # Generate a unique filename
        output_filename = f"{self.config['name'].replace(' ', '_')}_{section_index+1}_{section['title'].replace(' ', '_')}.mp3"
        output_path = self.output_dir / output_filename

        # Generate the parameters for the API call
        # Check for section-specific voice, fall back to default
        voice = section.get("voice", self.config.get("voice", "aura-asteria-en"))
        
        # Set up the API URL with the model parameter
        url = f"{self.api_url}?model={voice}"
        
        # Set up the headers
        headers = {
            "Authorization": f"Token {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Set up the data payload
        data = {
            "text": processed_text
        }

        try:
            # Make the API call
            response = requests.post(url, headers=headers, json=data)
            
            # Check for errors
            response.raise_for_status()
            
            # Save the audio file
            with open(output_path, "wb") as f:
                f.write(response.content)

            print(f"Generated audio: {output_path}")

            # Prepare geofence metadata
            geofence_data = {
                "id": section_index + 1,
                "title": section["title"],
                "audio_file": str(output_path),
                "location": {
                    "latitude": section["latitude"],
                    "longitude": section["longitude"],
                    "radius": section.get("radius", 500)  # Default 500m radius
                },
                "text": original_text[:100] + "..." if len(original_text) > 100 else original_text
            }

            return str(output_path), geofence_data

        except Exception as e:
            print(f"Error generating audio for section {section_index}: {e}")
            return None, None

    def generate_all(self) -> List[Dict]:
        """Generate audio for all sections in the tour.

        Returns:
            List of geofence data dictionaries
        """
        for idx in range(len(self.config["sections"])):
            output_path, geofence_data = self.generate_audio(idx)
            if geofence_data:
                self.geofence_data.append(geofence_data)

            # Add a delay to avoid hitting API rate limits
            time.sleep(1)

        # Save geofence data to a JSON file
        geofence_output = self.output_dir / "geofence_data.json"
        with open(geofence_output, "w", encoding="utf-8") as f:
            json.dump({
                "tour_name": self.config["name"],
                "sections": self.geofence_data
            }, f, indent=2)

        print(f"Geofence data saved to: {geofence_output}")

        return self.geofence_data

    def generate_geojson(self) -> None:
        """Generate a GeoJSON file for visualization of the tour points."""
        try:
            import geojson
            
            features = []
            for section in self.geofence_data:
                location = section["location"]
                feature = geojson.Feature(
                    geometry=geojson.Point((location["longitude"], location["latitude"])),
                    properties={
                        "id": section["id"],
                        "title": section["title"],
                        "radius": location["radius"],
                        "audio_file": section["audio_file"]
                    }
                )
                features.append(feature)

            feature_collection = geojson.FeatureCollection(features)

            geojson_output = self.output_dir / "tour_points.geojson"
            with open(geojson_output, "w", encoding="utf-8") as f:
                geojson.dump(feature_collection, f, indent=2)

            print(f"GeoJSON file saved to: {geojson_output}")
        except ImportError:
            print("GeoJSON package not installed. Skipping GeoJSON generation.")
            print("Install with: pip install geojson")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Generate audio files for an Icelandic tour")
    parser.add_argument("tour_dir", help="Path to the tour directory containing config.json")
    parser.add_argument("-o", "--output-dir", help="Output directory for audio files")

    args = parser.parse_args()

    try:
        generator = IcelandicTourGenerator(args.tour_dir, args.output_dir)
        generator.generate_all()
        generator.generate_geojson()
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    print("Tour audio generation complete!")


if __name__ == "__main__":
    main()