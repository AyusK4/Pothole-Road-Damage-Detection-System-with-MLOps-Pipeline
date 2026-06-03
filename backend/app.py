import base64
import io
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO


MODEL_PATH = Path(__file__).resolve().parents[1] / "Best.pt"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO(str(MODEL_PATH))


def encode_image_to_base64(img: Image.Image) -> str:
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Empty filename")

    image_bytes = await file.read()
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image: {exc}") from exc

    img_np = np.array(img)
    results = model.predict(source=img_np, conf=0.25, iou=0.7, verbose=False)
    r0 = results[0]

    detections = []
    if r0.boxes is not None and len(r0.boxes) > 0:
        boxes = r0.boxes.xyxy.cpu().numpy().tolist()
        scores = r0.boxes.conf.cpu().numpy().tolist()
        labels = r0.boxes.cls.cpu().numpy().tolist()
        for box, score, cls_id in zip(boxes, scores, labels):
            name = r0.names.get(int(cls_id), str(int(cls_id)))
            detections.append(
                {
                    "class_id": int(cls_id),
                    "class_name": name,
                    "confidence": float(score),
                    "box": [float(v) for v in box],
                }
            )

    plotted = r0.plot()
    if plotted is None:
        raise HTTPException(status_code=500, detail="Failed to render output image")

    annotated = Image.fromarray(plotted[:, :, ::-1])
    encoded = encode_image_to_base64(annotated)

    return {"image_base64": encoded, "detections": detections}
