import urllib.request
import sys

try:
    r = urllib.request.urlopen('http://127.0.0.1:8000/', timeout=5)
    print("ROOT OK:", r.read().decode())
except Exception as e:
    print(f"ROOT FAILED: {e}")

try:
    r = urllib.request.urlopen('http://127.0.0.1:8000/company/', timeout=5)
    print("COMPANY GET OK: status", r.status, r.read().decode())
except Exception as e:
    print(f"COMPANY GET FAILED: {e}")

try:
    r = urllib.request.urlopen('http://127.0.0.1:8000/job/', timeout=5)
    print("JOB GET OK: status", r.status, r.read().decode())
except Exception as e:
    print(f"JOB GET FAILED: {e}")
