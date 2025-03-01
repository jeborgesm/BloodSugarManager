import sys
import os
from werkzeug.middleware.dispatcher import DispatcherMiddleware

# Add your project directory to the sys.path
project_home = '/home/jeborgesm/BloodSugarManager'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set the environment variable for the Flask app
os.environ['FLASK_APP'] = 'app.py'

# Import your Flask app
from app import app as application

# Import proxy app
from proxy import app as proxy_application

# Mount the proxy app under /api
application.wsgi_app = DispatcherMiddleware(application.wsgi_app, {
    '/api': proxy_application.wsgi_app
})