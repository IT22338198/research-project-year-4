# 🍃 SmartTea – AI-Based Intelligent Mobile Application for the Tea Industry

## 📌 Project Overview

**SmartTea** is an AI-powered mobile application developed to modernize and digitalize the tea industry. The system leverages **Machine Learning, Deep Learning, and Data Analytics** to assist tea farmers, estate managers, and other stakeholders in making **accurate, data-driven decisions**.

The application focuses on improving tea leaf quality assessment, reducing crop losses caused by diseases, optimizing harvest planning, and predicting tea market prices through intelligent automation.

---

## 🎯 Key Objectives

- Improve tea leaf quality assessment using AI-based image classification  
- Enable early detection of tea leaf diseases to minimize crop damage  
- Predict future tea prices to support better financial planning  
- Optimize tea harvesting schedules and accurately estimate labour costs  

---

## 🧩 System Components

### 1️⃣ Tea Leaf Quality Classification
- Uses image-based deep learning models 
- Classifies tea leaves into quality categories:
  - **Best**
  - **Below Best**
  - **Poor**
- Helps farmers maintain export-quality standards and improve market value

### 2️⃣ Tea Leaf Disease Detection
- Identifies common tea leaf diseases using image recognition
- Enables early-stage disease detection to reduce yield loss
- Provides disease classification and severity insights

### 3️⃣ Tea Price Prediction
- Uses historical tea auction and market data
- Predicts future tea prices using machine learning regression models
- Supports farmers, exporters, and estate managers in decision-making

### 4️⃣ Tea Harvest Prediction & Labour Cost Estimation
- Predicts optimal harvesting time based on weather and historical yield data
- Estimates required labour force and associated costs
- Helps improve operational efficiency and reduce unnecessary expenses

---

## 🏗️ System Architecture

The SmartTea system follows a **client–server architecture** integrated with AI models for intelligent decision-making.

### Architecture Overview
- **Mobile Application**  
  Users can upload tea leaf images, view predictions, and receive recommendations.

- **Backend Server**  
  Handles API requests, authentication, data processing, and AI model inference.

- **Machine Learning Models**  
  Perform tea leaf quality classification, disease detection, and predictive analytics.

- **Database Layer**  
  Stores user data, prediction results, and historical records.

- **External APIs**  
  Provide real-time weather and tea market-related data.

![SmartTea Architecture](https://drive.google.com/uc?export=view&id=1dNVYJ5_N0HIU0YFyFpKNhapJH9xbFQpo)

---

## 📦 Project Dependencies

### 🧠 Machine Learning & AI Dependencies

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms, models
from PIL import Image
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
