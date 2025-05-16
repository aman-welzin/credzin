from pycode.src.utils.utils import logger
from pycode.src.scrapers.banks import AxisBankScraper, ICICIBankScraper, SBIBankScraper
from pycode.src.scrapers.sites import CardInsiderScraper

def run_scrapers(bank_names):
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
                logger.info(f"Successfully completed scraping for {bank.upper()} Bank")
            except Exception as e:
                logger.error(f"Error scraping {bank.upper()} Bank: {str(e)}")
        else:
            logger.warning(f"No scraper found for {bank.upper()} Bank")
    
    # Run CardInsider scraper for all banks
    logger.info("Running CardInsider scraper...")
    try:
        card_insider = CardInsiderScraper()
        card_insider.scrape(bank_names)
        logger.info("Successfully completed CardInsider scraping")
    except Exception as e:
        logger.error(f"Error in CardInsider scraping: {str(e)}")
    
    logger.info("Credit card scraping process completed!")

if __name__ == "__main__":
    # List of banks to scrape
    banks_to_scrape = ['axis', 'sbi', 'icici']
    run_scrapers(banks_to_scrape)
