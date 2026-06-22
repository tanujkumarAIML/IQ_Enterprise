"""Legacy report service - wraps report_generator for backward compatibility."""

from services.report_generator import generate_full_report

def generate_report(results: list) -> dict:
    """Generate interview report from list of evaluated answers."""
    return generate_full_report(results)
