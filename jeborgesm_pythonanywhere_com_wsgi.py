import sys
import os

# Add your project directory to the sys.path
project_home = '/home/jeborgesm/BloodSugarManager'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set the environment variable for the Flask app
os.environ['FLASK_APP'] = 'app.py'

# Import your Flask app
from app import app as application