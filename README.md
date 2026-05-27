# Pothole and Road Damage Detection System (YOLOv8 + MLOps)

End-to-end road damage detection using YOLOv8 on the RDD2022 dataset. This repository currently covers data prep, training, and evaluation in Kaggle notebooks. MLOps components (MLflow, DVC, CI/CD, deployment, monitoring) will be added later.

## Dataset

- Source: RDD2022 Kaggle dataset
- Format: YOLO txt labels
- Structure: RDD_SPLIT/{train,val,test}/{images,labels}

### Class Mapping (RDD2022)

- 0: longitudinal crack
- 1: transverse crack
- 2: alligator crack
- 3: other corruption
- 4: Pothole

## Notebooks

- Notebooks/01_data_prep.ipynb: data loading, validation, and data.yaml generation
- Notebooks/02_train_yolov8.ipynb: YOLOv8 training with checkpoint resume
- Notebooks/03_evaluate_yolov8.ipynb: evaluation and sample inference

## Inference Samples

Below are side-by-side original vs boxed predictions from the small model runs:

![Random inference 1](small%20model%20(bigger)/randomimage%20(1).png)
![Random inference 2](small%20model%20(bigger)/randomimage%20(2).png)
![Random inference 3](small%20model%20(bigger)/randomimage%20(3).png)





