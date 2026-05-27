# Road Damage Detection System

A multi-class road damage detection system built on **YOLOv8s**, trained on the [RDD2022](https://github.com/sekilab/RoadDamageDetector) dataset. The system detects 5 categories of road surface damage including potholes, longitudinal cracks, transverse cracks, alligator cracks, and other corruptions.

---

## Results

| Metric | Value |
|---|---|
| mAP@0.5 | **0.600** |
| mAP@0.5:0.95 | 0.318 |
| Precision | 0.668 |
| Recall | 0.552 |

Training was conducted over 190 epochs on a multi-GPU setup using augmentation strategies including mosaic, copy-paste, multi-scale training, and cosine annealing LR scheduling.

---

## Sample Detections

<p align="center">
  <img src="small%20model/randomimage%20(1).png" width="30%"/>
  <img src="small%20model/randomimage%20(2).png" width="30%"/>
  <img src="small%20model/randomimage%20(3).png" width="30%"/>
</p>

---

## Dataset

**Source:** [RDD2022 on Kaggle](https://www.kaggle.com/datasets/competitions/road-damage-detection-2022)

**Total annotations:** ~46,000 across 5 classes

| Class ID | Label | Count |
|---|---|---|
| 0 | Longitudinal Crack | 18,201 |
| 1 | Transverse Crack | 8,386 |
| 2 | Alligator Crack | 7,527 |
| 3 | Other Corruption | 7,554 |
| 4 | Pothole | 4,628 |

**Format:** YOLO `.txt` labels

**Split structure:**
```
RDD_SPLIT/
├── train/
│   ├── images/
│   └── labels/
├── val/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
```

---

## Model

| Property | Detail |
|---|---|
| Architecture | YOLOv8s (Ultralytics) |
| Input size | 640×640 |
| Batch size | 16 |
| Epochs | 190 |
| Device | Multi-GPU (2×) |
| Baseline | YOLOv8n |

### Training Configuration

```python
model.train(
    data='data.yaml',
    epochs=200,
    imgsz=640,
    batch=16,
    device='0,1',
    multi_scale=True,
    mosaic=1.0,
    copy_paste=0.3,
    degrees=10.0,
    scale=0.5,
    cls=0.5,
    box=7.5,
    patience=50,
)
```

---

## Repository Structure

```
├── Notebooks/
│   ├── 01_data_prep.ipynb        # Data loading, validation, data.yaml generation
│   ├── 02_train_yolov8.ipynb     # YOLOv8 training with checkpoint resume support
│   ├── 03_evaluate_yolov8.ipynb  # Evaluation and sample inference on test split
│   └── 04_inference_only.ipynb   # Single and batch inference with visualization
├── small model/
│   └── *.png                     # Sample inference outputs
└── README.md
```

---

## Setup & Usage

### Install dependencies
```bash
pip install ultralytics
```

### Run inference
```python
from ultralytics import YOLO

model = YOLO('best.pt')
results = model.predict(source='your_image.jpg', conf=0.25, save=True)
```

### Evaluate on test set
```python
metrics = model.val(data='data.yaml', split='test')
print(metrics.box.map50)
```

---

## Per-Class Performance

| Class | Precision | Recall | AP@0.5 |
|---|---|---|---|
| Longitudinal Crack | 0.645 | 0.524 | 0.568 |
| Transverse Crack | 0.591 | 0.549 | 0.562 |
| Alligator Crack | 0.700 | 0.570 | 0.641 |
| Other Corruption | 0.713 | 0.719 | 0.749 |
| Pothole | 0.693 | 0.396 | 0.479 |

---

## License

This project uses the RDD2022 dataset which is publicly available for research purposes.
