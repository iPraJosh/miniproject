📘 Project Setup Guide
🧩 Prerequisites

Make sure you have the following installed:

Node.js (v18 or later) – Download here

npm (comes with Node)

⚙️ 1. Clone the Repository
    git clone https://github.com/iPraJosh/miniproject.git
    cd miniproject

📦 2. Install Dependencies
    npm install


This installs all the libraries used in the project (React, Vite, Supabase, etc.)

🔑 3. Environment Variables

    The project uses Supabase for database storage and API.
    These credentials are not committed to GitHub for security reasons.

Create a new file named .env in the project root and add the following:

    VITE_SUPABASE_URL=your-supabase-url-here
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here


💡 Tip: You can refer to the provided .env.example file to know what variables are required.

If you have your own Supabase project:

Go to Supabase Dashboard → Project Settings → API

Copy the Project URL and anon public key

Paste them into your .env file

🚀 4. Run the Project Locally
    npm run dev


You’ll see an output like:

    VITE v5.0.0  ready in 400ms
    ➜  Local:   http://localhost:5173/


Open that URL in your browser to view the site.

🧱 5. Build for Production (optional)

To generate optimized files for deployment:

npm run build


This will create a dist/ folder with the production-ready build.

🧰 6. Notes

.env is excluded from GitHub for security (see .gitignore)

You may use the provided .env.example to understand required variables

Supabase tables required:

employees

devices

👨‍💻 Author

Praveen Joshua
GitHub: @iPraJosh