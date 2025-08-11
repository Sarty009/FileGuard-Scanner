import os
import sys
import hashlib
import logging
import requests
import smtplib
import time
from flask import Flask, request, jsonify, send_from_directory
from fpdf import FPDF
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from flask_cors import CORS
from werkzeug.utils import secure_filename

# --- Dynamic Path Configuration (The Key Fix) ---
# Determine if the app is running as a bundled executable
if getattr(sys, 'frozen', False):
    # If bundled, the base path is the directory of the executable
    base_path = os.path.dirname(sys.executable)
    # The _MEIPASS attribute contains the path to the temp folder where PyInstaller unpacks data
    # We use this to find the .env file if it was bundled.
    dotenv_path = os.path.join(sys._MEIPASS, '.env')
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path=dotenv_path)
else:
    # If running as a script, the base path is the script's directory
    base_path = os.path.dirname(os.path.abspath(__file__))
    load_dotenv() # Loads .env from the current directory

# --- Configuration and Initialization ---
VIRUSTOTAL_API_KEY = os.getenv('VIRUSTOTAL_API_KEY')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
EMAIL_SENDER = os.getenv('EMAIL_SENDER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

# Setup Flask App
app = Flask(__name__)
CORS(app)

# Use a 'reports' directory in the same folder as the executable
REPORTS_DIRECTORY = os.path.join(base_path, 'reports')
os.makedirs(REPORTS_DIRECTORY, exist_ok=True)

# Setup logging in the same folder as the executable
log_file_path = os.path.join(base_path, 'sandbox_analysis.log')
logging.basicConfig(
    filename=log_file_path,
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logging.info("Application starting up...")
logging.info(f"Reports will be saved to: {REPORTS_DIRECTORY}")
logging.info(f"Base path is: {base_path}")


# --- PDF Report Generation (No changes) ---
class PDFReport(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Malware Analysis Report', 0, 1, 'C')
        self.ln(10)

    def add_section(self, title, content):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1)
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 8, content)
        self.ln(5)

# --- Helper Functions (No changes) ---
def calculate_hashes(file_path):
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    sha512 = hashlib.sha512()
    try:
        with open(file_path, "rb") as f:
            for block in iter(lambda: f.read(4096), b""):
                md5.update(block)
                sha256.update(block)
                sha512.update(block)
        return md5.hexdigest(), sha256.hexdigest(), sha512.hexdigest()
    except IOError as e:
        logging.error(f"Error reading file for hashing: {e}")
        return None, None, None

def generate_report(file_path, hashes, results):
    report_filename = f"report-{hashes['sha256']}.pdf"
    report_path = os.path.join(REPORTS_DIRECTORY, report_filename)
    pdf = PDFReport()
    pdf.add_page()
    file_info_content = (
        f"Original Filename: {os.path.basename(file_path)}\n"
        f"MD5: {hashes['md5']}\n"
        f"SHA-256: {hashes['sha256']}\n"
        f"SHA-512: {hashes['sha512']}"
    )
    pdf.add_section('File Information', file_info_content)
    results_content = "\n".join([f"{key}: {value}" for key, value in results.items()])
    pdf.add_section('VirusTotal Scan Results', results_content)
    pdf.output(report_path)
    logging.info(f"Generated report: {report_path}")
    return report_path

def send_email_with_report(report_path, recipient_email):
    if not all([SMTP_SERVER, EMAIL_SENDER, EMAIL_PASSWORD]):
        error_msg = "SMTP settings are not configured. Cannot send email."
        logging.error(error_msg)
        return False, error_msg
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_SENDER
        msg['To'] = recipient_email
        msg['Subject'] = "Your Malware Analysis Report is Ready"
        body = "Attached is the malware analysis report for your submitted file."
        msg.attach(MIMEText(body, 'plain'))
        with open(report_path, 'rb') as f:
            part = MIMEApplication(f.read(), Name=os.path.basename(report_path))
        part['Content-Disposition'] = f'attachment; filename="{os.path.basename(report_path)}"'
        msg.attach(part)
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
        logging.info(f"Successfully sent email report to {recipient_email}")
        return True, None
    except Exception as e:
        error_msg = f"An unexpected error occurred while sending email: {e}"
        logging.error(error_msg, exc_info=True)
        return False, str(e)

# --- VirusTotal API Interaction (No changes) ---
def search_virustotal_by_hash(file_hash):
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"
    headers = {"x-apikey": VIRUSTOTAL_API_KEY}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()['data']['attributes']['last_analysis_stats']
        return None
    except requests.RequestException as e:
        logging.error(f"Network error during VirusTotal search: {e}")
        return None

def upload_to_virustotal(file_path):
    url = "https://www.virustotal.com/api/v3/files"
    headers = {"x-apikey": VIRUSTOTAL_API_KEY}
    try:
        with open(file_path, "rb") as f:
            files = {"file": (os.path.basename(file_path), f)}
            response = requests.post(url, headers=headers, files=files)
        if response.status_code == 200:
            return response.json()['data']['id']
        return None
    except (requests.RequestException, IOError) as e:
        logging.error(f"Error during file upload to VirusTotal: {e}")
        return None

def get_virustotal_report(analysis_id, max_wait_seconds=120):
    url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
    headers = {"x-apikey": VIRUSTOTAL_API_KEY}
    start_time = time.time()
    while time.time() - start_time < max_wait_seconds:
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get('data', {}).get('attributes', {}).get('status') == 'completed':
                    return data['data']['attributes']['stats']
                time.sleep(15)
            else:
                return None
        except requests.RequestException as e:
            logging.error(f"Network error while fetching VT report: {e}")
            return None
    return None

# --- Flask Routes ---
@app.route('/scan', methods=['POST'])
def scan_file_route():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    recipient_email = request.form.get('email')
    filename = secure_filename(file.filename)
    # Save uploaded file to the reports directory
    file_path = os.path.join(REPORTS_DIRECTORY, filename)
    file.save(file_path)
    logging.info(f"Received file: {filename}")
    try:
        md5, sha256, sha512 = calculate_hashes(file_path)
        if not sha256:
            return jsonify({"error": "Could not read or hash the file"}), 500
        results = search_virustotal_by_hash(sha256)
        if results is None:
            analysis_id = upload_to_virustotal(file_path)
            if analysis_id:
                results = get_virustotal_report(analysis_id)
        if not results:
            return jsonify({"error": "Could not retrieve scan results from VirusTotal"}), 500
        hashes = {"md5": md5, "sha256": sha256, "sha512": sha512}
        report_path = generate_report(file_path, hashes, results)
        report_filename = os.path.basename(report_path)
        email_sent, email_error = None, None
        if recipient_email:
            email_sent, email_error = send_email_with_report(report_path, recipient_email)
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({
            "success": True, "message": "Scan completed successfully.",
            "hashes": hashes, "results": results,
            "report_url": f"/report/{report_filename}",
            "email_status": {"sent": email_sent, "error": email_error}
        })
    except Exception as e:
        logging.critical(f"An unexpected error occurred during scan: {e}", exc_info=True)
        if os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({"error": "An internal server error occurred."}), 500

@app.route('/report/<path:filename>')
def serve_report_route(filename):
    return send_from_directory(REPORTS_DIRECTORY, secure_filename(filename), as_attachment=True)

# --- Main Execution ---
if __name__ == '__main__':
    logging.info("Starting Flask server.")
    if not VIRUSTOTAL_API_KEY:
        logging.error("FATAL ERROR: VIRUSTOTAL_API_KEY environment variable is not set.")
    app.run(debug=False, port=5000)

