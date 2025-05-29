Adept and Yield Optimizing System: Web based App for Appliance Repair Services (AYOS) 

TUP-M
BSIS 4A

Ryan Dela Cruz
Marcos Darwin Tulalian
Ralph Gabriel Ayuban
Michael Vincent Martin
********************************************************

🚀 How to Run and Deploy This Web App

This guide will help you run and deploy the SOYA web application both locally and online.


---

🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

Node.js (v16 or above)

npm (comes with Node.js)

Git (optional, but recommended)



---

📥 Step 1: Clone the Repository

Clone the project from GitHub and navigate into the folder:

git clone https://github.com/komiry/SOYA.git
cd SOYA


---

📦 Step 2: Install Dependencies

Install all required packages using npm:

npm install


---

▶️ Step 3: Run the App Locally (Development)

Start the local development server:

npm run dev

Then open your browser and go to:

http://localhost:5173

> If this port is already in use, Vite will suggest a different one.

---

📄 Environment Variables

 # Admin Panel Credentials
ADMIN_EMAIL = "ayos@example.com"
ADMIN_PASSWORD = "ayos"

# MongoDB Setup ( required )
MONGODB_URI = mongodb+srv://komiry:OVeiQ8apr8h8jyxW@cluster0.mjiuy.mongodb.net

# Cloudinary Setup ( required )
CLOUDINARY_NAME = dv5eqfwex
CLOUDINARY_API_KEY = 245163917592112
CLOUDINARY_SECRET_KEY = ozDnaUS3a7e96p4zKyF3KcDxwec
