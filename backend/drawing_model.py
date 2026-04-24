import cv2
import numpy as np
import sys

try:
    # Load image
    img = cv2.imread(sys.argv[1])

    if img is None:
        print("Unknown")
        exit()

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Blur to remove noise
    blur = cv2.GaussianBlur(gray, (5, 5), 0)

    # Adaptive threshold (better for hand-drawn shapes)
    thresh = cv2.adaptiveThreshold(
        blur,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        11,
        2
    )

    # Find contours
    contours, _ = cv2.findContours(
        thresh,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    if len(contours) == 0:
        print("No Shape Detected")
        exit()

    # Get largest contour (main drawing)
    cnt = max(contours, key=cv2.contourArea)

    area = cv2.contourArea(cnt)
    if area < 100:
        print("No Shape Detected")
        exit()

    perimeter = cv2.arcLength(cnt, True)
    if perimeter == 0:
        print("Unknown")
        exit()

    approx = cv2.approxPolyDP(cnt, 0.04 * perimeter, True)

    vertices = len(approx)

    # 🔥 SHAPE DETECTION
    if vertices == 3:
        print("Triangle")

    elif vertices == 4:
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = float(w) / h

        if 0.8 <= aspect_ratio <= 1.2:
            print("Square")
        else:
            print("Rectangle")

    elif vertices > 6:
        # Circle check using area ratio
        area_contour = cv2.contourArea(cnt)
        (x, y), radius = cv2.minEnclosingCircle(cnt)
        area_circle = np.pi * radius * radius

        if area_circle > 0 and (area_contour / area_circle) > 0.6:
            print("Circle")
        else:
            print("Unknown")

    else:
        print("Unknown")

except Exception as e:
    print("Error")