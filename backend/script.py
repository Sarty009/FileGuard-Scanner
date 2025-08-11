import os
import smtplib
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get credentials securely
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
EMAIL_SENDER = os.getenv("EMAIL_SENDER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Check if credentials loaded
if not all([SMTP_SERVER, SMTP_PORT, EMAIL_SENDER, EMAIL_PASSWORD]):
    print("Error: Missing SMTP credentials. Check your .env file.")
else:
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        print("✅ SMTP Connection Successful!")
        server.quit()
    except Exception as e:
        print(f"SMTP Error: {e}")
