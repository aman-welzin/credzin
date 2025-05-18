from agno.agent import Agent
from agno.models.ollama import Ollama
from agno.tools.duckduckgo import DuckDuckGoTools

import json
import pandas as pd
import os    
import pprint

agent = Agent(
    name = "Card Agent",
    model=Ollama(id="llama3.2"),
    tools=[DuckDuckGoTools()],
    description="You are a credit card data scraping expert. You analyze credit cards and extract detailed information about the card features and benefits.",
    instructions=[
        '''
        	1.	Role Assignment:
                You are a professional agent specializing in gathering detailed information about Indian credit cards.
            
            2.	Task Overview:
                Given a specific bank and credit card name, perform the following tasks:
            •	Use web search to find the top 10 relevant and up-to-date links about the specified credit card.
            •	From each working link, extract pertinent information, including fees, benefits, features, card image URLs, and offers.
            •	Consolidate all descriptions from the gathered links into a comprehensive and detailed credit card description.
            •	Summarize the findings into a clean, structured JSON object.
            
            3.	Data Fields to Capture:
                Ensure the JSON object includes the following fields in the specified order:
            •	bank_name: Name of the issuing bank.
            •	card_name: Official name of the credit card.
            •	card_image: URL linking to an image of the credit card.
            •	joining_fee: Fee charged upon card issuance.
            •	annual_fee: Yearly maintenance fee for the card.
            •	annual_fee_waiver: Conditions under which the annual fee is waived.
            •	add_on_card_fee: Fee for issuing supplementary cards.
            •	interest_rate_pa: Annual interest rate on outstanding balances.
            •	card_type: Type of card (e.g., ‘retail card’, ‘co-branded card’, ‘lifestyle card’).
            •	card_category: Categories the card falls under (e.g., [‘fuel’, ‘shopping’, ‘travel’, ‘rewards’]).
            •	card_usp: Unique selling proposition of the card.
            •	movie_offer: Details of movie-related offers.
            •	fuel_offer: Information on fuel-related offers.
            •	culinary_treats: Special dining experiences or exclusive culinary offers.
            •	airport_lounge_access: Access details to airport lounges.
            •	reward_points: Reward points system and earning rates.
            •	returns_rate: Percentage return value of reward points or cashback.
            •	rewards: List of rewards or benefits associated with the card.
            •	features: Summary of the card’s features and benefits.
            •	know_more_link: URL directing to the official page with more details.
            •	apply_now_link: URL to apply for the credit card online.
            •	image_url: Alternative or additional URL pointing to the card’s image.
            •	welcome_benefit: Benefits offered upon joining.
            •	milestone_benefit: Benefits awarded upon reaching specific spending milestones.
            •	lounge_access: Details on airport lounge access.
            •	fuel_benefit: Benefits or discounts on fuel purchases.
            •	dining_offer: Discounts or offers at restaurants.
            •	travel_offer: Travel-related benefits like flight discounts or hotel deals.
            •	international_use: Usability for international transactions.
            •	insurance: Insurance coverage provided.
            •	welcome_points: Bonus points awarded upon joining.
            •	milestone_rewards: Rewards given upon reaching spending milestones.
            •	bonus_points: Additional points awarded under certain conditions.
            •	cashback_offer: Cashback offers on purchases.
            •	voucher_offer: Voucher-based offers provided.
            •	travel_rewards: Travel-related rewards.
            •	fuel_rewards: Rewards for fuel purchases.
            •	movie_rewards: Rewards related to movie ticket purchases.
            •	full_card_description: Comprehensive description encompassing all features, benefits, and terms of the card ensuring no important information is omitted..
            
            4.	Formatting Guidelines:
            •	The output must be a valid JSON object, starting with { and ending with }.
            •	All string values should be enclosed in double quotes.
            •	Do not include any markdown formatting, code blocks, or explanatory text.
            •	If a particular field is not available, set its value to "NA".
            •   Just give the JSON object without any additional text or explanation.
            '''],

    markdown=True,
    show_tool_calls=True,
    add_datetime_to_instructions=True,
    debug_mode=True,
)

#credit_card_names = ['Axis Bank Magnus Credit Card', 'Indian Oil Axis Bank Credit Card']
credit_card_names = ['Indian Oil Axis Bank Credit Card', 'Rewards Credit Card', 'Axis Bank Magnus Credit Card', 'Axis Bank Privilege Credit Card', 'Flipkart Axis BankCredit Card', 'Axis Bank MY ZoneCredit Card', 'Axis Bank NeoCredit Card', 'Axis Bank SelectCredit Card', 'Axis Bank AtlasCredit Card', 'Axis Bank AURACredit Card', 'IndianOil Axis Bank PremiumCredit Card', 'Axis Bank ACECredit Card', 'Axis Bank Pride PlatinumCredit Card', 'Axis Bank Pride SignatureCredit Card', 'Axis Bank MY Zone EasyCredit Card', 'Privilege EasyCredit Card', 'Axis Bank Signature Credit Card with Lifestyle Benefits', 'PlatinumCredit Card', 'Titanium Smart TravelerCredit Card', 'Axis Bank My WingsCredit Card', 'Flipkart Axis Bank Super EliteCredit Card', 'HORIZONCredit Card', 'SpiceJet Axis Bank Voyage BlackCredit Card', 'Axis Bank ReserveCredit Card', 'Samsung Axis Bank InfiniteCredit Card', 'Fibe Axis BankCredit Card', 'Axis Bank Shoppers StopCredit Card', 'SpiceJet Axis Bank VoyageCredit Card', 'Airtel Axis BankCredit Card', 'Samsung Axis Bank SignatureCredit Card', 'Miles and More Axis BankCredit Card', 'Axis Bank FreechargeCredit Card', 'Axis Bank Freecharge PlusCredit Card', 'LIC Axis Bank SignatureCredit Card', 'LIC Axis Bank PlatinumCredit Card', 'CashbackCredit Card', 'Axis Bank VistaraCredit Card', 'Axis Bank Vistara Signature Credit Card', 'Axis Bank Vistara Infinite Credit Card']
output_file = '/Users/aman/Welzin/dev/credzin/output/banks/axis/axis_credit_cards.csv'

for idx, card_name in enumerate(credit_card_names):
    #print(f"\n--- Report for {card_name} ---\n")
    #agent.print_response(card_name, stream=True)
    #print("\n--- End of Report ---\n")

    cards_string = agent.run(card_name, stream=False)
    #print('cards_string: ' + pprint.pformat(cards_string))
  
    cards_string_content = cards_string.content.strip()
    print('cards_string_content: ' + pprint.pformat(cards_string_content))

    # Assuming 'cards_string.content' contains the JSON string
    json_str = cards_string_content
    try:
        cards_data = json.loads(json_str, strict=False)
        df = pd.DataFrame([cards_data])  # Wrap in a list to create a DataFrame with one row
        
        # Append the DataFrame to the CSV file
        write_header = not os.path.exists(output_file) or idx == 0
        df.to_csv(output_file, mode='a', index=False, header=write_header)
        print(f"Data for '{card_name}' appended successfully.")

    except json.JSONDecodeError as e:
        print(f"JSON decoding failed: {e}")