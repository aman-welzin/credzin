from pycode.src.utils.utils import logger
import csv
import requests
from bs4 import BeautifulSoup
import os

class SBIBankScraper:
    def __init__(self):
        self.CSV_FILE = '/Users/aman/Welzin/Dev/credzin/output/sbi_bank_credit_cards.csv'
        self.MAIN_URL = "https://www.sbicard.com/en/personal/credit-cards.page#all-card-tab"

    def get_existing_card_names(self):
        if not os.path.exists(self.CSV_FILE):
            return set()  # Return empty set if file doesn't exist

        existing_cards = set()
        with open(self.CSV_FILE, mode="r", encoding="utf-8") as file:
            reader = csv.reader(file)
            next(reader, None)  # Skip header
            for row in reader:
                if row:
                    existing_cards.add(row[0])  # Card Name is the first column
        return existing_cards

    def extract_features(self, learn_more_url):
        response = requests.get(learn_more_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            tab_content_section = soup.find('section', class_='tab-content')
            if tab_content_section:
                tab_content = tab_content_section.find('div', class_='tab-inner-content', id='feature-1-tab')
                if tab_content:
                    features = {}
                    for feature in tab_content.find_all('li'):
                        heading = feature.find('h3')
                        if heading:
                            feature_name = heading.text.strip()
                            feature_details = [detail.text.strip() for detail in feature.find_all('li')]
                            features[feature_name] = feature_details
                    return features
        return None

    def extract_fees(self, learn_more_url):
        response = requests.get(learn_more_url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            fees_section = soup.find('div', class_='tab-inner-content', id='feature-2-tab')
            if fees_section:
                fees = {}
                fees_list = fees_section.find('h3', string="Fees")
                if fees_list:
                    fee_items = fees_list.find_next('ul')
                    if fee_items:
                        fee_details = [li.get_text(strip=True) for li in fee_items.find_all('li')]
                        fees["Fees"] = fee_details
                return fees
        return None

    def scrape(self):
        # Send a GET request to the main webpage
        response = requests.get(self.MAIN_URL)

        # Check if the request was successful
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            card_containers = soup.find_all('div', class_='grid col-2')

            # Load existing cards
            existing_cards = self.get_existing_card_names()

            # Open CSV file in append mode
            with open(self.CSV_FILE, mode="a", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)

                # Write header only if file is empty
                if os.stat(self.CSV_FILE).st_size == 0:
                    writer.writerow(["Card Name", "Benefits", "Features", "Fees", "Learn More URL", "Apply Now URL", "Front Image URL", "Back Image URL"])

                # Loop through each card container
                for container in card_containers:
                    card_name = container.find_next('h4').text.strip()

                    # Skip if already added
                    if card_name in existing_cards:
                        logger.info(f"⚠️ Skipping {card_name} (Already in CSV)")
                        continue

                    learn_more_link = container.find_next('a', class_='learn-more-link')['href']
                    learn_more_url = f"https://www.sbicard.com{learn_more_link}" if not learn_more_link.startswith('http') else learn_more_link

                    # Extract Apply Now URL
                    apply_now_tag = container.find('div', class_='item-footer')
                    apply_now_url = "N/A"
                    if apply_now_tag:
                        apply_link = apply_now_tag.find('a', class_='button primary')
                        if apply_link and 'href' in apply_link.attrs:
                            apply_now_url = f"https://www.sbicard.com{apply_link['href']}" if not apply_link['href'].startswith('http') else apply_link['href']

                    # Extract Card Images
                    front_image = container.find('picture')
                    front_image1 = front_image.find('source')['srcset'] if front_image else 'N/A'
                    filename, extension = os.path.splitext(os.path.basename(front_image1))

                    # Create the new URL with .png extension
                    new_image_url = os.path.dirname(front_image1) + "/" + filename + ".png"

                    back_image = container.find('div', class_='card-features back').find('img')['src']

                    # Extract Benefits
                    benefits_section = container.find('ul')
                    benefits = [li.get_text(strip=True).replace('Rs.', 'Rs. ') for li in benefits_section.find_all('li')] if benefits_section else []

                    # Extract Features & Fees from "Learn More" page
                    features = self.extract_features(learn_more_url)
                    fees = self.extract_fees(learn_more_url)

                    # Log extracted details for debugging
                    logger.info(f"✅ Adding {card_name}")
                    logger.info(f"Learn More URL: {learn_more_url}")
                    logger.info(f"Apply Now URL: {apply_now_url}")
                    logger.info(f"Front Image URL: {new_image_url}")
                    logger.info(f"Back Image URL: {back_image}")

                    if benefits:
                        logger.info("\n**Benefits**")
                        for benefit in benefits:
                            logger.info(f"  - {benefit}")

                    if features:
                        logger.info("\n**Features**")
                        for feature, details in features.items():
                            logger.info(f"{feature}:")
                            for detail in details:
                                logger.info(f"  - {detail}")

                    if fees and "Fees" in fees:
                        logger.info("\n**Fees**")
                        for detail in fees["Fees"]:
                            logger.info(f"  - {detail}")

                    logger.info("-" * 50)

                    # Write new data to CSV file
                    writer.writerow([
                        card_name,
                        ", ".join(benefits),
                        str(features) if features else "N/A",
                        str(fees["Fees"]) if fees and "Fees" in fees else "N/A",
                        learn_more_url,
                        apply_now_url,
                        new_image_url,
                        back_image
                    ])

            logger.info(f"\n✅ Data successfully saved to {self.CSV_FILE}")

        else:
            logger.error(f"❌ Failed to retrieve the webpage. Status code: {response.status_code}")