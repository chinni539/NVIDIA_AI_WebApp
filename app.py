import os
import requests
from flask import Flask, render_template, request
import markdown
import pandas as pd
from collections import Counter

app = Flask(__name__)

# NVIDIA Configuration
NVIDIA_API_URL = os.environ.get(
    "NVIDIA_API_URL",
    "https://integrate.api.nvidia.com/v1/chat/completions",
)

NVIDIA_MODEL = os.environ.get(
    "NVIDIA_MODEL",
    "nvidia/ising-calibration-1-35b-a3b",
)

NVIDIA_API_KEY = os.environ.get(
    "NVIDIA_API_KEY",
    "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"
)


def analyze_with_nvidia(prompt, max_tokens=2048):

    if not NVIDIA_API_KEY:
        return "NVIDIA API Key is missing."

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    payload = {
        "model": NVIDIA_MODEL,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": max_tokens,
        "temperature": 0.2,
        "top_p": 0.7,
        "stream": False,
    }

    try:
        response = requests.post(
            NVIDIA_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )

        response.raise_for_status()

        data = response.json()

        choices = data.get("choices", [])

        if not choices:
            return "No response returned from NVIDIA."

        message = choices[0].get("message", {})

        return message.get(
            "content",
            "No content generated."
        )

    except Exception as e:
        return f"Error: {str(e)}"


@app.route("/", methods=["GET", "POST"])
def home():

    generated_html = ""

    if request.method == "POST":

        user_prompt = request.form.get("prompt")

        if user_prompt:

            # Get response from NVIDIA model
            generated_text = analyze_with_nvidia(user_prompt)

            # Convert Markdown to HTML
            generated_html = markdown.markdown(
                generated_text,
                extensions=[
                    "extra",
                    "tables",
                    "fenced_code"
                ]
            )

    return render_template(
        "index.html",
        result=generated_html
    )

@app.route("/rejection-analysis")
def rejection_analysis():

    excel_file = "RejectionData.xlsx"

    try:

        df = pd.read_excel(excel_file)

        # Actual column names from your Excel
        state_col = "STATE"
        county_col = "County"
        reason_col = "Event Description for EOF"

        # ---------------- Top States ----------------

        top_states = (
            df[state_col]
            .value_counts()
            .head(10)
            .items()
        )

        # ---------------- Top Counties ----------------

        top_counties = (
            df[county_col]
            .value_counts()
            .head(10)
            .items()
        )

        # ---------------- Top Rejection Reasons ----------------

        all_reasons = []

        for reason in df[reason_col].dropna():

            # Remove common prefix
            reason = str(reason)

            reason = reason.replace(
                "Package created. EFiling order failed due: vendor.",
                ""
            )

            # Split multiple reasons separated by ;
            parts = reason.split(";")

            for p in parts:

                p = p.strip()

                if p:
                    all_reasons.append(p)

        top_reasons = Counter(all_reasons).most_common(10)

        # ---------------- AI Analysis ----------------

        prompt = f"""
You are a Senior Business Analyst working in Mortgage and eRecording domain.

Analyze the rejection data and provide:

1. Executive Summary.
2. Top observations.
3. Root causes.
4. Why these states/counties have higher rejections.
5. Recommendations to reduce rejections.
6. Preventive actions.
7. State specific recommendations.

Top Rejected States:
{list(top_states)}

Top Rejected Counties:
{list(top_counties)}

Top Rejection Reasons:
{top_reasons}

Provide detailed analysis in markdown format.
"""

        ai_analysis = analyze_with_nvidia(prompt)

        ai_html = markdown.markdown(
            ai_analysis,
            extensions=["extra", "tables"]
        )

        return render_template(
            "rejection_dashboard.html",
            top_states=list(top_states),
            top_counties=list(top_counties),
            top_reasons=top_reasons,
            ai_analysis=ai_html
        )

    except Exception as e:

        return render_template(
            "rejection_dashboard.html",
            error=str(e)
        )

if __name__ == "__main__":
    app.run(debug=True)