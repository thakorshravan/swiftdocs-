import os
import time
import threading
import logging

logger = logging.getLogger("SwiftDocsCleaner")

def cleanup_directory(directory_path, max_age_seconds=3600):
    """
    Remove files in directory_path that are older than max_age_seconds (default 1 hour).
    """
    if not os.path.exists(directory_path):
        return

    now = time.time()
    deleted_count = 0

    for root, dirs, files in os.walk(directory_path):
        for f in files:
            file_path = os.path.join(root, f)
            try:
                stat = os.stat(file_path)
                if now - stat.st_mtime > max_age_seconds:
                    os.remove(file_path)
                    deleted_count += 1
            except Exception as e:
                logger.error(f"Error removing expired file {file_path}: {e}")

    if deleted_count > 0:
        logger.info(f"Cleaned up {deleted_count} expired files from {directory_path}")

def start_cleaner_thread(directories, interval_seconds=600, max_age_seconds=3600):
    """
    Start background daemon thread that sweeps temporary files every interval_seconds.
    """
    def run_cleanup_loop():
        while True:
            try:
                for d in directories:
                    cleanup_directory(d, max_age_seconds)
            except Exception as e:
                logger.error(f"Cleaner thread exception: {e}")
            time.sleep(interval_seconds)

    cleaner_thread = threading.Thread(target=run_cleanup_loop, daemon=True)
    cleaner_thread.start()
    return cleaner_thread
