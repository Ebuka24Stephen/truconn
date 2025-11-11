import multiprocessing

# For low-RAM Render instance, use 1 worker
workers = 1

# Use threads to handle concurrent requests without spawning more workers
worker_class = "gthread"
threads = 2  # adjust up if RAM allows

# Max requests per worker before restart (prevents memory leaks)
max_requests = 500
max_requests_jitter = 50

# Timeout in seconds for worker response
timeout = 30

# Bind to port (Render automatically sets PORT env variable)
import os
port = os.environ.get("PORT", "10000")
bind = f"0.0.0.0:{port}"

# Logging to stdout/stderr for Render
accesslog = "-"
errorlog = "-"
loglevel = "info"
