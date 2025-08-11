FileGuard Scanner 🛡️

FileGuard Scanner is a full-stack desktop application that provides a secure environment for analyzing files for malware. Users can upload a file, and the application will calculate its hash, check it against the VirusTotal database, and generate a comprehensive PDF report. The application is built with a React frontend and a Python Flask backend, packaged into a standalone Windows executable using Electron.



✨ Features

Secure File Analysis: Upload files to a sandboxed backend for analysis.



VirusTotal Integration: Automatically checks file hashes against the extensive VirusTotal database of over 70 antivirus scanners.



Comprehensive Hashing: Calculates MD5, SHA-256, and SHA-512 hashes for file integrity verification.



Automatic PDF Reporting: Generates a clean, professional PDF report with all analysis details.



Email Delivery: Optionally sends the generated PDF report directly to a specified email address.



Standalone Desktop App: Packaged as a simple .exe file for Windows, requiring no manual installation of servers or dependencies.



📥 Installation for End-Users

To install and run the application without dealing with the source code, follow these simple steps:



Go to the Releases Page of this repository.



Find the latest release (e.g., v1.0.0).



Under the Assets section, click on FileGuard.Scanner.Setup.1.0.0.exe to download the installer.



Once downloaded, run the installer and follow the on-screen instructions. The application will be installed on your computer and ready to use!



💻 Tech Stack

The application is built with a modern and robust technology stack:



Frontend:



React with TypeScript



Vite for fast development and bundling



Tailwind CSS for styling



Shadcn/ui for UI components



Axios for API communication



Backend:



Python with Flask for the web server



PyInstaller to package the backend into an executable



FPDF for PDF report generation



Desktop Wrapper:



Electron to create the cross-platform desktop application



Electron Builder to package the final .exe installer



🚀 Getting Started (For Developers)

To set up and run this project for development purposes, follow these steps.



Prerequisites

Node.js (which includes npm)



Python



Bun (optional, but recommended for frontend)



Backend Setup

Navigate to the backend directory:



cd backend



Create and activate a virtual environment:



python -m venv venv

.\\venv\\Scripts\\activate



Install Python dependencies:



pip install -r requirements.txt



Create a .env file in the backend directory and add your API keys:



VIRUSTOTAL\_API\_KEY="YOUR\_VIRUSTOTAL\_KEY"

SMTP\_SERVER="smtp.example.com"

SMTP\_PORT=587

EMAIL\_SENDER="your-email@example.com"

EMAIL\_PASSWORD="your-email-password"



Run the backend server:



python app.py



Frontend Setup

Navigate to the frontend directory:



cd frontend



Install frontend dependencies:



bun install

\# OR

npm install



Run the frontend development server:



bun run dev

\# OR

npm run dev



Building the Executable

To build the final .exe file, refer to the detailed instructions provided in the development process. The main steps are:



Build the frontend (bun run build).



Package the backend (python -m PyInstaller ...).



Package the Electron app (npm run dist).



Acknowledgements

A special thanks for the guidance and support provided throughout the development and debugging process of this complex application.

