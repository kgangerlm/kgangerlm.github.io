#!/usr/bin/env python3
"""
Link checker and fixer for JSON files matching Iceland trip planner schema.
Checks for broken links, attempts fixes, and can search for missing links.
"""

import json
import os
import requests
import time
import argparse
import sys
import csv
import random
from urllib.parse import urlparse, quote_plus
from typing import Dict, List, Optional, Tuple

# Try to import BeautifulSoup
try:
    from bs4 import BeautifulSoup
except ImportError:
    print("BeautifulSoup is required. Install with: pip install beautifulsoup4")
    sys.exit(1)

# Random user agents to avoid request blocking
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
]

def is_excluded_activity(title: str) -> bool:
    """Check if an activity should be excluded based on its title."""
    if not title:
        return False
    
    title_lower = title.lower()
    return (title_lower.startswith("drive to") or 
            title_lower.startswith("check in at"))

def is_link_broken(url: str) -> bool:
    """Check if a link is broken by making HTTP requests."""
    if not url or url.strip() == '':
        return False  # Empty links aren't broken
    
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    
    try:
        # Try HEAD request first (faster)
        response = requests.head(url, timeout=5, allow_redirects=True, headers=headers)
        
        # If HEAD fails, try GET
        if response.status_code >= 400:
            response = requests.get(url, timeout=5, allow_redirects=True, headers=headers)
            
        return response.status_code >= 400
    except Exception as e:
        print(f"Error checking link {url}: {e}")
        return True  # Exception means broken link

def fix_link(url: str) -> Optional[str]:
    """Try various methods to fix a broken link."""
    if not url or url.strip() == '':
        return None
    
    # Remove trailing /en
    if url.endswith('/en'):
        new_url = url[:-3]
        if not is_link_broken(new_url):
            return new_url
    
    # Remove trailing slash
    if url.endswith('/') and len(url) > 1:
        new_url = url[:-1]
        if not is_link_broken(new_url):
            return new_url
    
    # Try adding www if missing
    parsed_url = urlparse(url)
    if parsed_url.netloc and not parsed_url.netloc.startswith('www.'):
        netloc = 'www.' + parsed_url.netloc
        new_url = parsed_url._replace(netloc=netloc).geturl()
        if not is_link_broken(new_url):
            return new_url
    
    # Try switching between http and https
    if url.startswith('http:'):
        new_url = 'https:' + url[5:]
        if not is_link_broken(new_url):
            return new_url
    elif url.startswith('https:'):
        new_url = 'http:' + url[6:]
        if not is_link_broken(new_url):
            return new_url
    
    # Try removing tracking parameters
    parsed_url = urlparse(url)
    if parsed_url.query:
        new_url = parsed_url._replace(query='').geturl()
        if not is_link_broken(new_url):
            return new_url
    
    return None  # Could not fix the link

def search_duckduckgo(query: str) -> Optional[str]:
    """Search for a link using DuckDuckGo."""
    headers = {"User-Agent": random.choice(USER_AGENTS)}
    
    try:
        # Focus on Icelandic sites first
        encoded_query = quote_plus(f"{query} site:.is")
        response = requests.get(
            f"https://html.duckduckgo.com/html/?q={encoded_query}",
            headers=headers,
            timeout=10
        )
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = soup.select('.result__a')
        
        if results and len(results) > 0:
            href = results[0].get('href')
            if href:
                if href.startswith('/duckduckgo'):
                    parsed = urlparse(href)
                    import urllib.parse as urlparse
                    params = urlparse.parse_qs(parsed.query)
                    if 'uddg' in params:
                        return params['uddg'][0]
                elif href.startswith('http'):
                    return href
        
        # Try again without the site:.is restriction
        encoded_query = quote_plus(query)
        response = requests.get(
            f"https://html.duckduckgo.com/html/?q={encoded_query}",
            headers=headers,
            timeout=10
        )
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = soup.select('.result__a')
        
        if results and len(results) > 0:
            href = results[0].get('href')
            if href:
                if href.startswith('/duckduckgo'):
                    parsed = urlparse(href)
                    import urllib.parse as urlparse
                    params = urlparse.parse_qs(parsed.query)
                    if 'uddg' in params:
                        return params['uddg'][0]
                elif href.startswith('http'):
                    return href
        
        return None
    except Exception as e:
        print(f"Error searching DuckDuckGo: {e}")
        return None

def search_google(query: str, api_key: str, cse_id: str) -> Optional[str]:
    """Search for a link using Google Custom Search API."""
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'key': api_key,
            'cx': cse_id,
            'q': query
        }
        
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        # Check for rate limit
        if response.status_code == 429:
            print("Hit Google API rate limit. Waiting 10 seconds...")
            time.sleep(10)
            response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"Google API error: {response.status_code} - {response.text}")
            return None
        
        data = response.json()
        
        if 'items' in data and len(data['items']) > 0:
            return data['items'][0]['link']
        
        return None
    except Exception as e:
        print(f"Error searching Google: {e}")
        return None

def search_for_link(query: str, google_api_key: Optional[str] = None, 
                   google_cse_id: Optional[str] = None) -> Optional[str]:
    """Search for links using both Google and DuckDuckGo methods."""
    # Try Google first if API key is provided
    if google_api_key and google_cse_id:
        result = search_google(query, google_api_key, google_cse_id)
        if result:
            return result
    
    # Fallback to DuckDuckGo
    return search_duckduckgo(query)

def process_links_in_section(section_name: str, section_data: List[Dict], 
                            day_id: str, day_number: int,
                            fix_links: bool, search_missing: bool,
                            remove_excluded_links: bool,
                            google_api_key: Optional[str], 
                            google_cse_id: Optional[str]) -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """Process all links in a section of a day's data."""
    broken_links = []
    fixed_links = []
    removed_links = []
    
    # If we're only removing excluded links, don't do any other processing
    if remove_excluded_links:
        for item in section_data:
            item_title = item.get('title', '')
            link = item.get('link', '')
            item_prefix = f"{section_name}: " if section_name else ""
            
            # Check if this is an excluded activity with a link
            if is_excluded_activity(item_title) and link:
                removed_links.append({
                    'day': day_number,
                    'day_id': day_id,
                    'activity': f"{item_prefix}{item_title}",
                    'removed_link': link
                })
                # Remove the link
                item.pop('link', None)
        
        return broken_links, fixed_links, removed_links
    
    # Regular link processing (only reached if not remove_excluded_links)
    for item in section_data:
        item_title = item.get('title', '')
        link = item.get('link', '')
        item_prefix = f"{section_name}: " if section_name else ""
        
        # Skip excluded activities for link addition
        if is_excluded_activity(item_title):
            continue
            
        if link and is_link_broken(link):
            fixed_link = None
            if fix_links:
                fixed_link = fix_link(link)
                
                # If we couldn't fix it but have search capability, try searching
                if not fixed_link and (google_api_key or search_missing):
                    search_query = f"{item_title} Iceland travel"
                    fixed_link = search_for_link(search_query, google_api_key, google_cse_id)
            
            if fixed_link:
                fixed_links.append({
                    'day': day_number,
                    'day_id': day_id,
                    'activity': f"{item_prefix}{item_title}",
                    'old_link': link,
                    'new_link': fixed_link
                })
                
                # Update the link in the data
                item['link'] = fixed_link
            else:
                broken_links.append({
                    'day': day_number,
                    'day_id': day_id,
                    'activity': f"{item_prefix}{item_title}",
                    'link': link
                })
        elif search_missing and (not link or link.strip() == ''):
            # Try to add missing links
            search_query = f"{item_title} Iceland travel"
            new_link = search_for_link(search_query, google_api_key, google_cse_id)
            
            if new_link:
                item['link'] = new_link
                fixed_links.append({
                    'day': day_number,
                    'day_id': day_id,
                    'activity': f"{item_prefix}{item_title}",
                    'old_link': None,
                    'new_link': new_link
                })
    
    return broken_links, fixed_links, removed_links

def process_json_files(directory: str, fix_links: bool = True, 
                      search_missing: bool = False, 
                      remove_excluded_links: bool = False,
                      google_api_key: Optional[str] = None, 
                      google_cse_id: Optional[str] = None,
                      rate_limit: int = 2) -> Tuple[List[Dict], List[Dict], List[Dict]]:
    """Process all JSON files in a directory to find and fix broken links."""
    broken_links = []
    fixed_links = []
    removed_links = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    day_id = data.get('id', os.path.splitext(file)[0])
                    day_number = data.get('dayNumber', 0)
                    print(f"Processing Day {day_number} ({day_id})...")
                    
                    day_broken_links = []
                    day_fixed_links = []
                    day_removed_links = []
                    
                    # Check links in schedule
                    if 'schedule' in data:
                        broken, fixed, removed = process_links_in_section(
                            "", data['schedule'], day_id, day_number,
                            fix_links, search_missing, remove_excluded_links,
                            google_api_key, google_cse_id
                        )
                        day_broken_links.extend(broken)
                        day_fixed_links.extend(fixed)
                        day_removed_links.extend(removed)
                    
                    # Check links in alternatives
                    if 'alternatives' in data:
                        broken, fixed, removed = process_links_in_section(
                            "Alternative", data['alternatives'], day_id, day_number,
                            fix_links, search_missing, remove_excluded_links,
                            google_api_key, google_cse_id
                        )
                        day_broken_links.extend(broken)
                        day_fixed_links.extend(fixed)
                        day_removed_links.extend(removed)
                    
                    # Check links in badWeatherAlternatives
                    if 'badWeatherAlternatives' in data:
                        broken, fixed, removed = process_links_in_section(
                            "Bad Weather Alternative", data['badWeatherAlternatives'], day_id, day_number,
                            fix_links, search_missing, remove_excluded_links,
                            google_api_key, google_cse_id
                        )
                        day_broken_links.extend(broken)
                        day_fixed_links.extend(fixed)
                        day_removed_links.extend(removed)
                    
                    broken_links.extend(day_broken_links)
                    fixed_links.extend(day_fixed_links)
                    removed_links.extend(day_removed_links)
                    
                    # Save updated file if we fixed or removed links
                    if (day_fixed_links and fix_links) or (day_removed_links and remove_excluded_links):
                        with open(file_path, 'w', encoding='utf-8') as f:
                            json.dump(data, f, indent=2, ensure_ascii=False)
                        print(f"Updated {file_path} with {len(day_fixed_links)} fixed links and {len(day_removed_links)} removed links")
                    
                    # Rate limiting between files
                    if rate_limit > 0:
                        time.sleep(rate_limit)
                
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    
    return broken_links, fixed_links, removed_links

def print_report(broken_links: List[Dict], fixed_links: List[Dict], removed_links: List[Dict]) -> None:
    """Print a formatted report of broken, fixed, and removed links."""
    # Sort all lists by day number
    broken_links.sort(key=lambda x: (x['day'], x['activity']))
    fixed_links.sort(key=lambda x: (x['day'], x['activity']))
    removed_links.sort(key=lambda x: (x['day'], x['activity']))
    
    # Print broken links
    if broken_links:
        print("\n=== BROKEN LINKS ===")
        print(f"{'Day':^5} | {'Activity':<40} | {'Link':<60}")
        print("-" * 110)
        for item in broken_links:
            day = f"Day {item['day']}"
            link_display = item['link'][:57] + "..." if len(item['link']) > 60 else item['link']
            print(f"{day:^5} | {item['activity']:<40} | {link_display:<60}")
    else:
        print("\nNo broken links found!")
    
    # Print fixed links
    if fixed_links:
        print("\n=== FIXED LINKS ===")
        print(f"{'Day':^5} | {'Activity':<40} | {'Status':<15} | {'New Link':<60}")
        print("-" * 125)
        for item in fixed_links:
            day = f"Day {item['day']}"
            status = "Added new" if not item['old_link'] else "Fixed"
            link_display = item['new_link'][:57] + "..." if len(item['new_link']) > 60 else item['new_link']
            print(f"{day:^5} | {item['activity']:<40} | {status:<15} | {link_display:<60}")
    else:
        print("\nNo links were fixed or added.")
        
    # Print removed links
    if removed_links:
        print("\n=== REMOVED LINKS ===")
        print(f"{'Day':^5} | {'Activity':<40} | {'Removed Link':<60}")
        print("-" * 110)
        for item in removed_links:
            day = f"Day {item['day']}"
            link_display = item['removed_link'][:57] + "..." if len(item['removed_link']) > 60 else item['removed_link']
            print(f"{day:^5} | {item['activity']:<40} | {link_display:<60}")
    else:
        print("\nNo links were removed.")

    # Print summary
    print("\n=== SUMMARY ===")
    print(f"Total broken links found: {len(broken_links)}")
    print(f"Total links fixed: {len([link for link in fixed_links if link['old_link']])}")
    print(f"Total new links added: {len([link for link in fixed_links if not link['old_link']])}")
    print(f"Total links removed: {len(removed_links)}")

def export_report_to_csv(broken_links: List[Dict], fixed_links: List[Dict], 
                        removed_links: List[Dict], output_file: str) -> None:
    """Export the report to a CSV file."""
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        csv_writer = csv.writer(csvfile)
        
        # Write broken links
        if broken_links:
            csv_writer.writerow(['TYPE', 'Day', 'Activity', 'Link'])
            for item in broken_links:
                csv_writer.writerow(['BROKEN', f"Day {item['day']}", item['activity'], item['link']])
        
        # Add a blank row between sections
        if (broken_links and fixed_links) or (broken_links and removed_links):
            csv_writer.writerow([])
        
        # Write fixed links
        if fixed_links:
            csv_writer.writerow(['TYPE', 'Day', 'Activity', 'Status', 'Old Link', 'New Link'])
            for item in fixed_links:
                status = "Added new" if not item['old_link'] else "Fixed"
                old_link = item['old_link'] if item['old_link'] else "N/A"
                csv_writer.writerow(['FIXED', f"Day {item['day']}", item['activity'], status, old_link, item['new_link']])
        
        # Add a blank row between sections
        if fixed_links and removed_links:
            csv_writer.writerow([])
            
        # Write removed links
        if removed_links:
            csv_writer.writerow(['TYPE', 'Day', 'Activity', 'Removed Link'])
            for item in removed_links:
                csv_writer.writerow(['REMOVED', f"Day {item['day']}", item['activity'], item['removed_link']])
    
    print(f"\nReport exported to {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Check and fix broken links in JSON files.')
    parser.add_argument('directory', help='Directory containing JSON files to process')
    parser.add_argument('--no-fix', action='store_true', help='Do not fix broken links, only report them')
    parser.add_argument('--search-missing', action='store_true', help='Search for and add links to items missing them')
    parser.add_argument('--remove-excluded', action='store_true', 
                       help='Remove links from activities that start with "drive to" or "check in at"')
    parser.add_argument('--google-api-key', help='Google Custom Search API Key (optional)')
    parser.add_argument('--google-cse-id', help='Google Custom Search Engine ID (optional)')
    parser.add_argument('--rate-limit', type=int, default=2, help='Seconds to wait between processing files (default: 2)')
    parser.add_argument('--output', help='Export report to CSV file')
    
    args = parser.parse_args()
    
    if not os.path.isdir(args.directory):
        print(f"Error: {args.directory} is not a valid directory")
        sys.exit(1)
    
    print(f"Processing JSON files in {args.directory}...")
    
    # If remove_excluded is set, ignore other flags
    if args.remove_excluded:
        print("Running in 'remove excluded links' mode only.")
        args.no_fix = True  # Don't fix links
        args.search_missing = False  # Don't search for missing links
        args.google_api_key = None  # Don't use Google API
        args.google_cse_id = None  # Don't use Google CSE
    else:
        # Check if both Google API parameters are provided
        if (args.google_api_key and not args.google_cse_id) or (not args.google_api_key and args.google_cse_id):
            print("Warning: Both --google-api-key and --google-cse-id must be provided to use Google Search")
            args.google_api_key = None
            args.google_cse_id = None
    
    broken_links, fixed_links, removed_links = process_json_files(
        args.directory,
        fix_links=not args.no_fix,
        search_missing=args.search_missing,
        remove_excluded_links=args.remove_excluded,
        google_api_key=args.google_api_key,
        google_cse_id=args.google_cse_id,
        rate_limit=args.rate_limit
    )
    
    # Adjust report based on mode
    if args.remove_excluded:
        # Only show removed links if in remove_excluded mode
        print_report([], [], removed_links)
        if args.output:
            export_report_to_csv([], [], removed_links, args.output)
    else:
        # Show all results in normal mode
        print_report(broken_links, fixed_links, removed_links)
        if args.output:
            export_report_to_csv(broken_links, fixed_links, removed_links, args.output)

if __name__ == "__main__":
    main()