intern-training-jun-2024-as

# creating a virtual environment
python -m venv .venv


# activating the virtual environment
source .venv/bin/activate

uvicorn command to run fastAPI server: uvicorn main:app --reload

stopping a process on a port: lsof -ti:8000

# signing into vault: 
vault login -method=oidc