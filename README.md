# Pothole and Road Damage Detection System (YOLOv8)

End-to-end road damage detection using YOLOv8 on the RDD2022 dataset. This repository includes data prep, training, evaluation, and inference notebooks.

## Model

- Primary model: YOLOv8s (with additional runs using YOLOv8n for faster baselines)
- Task: multi-class object detection
- Labels: YOLO txt format
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
- Notebooks/04_inference_only.ipynb: single and batch inference with visualization

## Training and Evaluation

- Training uses the train split; validation metrics are tracked on the val split.
- Final metrics are computed on the test split with mAP50-95, mAP50, precision, and recall.
- Checkpoints: best.pt (best validation) and last.pt (latest for resume).

## Best Metrics (Run 4)

Based on [small model/4th run/results.csv](small%20model/4th%20run/results.csv) (epochs 154-190):

-  mAP50-95: 0.32462 
-  mAP50: 0.60040 
-  precision: 0.67151 
-  recall: 0.55619 



## Inference Samples

Below are side-by-side original vs boxed predictions from the small model runs:

![Random inference 1](small%20model%20(bigger)/randomimage%20(1).png)
![Random inference 2](small%20model%20(bigger)/randomimage%20(2).png)
![Random inference 3](small%20model%20(bigger)/randomimage%20(3).png)





