# Iceland Trip Planner Link Checker

A Python utility to check, fix, and add links in JSON files for the Iceland Trip Planner.

## Features

- Checks for broken links in JSON files that match the provided schema
- Attempts to fix broken links using various strategies (removing /en, adding www, etc.)
- Can search for replacement links using DuckDuckGo or Google Custom Search API
- Can find and add links for items missing them (excluding "drive to" and "check in at" activities)
- Can remove links from "drive to" and "check in at" activities
- Generates detailed reports of broken, fixed, and removed links
- Supports exporting results to CSV

## Installation

1. Clone the repository or download the script
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Basic Usage

```bash
python link_checker.py /path/to/json/files
```

This will check all JSON files in the specified directory, attempt to fix broken links, and save the updated files.

## Command Line Options

| Option | Description |
|--------|-------------|
| `directory` | Directory containing JSON files to process (required) |
| `--no-fix` | Do not fix broken links, only report them |
| `--search-missing` | Search for and add links to items missing them (excludes "drive to" and "check in at" activities) |
| `--remove-excluded` | Remove links from activities that start with "drive to" or "check in at" |
| `--google-api-key KEY` | Google Custom Search API Key (optional) |
| `--google-cse-id ID` | Google Custom Search Engine ID (optional) |
| `--rate-limit SECONDS` | Seconds to wait between processing files (default: 2) |
| `--output FILE` | Export report to CSV file |

## Examples

### Check and Report Broken Links (Without Fixing)

```bash
python link_checker.py /path/to/json/files --no-fix
```

### Fix Broken Links and Search for Missing Links

```bash
python link_checker.py /path/to/json/files --search-missing
```

### Remove Links from Drive and Check-in Activities

```bash
python link_checker.py /path/to/json/files --remove-excluded
```

### Fix Broken Links and Remove Links from Excluded Activities

```bash
python link_checker.py /path/to/json/files --search-missing --remove-excluded
```

### Use Google Search API for Better Results

```bash
python link_checker.py /path/to/json/files --google-api-key YOUR_API_KEY --google-cse-id YOUR_CSE_ID
```

### Export Results to CSV

```bash
python link_checker.py /path/to/json/files --output report.csv
```

## Activity Exclusions

The script automatically excludes certain activities from link addition:

- Activities with titles starting with "drive to" (case insensitive)
- Activities with titles starting with "check in at" (case insensitive)

When the `--remove-excluded` flag is used, existing links will be removed from these activities.

## Output

The script will display a formatted report in the console:

- List of broken links that could not be fixed
- List of links that were fixed or added
- List of links that were removed from excluded activities
- Summary statistics

If the `--output` option is specified, this information will also be exported to a CSV file.