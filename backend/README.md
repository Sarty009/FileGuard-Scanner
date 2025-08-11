# Malware Detection Sandbox

This project is a malware detection sandbox that allows you to scan files using VirusTotal, generate reports, and analyze potential threats. It also includes a sandbox environment to monitor executable file behavior.

## Features
- File scanning using VirusTotal API
- SHA-256 hash calculation for file integrity check
- PDF report generation with scan results
- Sandbox execution for behavior analysis
- GUI for easy file selection and management

## Prerequisites
Make sure you have the following installed:
- Python 3.x
- `requests`
- `fpdf`
- `python-dotenv`
- `tkinter`

Install them using:
```bash
pip install requests fpdf python-dotenv
```

**Note:** `tkinter` may require separate installation on some systems.
- **Linux:** `sudo apt install python3-tk`
- **Windows:** Already included with Python.

## Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/malware-detection-sandbox.git
    cd malware-detection-sandbox
    ```

2. Create a `.env` file for your VirusTotal API key:
    ```bash
    echo "VIRUSTOTAL_API_KEY=your_api_key" > .env
    ```

3. Run the tool:
    ```bash
    python sandbox.py
    ```

## How to Use
1. Launch the application.
2. Click on **Browse File** to select a file for scanning.
3. The tool will calculate the file's SHA-256 hash and check it with VirusTotal.
4. If threats are detected, it will generate a report named `malware_report.pdf`.
5. Executable files can be run in a sandbox for behavior analysis.

## Logs and Reports
- Logs are saved in `sandbox.log`.
- Reports are generated in `malware_report.pdf`.

## Contribution
Feel free to submit issues and pull requests for improvements!

## License
This project is licensed under the MIT License.

