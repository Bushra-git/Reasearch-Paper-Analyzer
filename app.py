from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import fitz
import os
import re
from collections import Counter

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load model with error handling
try:
    model_path = os.path.join(current_dir, "model.pkl")
    model = pickle.load(open(model_path, "rb"))
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load dataset with error handling
try:
    csv_path = os.path.join(current_dir, "arxiv_clean.csv")
    dataset = pd.read_csv(csv_path)
    dataset = dataset.dropna().head(100)
except Exception as e:
    print(f"Error loading dataset: {e}")
    dataset = pd.DataFrame()

# Extract text
def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# Extract features
def extract_features(text):
    words = text.split()

    if len(words) == 0:
        return {
            "word_count": 0,
            "sentence_count": 0,
            "avg_word_length": 0,
            "readability": 50
        }

    return {
        "word_count": len(words),
        "sentence_count": text.count("."),
        "avg_word_length": sum(len(word) for word in words) / len(words),
        "readability": 50
    }

# Extract or generate summary
def extract_summary(text, max_sentences=5):
    """
    Extract abstract if available, otherwise generate extractive summary
    """
    # Try to find abstract section
    abstract_patterns = [
        r'(?i)abstract\s*\n(.*?)(?=introduction|1\.|keywords)',
        r'(?i)abstract\s*\n(.*?)(?=\n\n[A-Z])',
        r'(?i)abstract:(.*?)(?=introduction|1\.|keywords)',
    ]
    
    for pattern in abstract_patterns:
        match = re.search(pattern, text, re.DOTALL)
        if match:
            abstract = match.group(1).strip()
            # Clean up the abstract
            abstract = ' '.join(abstract.split())
            if len(abstract) > 100:  # Only use if substantial
                return abstract[:500] + "..." if len(abstract) > 500 else abstract
    
    # If no abstract found, use extractive summarization
    sentences = re.split(r'(?<=[.!?])\s+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
    
    if len(sentences) == 0:
        return "Unable to extract summary from the paper."
    
    # Score sentences based on word frequency
    words = re.findall(r'\w+', text.lower())
    word_freq = Counter(words)
    
    # Remove common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'have', 'has', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
        'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how'
    }
    
    # Calculate sentence scores
    sentence_scores = {}
    for i, sentence in enumerate(sentences[:50]):  # Consider first 50 sentences
        score = 0
        words_in_sentence = re.findall(r'\w+', sentence.lower())
        for word in words_in_sentence:
            if word not in stop_words:
                score += word_freq.get(word, 0)
        sentence_scores[i] = score
    
    # Get top sentences
    top_sentence_indices = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:max_sentences]
    top_sentence_indices.sort()  # Maintain order
    
    summary_sentences = [sentences[i] for i in top_sentence_indices]
    summary = ' '.join(summary_sentences)
    
    # Limit summary length
    if len(summary) > 500:
        summary = summary[:500] + "..."
    
    return summary

# Generate recommendations based on paper analysis
def generate_recommendations(text, features, score):
    """
    Generate specific recommendations based on paper analysis
    """
    recommendations = []
    word_count = features.get("word_count", 0)
    sentence_count = features.get("sentence_count", 0)
    avg_word_length = features.get("avg_word_length", 0)
    
    # Word count analysis
    if word_count < 2000:
        recommendations.append({
            "title": "Expand Content",
            "description": f"Your paper has {word_count} words. Consider expanding to at least 3,000-5,000 words for a comprehensive research paper. Add more detail to methodology, results, and discussion sections."
        })
    elif word_count > 15000:
        recommendations.append({
            "title": "Optimize Length",
            "description": f"Your paper has {word_count} words, which may be too lengthy. Consider condensing or removing redundant sections while maintaining key information and research quality."
        })
    else:
        recommendations.append({
            "title": "Content Length",
            "description": f"Your paper's word count ({word_count} words) is within a good range for research papers. Focus on maintaining quality over quantity."
        })
    
    # Sentence structure analysis
    if word_count > 0 and sentence_count > 0:
        avg_sentence_length = word_count / sentence_count
        if avg_sentence_length > 30:
            recommendations.append({
                "title": "Simplify Sentence Structure",
                "description": f"Average sentence length is {avg_sentence_length:.1f} words, which may reduce readability. Break down complex sentences into shorter, clearer statements for better comprehension."
            })
        elif avg_sentence_length < 10:
            recommendations.append({
                "title": "Enhance Sentence Variety",
                "description": f"Average sentence length is {avg_sentence_length:.1f} words. Try varying sentence length and structure to improve flow and maintain reader engagement."
            })
    
    # Vocabulary analysis
    if avg_word_length < 4.5:
        recommendations.append({
            "title": "Enhance Academic Vocabulary",
            "description": f"Average word length is {avg_word_length:.1f} characters. Consider using more sophisticated academic terminology to elevate the scholarly tone of your paper."
        })
    elif avg_word_length > 6:
        recommendations.append({
            "title": "Improve Clarity",
            "description": f"Average word length is {avg_word_length:.1f} characters. Some words may be overly complex. Balance technical terminology with clear explanations for accessibility."
        })
    
    # Score-based recommendations
    if score < 5:
        recommendations.append({
            "title": "Critical Improvements Needed",
            "description": "Your paper scored below 5/10. Focus on strengthening the methodology, providing clear research objectives, and improving overall organization and presentation quality."
        })
    elif score < 7:
        recommendations.append({
            "title": "Strengthen Key Sections",
            "description": "Your paper has good potential. Enhance the introduction with clearer thesis statement, expand the literature review, and provide more detailed analysis in the results section."
        })
    elif score < 8.5:
        recommendations.append({
            "title": "Polish for Excellence",
            "description": "Your paper is strong! Focus on minor refinements: enhance abstract clarity, add more citations, review formatting consistency, and ensure all tables/figures are well-labeled."
        })
    else:
        recommendations.append({
            "title": "Excellent Work",
            "description": "Your paper demonstrates high quality. Consider submitting to peer-reviewed venues or academic conferences. Continue maintaining this level of academic rigor."
        })
    
    # Repetition analysis
    words = text.split()
    if len(words) > 0:
        unique_ratio = len(set(words)) / len(words)
        if unique_ratio < 0.5:
            recommendations.append({
                "title": "Reduce Repetition",
                "description": "Your paper shows significant word repetition. Use synonyms and varied expressions to improve readability and maintain reader interest throughout the paper."
            })
    
    # Check for common issues
    if "conclusion" not in text.lower():
        recommendations.append({
            "title": "Add Conclusion Section",
            "description": "Your paper appears to lack a formal conclusion. Add a strong conclusion section that summarizes findings, implications, and suggests future research directions."
        })
    
    if len(re.findall(r'\[\d+\]|cite|ref', text, re.IGNORECASE)) < 5:
        recommendations.append({
            "title": "Increase Citations",
            "description": "Your paper has minimal citations. Strengthen your research by citing relevant literature and establishing connections to existing work in your field."
        })
    
    return recommendations


@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["file"]

    text = extract_text_from_pdf(file)

    # Extract summary early
    summary = extract_summary(text)

    features = extract_features(text)
    features_df = pd.DataFrame([features])

    score = model.predict(features_df)[0]

    # 🔥 repetition penalty
    words = text.split()
    if len(words) > 0:
        unique_ratio = len(set(words)) / len(words)
        if unique_ratio < 0.4:
            score -= 2

    score = max(0, min(10, score))

    # Generate recommendations based on analysis
    recommendations = generate_recommendations(text, features, score)

    # Similarity
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    all_docs = dataset["summary"].tolist()
    all_docs.insert(0, text)

    vectorizer = TfidfVectorizer(max_features=500)
    tfidf = vectorizer.fit_transform(all_docs)

    similarity = cosine_similarity(tfidf)[0]

    top_indices = similarity.argsort()[-6:][::-1][1:]

    similar_papers = []
    for i in top_indices:
        similar_papers.append({
            "title": dataset.iloc[i-1]["title"],
            "score": float(similarity[i])
        })

    return jsonify({
        "score": float(score),
        "features": features,
        "similar_papers": similar_papers,
        "summary": summary,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)