from src.utils.utils import logger
from src.scrapers.banks import AxisBankScraper, ICICIBankScraper, SBIBankScraper
from src.scrapers.sites import CardInsiderScraper

def run_bank_scrapers(bank_names):
    """
    Run scrapers for the specified banks.
    
    Args:
        bank_names (list): List of bank names to scrape (e.g., ['axis', 'sbi', 'icici'])
    """
    logger.info("Starting credit card scraping process...")
    
    # Map bank names to their respective scrapers
    bank_scrapers = {
        'axis': AxisBankScraper,
        'sbi': SBIBankScraper,
        'icici': ICICIBankScraper
    }
    # Run bank-specific scrapers
    for bank in bank_names:
        bank = bank.lower()
        if bank in bank_scrapers:
            logger.info(f"Running scraper for {bank.upper()} Bank...")
            try:
                scraper = bank_scrapers[bank]()
                scraper.scrape()
                logger.info(f"✅ Successfully completed scraping for {bank.upper()} Bank")
            except Exception as e:
                logger.error(f"❌ Error scraping {bank.upper()} Bank: {str(e)}")
        else:
            logger.warning(f"⚠️ No scraper found for {bank.upper()} Bank")
    
    logger.info("✅✅ Credit card scraping process completed for all the banks!")


def run_site_scrapers(site_names):
    """
    Run scrapers for the specified sites.
    
    Args:
        site_names (list): List of site names to scrape (e.g., ['cardinsider'])
    """
    
    # Map site names to their respective scrapers
    site_scrapers = {
        'cardinsider': CardInsiderScraper
    }

    for site in site_names:
        site = site.lower()
        if site in site_scrapers:
            if site == 'cardinsider':
                # Run CardInsider scraper for all banks
                logger.info("Running CardInsider scraper...")
                bank_names = ['axis', 'sbi', 'icici']
                try:
                    card_insider = CardInsiderScraper()
                    card_insider.scrape(bank_names)
                    logger.info("Successfully completed CardInsider scraping")
                except Exception as e:
                    logger.error(f"Error in CardInsider scraping: {str(e)}")    

    logger.info("✅✅ Site scraping process completed!")


if __name__ == "__main__":
    # List of banks to scrape
    # banks_to_scrape = ['axis', 'sbi', 'icici']
    # run_bank_scrapers(banks_to_scrape)

    # List of sites to scrape
    sites_to_scrape = ['cardinsider']
    run_site_scrapers(sites_to_scrape)