from ultralytics import YOLO

model = YOLO('yolov10n.pt')  # Load model

results = model(source='diddy.jpeg', show=True, conf=0.4, save=True)  

